/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { ulid } from "ulid";
import { parse as PapaParse } from "papaparse";
import { CellCoordinates, ILuminaCell, ILuminaCellStyle, ILuminaColStyle, ILuminaFile, ILuminaRow, ILuminaRowStyle, ILuminaSheet, Settings } from "../App.d";
import { useRAM } from "./ram";

const INITIAL_ROW_COUNT = Math.floor(window.innerHeight / 24);
const INITIAL_COLUMN_COUNT = Math.floor(window.innerWidth / 75);

const IMPORT_MIN_ROW_COUNT = 25;
const IMPORT_MIN_COLUMN_COUNT = 10;

const getImportRowCount = (rowCount: number) => Math.max(rowCount, IMPORT_MIN_ROW_COUNT);
const getImportColumnCount = (columnCount: number) => Math.max(columnCount, IMPORT_MIN_COLUMN_COUNT);

const emptyCell = (value: string = ""): ILuminaCell => ({ id: "cell_" + ulid(), value });
const emptyRow = (cellCount: number): ILuminaRow => ({ id: "row_" + ulid(), cells: [...Array(cellCount).keys()].map(() => emptyCell()) });
const emptySheet = (index: number = 0, rowCount: number = INITIAL_ROW_COUNT, columnCount: number = INITIAL_COLUMN_COUNT) =>
    ({ id: "sheet_" + ulid(), name: "Sheet " + (index + 1), style: { rows: {}, cols: {}, }, rows: [...Array(rowCount).keys()].map(() => emptyRow(columnCount)) });

