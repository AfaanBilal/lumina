/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

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
    fontFamily?: string;
    fontSize?: number;
    border?: {
        all?: boolean;
        top?: boolean;
        right?: boolean;
        bottom?: boolean;
        left?: boolean;
    };
    borderColor?: string;
    borderType?: "solid" | "dashed" | "dotted";
    locked?: boolean;
    merged?: CellCoordinates | false;
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

export interface ILuminaRowColStyle {
    frozen?: boolean;
    hidden?: boolean;
}

export interface ILuminaRowStyle extends ILuminaRowColStyle {
    height?: number;
}

export interface ILuminaColStyle extends ILuminaRowColStyle {
    width?: number;
}

export interface ILuminaSheetStyle {
    color?: string;
    rows: HashMap<ILuminaRowStyle>;
    cols: HashMap<ILuminaColStyle>;
}

export interface ILuminaSheet {
    id: string;
    name: string;
    locked?: boolean;
    style: ILuminaSheetStyle;
    rows: Array<ILuminaRow>;
}

export interface Settings {
    autofocus: boolean;
    zoom: string;
    referenceVisible: boolean;

    showStyleBar: boolean;
    showFormulaBar: boolean;
    showGridlines: boolean;
    showStripes: boolean;
    showRowBand: boolean;
    showColumnBand: boolean;
    showFormulae: boolean;
    showHidden: boolean;
}

export interface ILuminaFile {
    id: string;
    name: string;
    sheets: Array<ILuminaSheet>;
    settings: Settings;
}

export interface CellCoordinates {
    rowIndex: number;
    cellIndex: number;
}

export interface CellSelection {
    start: CellCoordinates;
    end: CellCoordinates;
}
