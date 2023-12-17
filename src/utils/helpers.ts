/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import { unparse as PapaUnparse } from "papaparse";
import { CellCoordinates, ILuminaSheet } from "../App.d";

export const operators = ["-x", "+x", "x!", "abs x", "acos x", "acosh x", "asin x", "asinh x", "atan x", "atanh x", "cbrt x", "ceil x", "cos x", "cosh x", "exp x", "expm1 x", "floor x", "length x", "ln x", "log x", "log10 x", "log2 x", "log1p x", "not x", "round x", "sign x", "sin x", "sinh x", "sqrt x", "tan x", "tanh x", "trunc x"];
export const functions = ["sum", "avg", "square", "random", "min", "max", "hypot", "pow", "atan2", "roundTo", "map", "fold", "filter", "indexOf", "join", "if"];
export const constants = ["pi", "e", "true", "false"];

export const indexToColumn = (index: number): string => {
    const res = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index % 26];
    return index >= 26 ? indexToColumn(Math.floor(index / 26) - 1) + res : res;
};

export const columnToIndex = (column: string): number => column.split("").reduce((a, v) => a * 26 + parseInt(v, 36) - 9, 0) - 1;

export const coordinatesToName = (coords: CellCoordinates) => indexToColumn(coords.cellIndex) + (coords.rowIndex + 1);

export const isNumeric = (v: string): boolean => "" + v === parseFloat(v).toString();

export const toNumber = (v: string): number => parseFloat(v);

export const isFormula = (v: string): boolean => v.startsWith("=");

export const REGEX_ROW = /[\d]+/g;
export const REGEX_COLUMN = /[a-z]{1,3}/g;
export const REGEX_CELL = /[a-z]{1,3}[\d]+/g;
export const REGEX_RANGE = /[a-z]{1,3}[\d]+[:]{1}[a-z]{1,3}[\d]+/g;

export const cleanForRegex = (c: string) => {
    for (let i = 0; i < functions.length; i++) {
        c = c.replace(functions[i], "");
    }

    for (let i = operators.length - 1; i > 0; i--) {
        c = c.replace(operators[i].split(" ")[0], "");
    }

    return c;
};

export const removeRanges = (c: string, ranges: Array<string> | null) => {
    if (!ranges) return c;

    for (let i = 0; i < ranges.length; i++) {
        c = c.replace(ranges[i], "");
    }

    return c;
};

export const cellCoordinates = (c: string): CellCoordinates | false => {
    c = cleanForRegex(c);

    const row = c.match(REGEX_ROW);
    const col = c.match(REGEX_COLUMN);

    if (!col || !row) return false;

    return {
        rowIndex: parseInt(row[0]) - 1,
        cellIndex: columnToIndex(col[0]),
    };
};

export const getRanges = (v: string) => cleanForRegex(v).match(REGEX_RANGE);
export const getCells = (v: string) => cleanForRegex(v).match(REGEX_CELL);

export const download = (filename: string, text: string) => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

export const downloadCSV = (filename: string, sheet: ILuminaSheet) => {
    let lastNonEmptyRowIndex = 0;

    for (let i = sheet.rows.length - 1; i > 0; i--) {
        let foundNonEmpty = false;

        for (let j = sheet.rows[i].cells.length - 1; j > 0; j--) {
            console.log(i, j, sheet.rows[i].cells[j].value, !!sheet.rows[i].cells[j].value);
            if (sheet.rows[i].cells[j].value) {
                lastNonEmptyRowIndex = i;
                foundNonEmpty = true;
                break;
            }
        }

        if (foundNonEmpty) break;
    }

    const data: Array<Array<string>> = [];

    for (let i = 0; i < lastNonEmptyRowIndex; i++) {
        data.push([]);

        for (let j = 0; j < sheet.rows[i].cells.length; j++) {
            data[i].push(sheet.rows[i].cells[j].value);
        }
    }

    return download(filename, PapaUnparse(data));
};
