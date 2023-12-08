
export const indexToColumn = (index: number): string => {
    const res = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index % 26];
    return index >= 26 ? indexToColumn(Math.floor(index / 26) - 1) + res : res;
};
