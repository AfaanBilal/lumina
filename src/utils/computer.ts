import { Values } from "expr-eval";
import { HashMap } from "../App.d";
import { useStore } from "../store/store";
import { cellCoordinates, getCells, getRanges, isFormula, isNumeric, toNumber } from "./helpers";
import { parser } from "./parser";

const store = useStore();

const cellContent = (c: string): string => {
    const coords = cellCoordinates(c);
    if (!coords) return "";

    return store.sheet.rows[coords.rowIndex].cells[coords.cellIndex].value;
};

const cellValue = (c: string): string => {
    const v = cellContent(c);
    return isFormula(v) ? calculateValue(v) : v;
};

const rangeValues = (r: string): string[] => {
    const startCell = r.split(":")[0];
    const endCell = r.split(":")[1];

    const start = cellCoordinates(startCell);
    const end = cellCoordinates(endCell);

    if (!start || !end) return [];

    const values: string[] = [];

    for (let row = start.rowIndex; row <= end.rowIndex; row++) {
        for (let col = start.cellIndex; col <= end.cellIndex; col++) {
            const v = store.sheet.rows[row].cells[col].value;
            values.push(isFormula(v) ? calculateValue(v) : v);
        }
    }

    return values;
};

const ERROR = "#ERROR";

export const calculateValue = (v: string) => {
    const formula = v.substring(1);

    const values: HashMap<number | number[]> = {};

    const ranges = getRanges(formula);
    if (ranges) {
        for (let i = 0; i < ranges.length; i++) {
            values[ranges[i].toLowerCase().replace(":", "_")] = rangeValues(ranges[i]).map(toNumber);
        }
    }

    const cells = getCells(formula);
    if (cells) {
        for (let i = 0; i < cells.length; i++) {
            const v = cellValue(cells[i]);

            if (!isNumeric(v)) return ERROR;

            values[cells[i].toLowerCase()] = toNumber(v);
        }
    }

    const finalFormula = formula.toLowerCase()
        .replace("roundto", "roundTo")
        .replace("indexof", "indexOf")
        .replace(":", "_");

    try {
        return parser.parse(finalFormula).evaluate(values as Values);
    } catch (e) {
        return ERROR;
    }
};
