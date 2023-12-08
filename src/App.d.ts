export enum LuminaCellType {
    Text = "text",
    Number = "number",
}

export interface ILuminaCell {
    id: string;
    type?: LuminaCellType;
    value: string | number;
}

export interface ILuminaRow {
    id: string;
    cells: Array<ILuminaCell>;
}

export interface ILuminaSheet {
    id: string;
    rows: Array<ILuminaRow>;
}
