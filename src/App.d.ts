export interface HashMap<V> {
    [k: string]: V;
}

export enum LuminaCellType {
    Text = "text",
    Number = "number",
}

export type TLuminaCellValue = string;

export interface ILuminaCellStyle {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    backgroundColor?: string;
    textColor?: string;
    textAlignment?: "left" | "center" | "right";
    verticalAlignment?: "top" | "middle" | "bottom";
    fontSize?: number;
}

export interface ILuminaCell {
    id: string;
    type?: LuminaCellType;
    value: TLuminaCellValue;
    style?: ILuminaCellStyle;
}

export interface ILuminaRow {
    id: string;
    cells: Array<ILuminaCell>;
}

export interface ILuminaRowStyle {
    height?: number;
}

export interface ILuminaColStyle {
    width?: number;
}

export interface ILuminaSheetStyle {
    rows: HashMap<ILuminaRowStyle>;
    cols: HashMap<ILuminaColStyle>;
}

export interface ILuminaSheet {
    id: string;
    style: ILuminaSheetStyle;
    rows: Array<ILuminaRow>;
}

export interface Settings {
    autofocus: boolean;
    stripes: boolean;
    rowBand: boolean;
    colBand: boolean;
    referenceVisible: boolean;
}

export interface CellCoordinates {
    rowIndex: number;
    cellIndex: number;
}

export interface CellSelection {
    start: CellCoordinates;
    end: CellCoordinates;
}
