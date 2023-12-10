export interface HashMap<V> {
    [k: string]: V;
}

export enum LuminaCellType {
    Text = "text",
    Number = "number",
}

export type TLuminaCellValue = string;

export interface ILuminaCell {
    id: string;
    type?: LuminaCellType;
    value: TLuminaCellValue;
}

export interface ILuminaRow {
    id: string;
    cells: Array<ILuminaCell>;
}

export interface ILuminaSheet {
    id: string;
    rows: Array<ILuminaRow>;
}

export interface Settings {
    autofocus: boolean;
    stripes: boolean;
    rowBand: boolean;
    colBand: boolean;
}

export interface CellCoordinates {
    rowIndex: number;
    cellIndex: number;
}
