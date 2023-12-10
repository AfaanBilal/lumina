
export const indexToColumn = (index: number): string => {
    const res = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index % 26];
    return index >= 26 ? indexToColumn(Math.floor(index / 26) - 1) + res : res;
};

export const columnToIndex = (column: string): number => column.split("").reduce((a, v) => a * 26 + parseInt(v, 36) - 9, 0) - 1;

export const isNumeric = (v: string): boolean => v === parseFloat(v).toString();

export const toNumber = (v: string): number => parseFloat(v);

export const isFormula = (v: string): boolean => v.startsWith("=");
