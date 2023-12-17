/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import { Values } from "expr-eval";
import { HashMap } from "../App.d";
import { useStore } from "../store/store";
import { cellCoordinates, getCells, getRanges, isFormula, isNumeric, removeRanges, toNumber } from "./helpers";
import { parser } from "./parser";

const cellContent = (c: string): string => {
    const coords = cellCoordinates(c);
    if (!coords) return "";

    return useStore().sheet.rows[coords.rowIndex].cells[coords.cellIndex].value;
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
            const v = useStore().sheet.rows[row].cells[col].value;
            values.push(isFormula(v) ? calculateValue(v) : v);
        }
    }

    return values;
};

const ERROR = "#ERROR";

export const calculateValue = (v: string) => {
    const formula = v.substring(1).toLowerCase();

    const values: HashMap<number | number[]> = {};

    let finalFormula = formula;

    const ranges = getRanges(formula);
    if (ranges) {
        for (let i = 0; i < ranges.length; i++) {
            values[ranges[i].replace(":", "_")] = rangeValues(ranges[i]).map(toNumber);

            const rangeParts = ranges[i].split(":");
            finalFormula = finalFormula.replace(ranges[i], rangeParts[0] + "_" + rangeParts[1]);
        }
    }

    const cells = getCells(removeRanges(formula, ranges));
    if (cells) {
        for (let i = 0; i < cells.length; i++) {
            const v = cellValue(cells[i]);

            if (!isNumeric(v)) return ERROR;

            values[cells[i]] = toNumber(v);
        }
    }

    finalFormula = finalFormula
        .replace("roundto", "roundTo")
        .replace("indexof", "indexOf");

    try {
        return parser.parse(finalFormula).evaluate(values as Values);
    } catch (e) {
        return ERROR;
    }
};
