import { CellCoordinates } from "../App.d";

export const indexToColumn = (index: number): string => {
    const res = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index % 26];
    return index >= 26 ? indexToColumn(Math.floor(index / 26) - 1) + res : res;
};

export const columnToIndex = (column: string): number => column.split("").reduce((a, v) => a * 26 + parseInt(v, 36) - 9, 0) - 1;

export const isNumeric = (v: string): boolean => "" + v === parseFloat(v).toString();

export const toNumber = (v: string): number => parseFloat(v);

export const isFormula = (v: string): boolean => v.startsWith("=");

export const REGEX_ROW = /[\d]+/g;
export const REGEX_COLUMN = /[A-Z]+/g;
export const REGEX_CELL = /[A-Z]+[\d]+/g;
export const REGEX_RANGE = /[A-Z]+[\d]+[:]{1}[A-Z]+[\d]+/g;

export const cellCoordinates = (c: string): CellCoordinates | false => {
    const row = c.toUpperCase().match(REGEX_ROW);
    const col = c.toUpperCase().match(REGEX_COLUMN);

    if (!col || !row) return false;

    return {
        rowIndex: parseInt(row[0]) - 1,
        cellIndex: columnToIndex(col[0]),
    };
};

export const getRanges = (v: string) => v.toUpperCase().match(REGEX_RANGE);
export const getCells = (v: string) => v.toUpperCase().match(REGEX_CELL);