export const useStore = defineStore("lumina", () => {
    const RAM = useRAM();

    const file = ref<ILuminaFile>({
        id: "lumina_" + ulid(),
        name: "Lumina",
        sheets: [emptySheet()],
        settings: {
            autofocus: true,
            zoom: "100%",
            referenceVisible: false,
            showStyleBar: true,
            showFormulaBar: true,
            showGridlines: true,
            showStripes: false,
            showRowBand: false,
            showColumnBand: false,
            showFormulae: false,
        },
    });

    /** File */
    const loadFromJSON = async (f: File) => file.value = JSON.parse(await f.text());
    const loadFromCSV = async (f: File) => {
        const parsed = PapaParse(await f.text());

        if (parsed.errors.length) {
            alert("Error: " + parsed.errors[0].message);
            return;
        }

        const data = parsed.data as Array<Array<string>>;
        const rowCount = data.length;
        const columnCount = Math.max(...data.map(r => r.length));

        addSheet(file.value.sheets.length, getImportRowCount(rowCount), getImportColumnCount(columnCount));

        const sheetIndex = file.value.sheets.length - 1;
        setActiveSheet(sheetIndex);
        setSheetName(sheetIndex, f.name);

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < data[i].length; j++) {
                sheet.value.rows[i].cells[j].value = data[i][j];
            }
        }
    };

    const setFileName = (name: string) => file.value.name = name;

    /** Settings */
    const updateSettings = (settings: Settings) => file.value.settings = settings;

    /** Sheets */
    const activeSheetIndex = ref<number>(0);
    const sheet = computed({ get() { return file.value.sheets[activeSheetIndex.value]; }, set(v: ILuminaSheet) { file.value.sheets[activeSheetIndex.value] = v; } });
    const rowCount = computed(() => sheet.value.rows.length);
    const columnCount = computed(() => sheet.value.rows[0].cells.length);

    const setActiveSheet = (index: number) => activeSheetIndex.value = index;
    const setSheetName = (index: number, name: string) => file.value.sheets[index].name = name;
    const addSheet = (index: number = -1, rowCount: number = INITIAL_ROW_COUNT, columnCount: number = INITIAL_COLUMN_COUNT) => {
        if (index === -1) index = file.value.sheets.length;
        file.value.sheets.push(emptySheet(index, rowCount, columnCount));
    };
    const deleteSheet = (index: number) => {
        file.value.sheets.splice(index, 1);
        if (!file.value.sheets.length) addSheet();
    };
    const moveSheetLeft = (index: number) => {
        if (index === 0) return;
        [file.value.sheets[index - 1], file.value.sheets[index]] = [file.value.sheets[index], file.value.sheets[index - 1]];
    };
    const moveSheetRight = (index: number) => {
        if (index === file.value.sheets.length - 1) return;
        [file.value.sheets[index], file.value.sheets[index + 1]] = [file.value.sheets[index + 1], file.value.sheets[index]];
    };

    /** Sheet style */
    const updateRowStyle = (index: number, style: ILuminaRowStyle) => sheet.value.style.rows[index] = { ...sheet.value.style.rows[index], ...style };
    const updateColStyle = (index: number, style: ILuminaColStyle) => sheet.value.style.cols[index] = { ...sheet.value.style.cols[index], ...style };
    const getFrozenTop = (rowIndex: number) => {
        let t = 24;

        for (let i = 0; i < rowIndex; i++) {
            if (sheet.value.style.rows?.[i]?.frozen) {
                t += sheet.value.style.rows?.[i]?.height || 24;
            }
        }

        return t;
    };
    const getFrozenLeft = (cellIndex: number) => {
        let l = 40;

        for (let i = 0; i < cellIndex; i++) {
            if (sheet.value.style.cols?.[i]?.frozen) {
                l += sheet.value.style.cols?.[i]?.width || 80;
            }
        }

        return l;
    };

    /** Rows / Columns */
    const addRow = (index?: number) => index ? sheet.value.rows.splice(index, 0, emptyRow(columnCount.value)) : sheet.value.rows.push(emptyRow(columnCount.value));
    const addColumn = (index?: number) => {
        for (let i = 0; i < rowCount.value; i++) {
            index ?
                sheet.value.rows[i].cells.splice(index, 0, emptyCell()) :
                sheet.value.rows[i].cells.push(emptyCell());
        }
    };
    const deleteRow = (index: number) => {
        sheet.value.rows.splice(index, 1);

        !rowCount.value && addRow();
    };
    const deleteColumn = (index: number) => {
        for (let i = 0; i < rowCount.value; i++) {
            sheet.value.rows[i].cells.splice(index, 1);
        }

        !columnCount.value && addColumn();
    };

    /** Move Row / Colum */
    const moveRowUp = (index: number) => {
        if (index === 0) return;
        [sheet.value.rows[index - 1], sheet.value.rows[index]] = [sheet.value.rows[index], sheet.value.rows[index - 1]];
    };
    const moveRowDown = (index: number) => {
        if (index === rowCount.value - 1) return;
        [sheet.value.rows[index], sheet.value.rows[index + 1]] = [sheet.value.rows[index + 1], sheet.value.rows[index]];
    };
    const moveColumnLeft = (index: number) => {
        if (index === 0) return;

        for (let i = 0; i < rowCount.value; i++) {
            [sheet.value.rows[i].cells[index - 1], sheet.value.rows[i].cells[index]] = [sheet.value.rows[i].cells[index], sheet.value.rows[i].cells[index - 1]];
        }
    };
    const moveColumnRight = (index: number) => {
        if (index === columnCount.value - 1) return;

        for (let i = 0; i < rowCount.value; i++) {
            [sheet.value.rows[i].cells[index], sheet.value.rows[i].cells[index + 1]] = [sheet.value.rows[i].cells[index + 1], sheet.value.rows[i].cells[index]];
        }
    };

    /** Update cells */
    const updateCell = ({ rowIndex, cellIndex }: CellCoordinates, cell: ILuminaCell) => sheet.value.rows[rowIndex].cells[cellIndex] = cell;
    const updateActiveCell = (cell: ILuminaCell) => updateCell(RAM.activeCellCoordinates, cell);
    const setCellValue = ({ rowIndex, cellIndex }: CellCoordinates, v: string) => sheet.value.rows[rowIndex].cells[cellIndex].value = v;
    const setActiveCellValue = (v: string) => setCellValue(RAM.activeCellCoordinates, v);

    /** Cell Style */
    const updateCellStyle = (coords: CellCoordinates, style: ILuminaCellStyle) => sheet.value.rows[coords.rowIndex].cells[coords.cellIndex].style = style;
    const updateSelectionStyle = (style: ILuminaCellStyle) => {
        for (let rowIndex = RAM.selectedCells.start.rowIndex; rowIndex <= RAM.selectedCells.end.rowIndex; rowIndex++) {
            for (let cellIndex = RAM.selectedCells.start.cellIndex; cellIndex <= RAM.selectedCells.end.cellIndex; cellIndex++) {
                updateCellStyle({ rowIndex, cellIndex }, { ...sheet.value.rows[rowIndex].cells[cellIndex].style, ...style });
            }
        }
    };
    const updateActiveCellStyle = (style: ILuminaCellStyle) => updateActiveCell({ ...RAM.ActiveCell, style: { ...RAM.ActiveCell.style, ...style } });
    const updateStyle = (style: ILuminaCellStyle) => RAM.hasSelection ? updateSelectionStyle(style) : updateActiveCellStyle(style);
    const clearStyle = () => {
        if (RAM.hasSelection) {
            for (let rowIndex = RAM.selectedCells.start.rowIndex; rowIndex <= RAM.selectedCells.end.rowIndex; rowIndex++) {
                for (let cellIndex = RAM.selectedCells.start.cellIndex; cellIndex <= RAM.selectedCells.end.cellIndex; cellIndex++) {
                    const style = sheet.value.rows[rowIndex].cells[cellIndex].style;
                    updateCellStyle({ rowIndex, cellIndex }, style && style.merged ? { merged: style.merged } : {});
                }
            }
        } else {
            const style = RAM.ActiveCell.style;
            updateCellStyle(RAM.activeCellCoordinates, style && style.merged ? { merged: style.merged } : {});
        }
    };

    return {
        file,

        loadFromJSON,
        loadFromCSV,

        setFileName,
        updateSettings,

        activeSheetIndex,
        sheet,
        rowCount,
        columnCount,

        setActiveSheet,
        setSheetName,
        addSheet,
        deleteSheet,
        moveSheetLeft,
        moveSheetRight,

        updateColStyle,
        updateRowStyle,
        getFrozenTop,
        getFrozenLeft,

        addRow,
        addColumn,
        deleteRow,
        deleteColumn,

        moveRowUp,
        moveRowDown,
        moveColumnLeft,
        moveColumnRight,

        updateCell,
        updateActiveCell,
        setCellValue,
        setActiveCellValue,

        updateCellStyle,
        updateSelectionStyle,
        updateActiveCellStyle,
        updateStyle,
        clearStyle,
    };
});
