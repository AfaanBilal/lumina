export enum LuminaCellType {
    Text = "text",
    Number = "number",
}

export type TLuminaCellValue = string | number;

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
