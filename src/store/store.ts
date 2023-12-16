/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ulid } from "ulid";
import { CellCoordinates, CellSelection, ILuminaCell, ILuminaCellStyle, ILuminaColStyle, ILuminaFile, ILuminaRow, ILuminaRowStyle, ILuminaSheet, Settings } from "../App.d";
import { indexToColumn } from "../utils/helpers";

const INITIAL_ROW_COUNT = Math.floor(window.innerHeight / 24);
const INITIAL_COLUMN_COUNT = Math.floor(window.innerWidth / 75);

const emptyCell = (): ILuminaCell => ({ id: "cell_" + ulid(), value: "" });
const emptyRow = (cellCount: number): ILuminaRow => ({ id: "row_" + ulid(), cells: [...Array(cellCount).keys()].map(() => emptyCell()) });
const emptySheet = (count: number) => ({ id: "sheet_" + ulid(), name: "Sheet " + (count + 1), style: { rows: {}, cols: {}, }, rows: [...Array(INITIAL_ROW_COUNT).keys()].map(() => emptyRow(INITIAL_COLUMN_COUNT)) });

export const useStore = defineStore("lumina", () => {
    const file = ref<ILuminaFile>({
        id: "lumina_" + ulid(),
        name: "Lumina",
        sheets: [emptySheet(0)],
        settings: {
            autofocus: true,
            stripes: false,
            rowBand: false,
            colBand: false,
            referenceVisible: false,
        },
    });

    /** File */
    const loadFromFile = async (f: File) => file.value = JSON.parse(await f.text());
    const setFileName = (name: string) => file.value.name = name;

    /** Settings */
    const updateSettings = (key: keyof Settings, value: boolean) => file.value.settings[key] = value;

    /** Sheets */
    const activeSheetIndex = ref<number>(0);
    const sheet = computed({ get() { return file.value.sheets[activeSheetIndex.value]; }, set(v: ILuminaSheet) { file.value.sheets[activeSheetIndex.value] = v; } });
    const rowCount = computed(() => sheet.value.rows.length);
    const columnCount = computed(() => sheet.value.rows[0].cells.length);

    const setActiveSheet = (index: number) => activeSheetIndex.value = index;
    const setSheetName = (index: number, name: string) => file.value.sheets[index].name = name;
    const addSheet = () => file.value.sheets.push(emptySheet(file.value.sheets.length));
    const deleteSheet = (index: number) => {
        file.value.sheets.splice(index, 1);
        if (!file.value.sheets.length) addSheet();
    };

    /** Sheet style */
    const updateRowStyle = (index: number, style: ILuminaRowStyle) => sheet.value.style.rows[index] = { ...sheet.value.style.rows[index], ...style };
    const updateColStyle = (index: number, style: ILuminaColStyle) => sheet.value.style.cols[index] = { ...sheet.value.style.cols[index], ...style };

    /** Row / Columns */
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

    /** Hover */
    const hoverCellCoordinates = ref<CellCoordinates>({ rowIndex: -1, cellIndex: -1 });
    const setHoverCellCoordinates = ({ rowIndex, cellIndex }: CellCoordinates) => {
        hoverCellCoordinates.value.rowIndex = rowIndex;
        hoverCellCoordinates.value.cellIndex = cellIndex;
    };

    /** Selection */
    const selectedCells = ref<CellSelection>({ start: { rowIndex: -1, cellIndex: -1 }, end: { rowIndex: -1, cellIndex: -1 } });
    const hasSelection = computed(() => selectedCells.value.start.rowIndex != selectedCells.value.end.rowIndex || selectedCells.value.start.cellIndex != selectedCells.value.end.cellIndex);
    const isSheetSelected = computed(() => {
        if (selectedCells.value.start.rowIndex != 0) return false;
        if (selectedCells.value.start.cellIndex != 0) return false;

        if (selectedCells.value.end.rowIndex != rowCount.value - 1) return false;
        if (selectedCells.value.end.cellIndex != columnCount.value - 1) return false;

        return true;
    });

    const setSelectedCells = (selection: CellSelection) => selectedCells.value = selection;
    const startSelection = () => setSelectedCells({ start: Object.assign({}, hoverCellCoordinates.value), end: Object.assign({}, hoverCellCoordinates.value) });
    const endSelection = () => {
        selectedCells.value.end = Object.assign({}, hoverCellCoordinates.value);
        setActiveCell(Object.assign({}, selectedCells.value.start));
    };

    const selectRow = (rowIndex: number) => setSelectedCells({ start: { rowIndex, cellIndex: 0 }, end: { rowIndex, cellIndex: columnCount.value - 1 } });
    const selectColumn = (cellIndex: number) => setSelectedCells({ start: { rowIndex: 0, cellIndex }, end: { rowIndex: rowCount.value - 1, cellIndex } });
    const selectSheet = () => setSelectedCells({ start: { rowIndex: 0, cellIndex: 0 }, end: { rowIndex: rowCount.value - 1, cellIndex: columnCount.value - 1 } });
    const selectActiveCell = () => setSelectedCells({ start: Object.assign({}, activeCellCoordinates.value), end: Object.assign({}, activeCellCoordinates.value) });

    /** Active cell */
    const activeCellCoordinates = ref<CellCoordinates>({ rowIndex: 0, cellIndex: 0 });
    const ActiveCell = computed(() => sheet.value.rows[activeCellCoordinates.value.rowIndex].cells[activeCellCoordinates.value.cellIndex]);
    const ActiveCellName = computed(() => indexToColumn(activeCellCoordinates.value.cellIndex) + (activeCellCoordinates.value.rowIndex + 1));

    const setActiveCell = ({ rowIndex, cellIndex }: CellCoordinates) => activeCellCoordinates.value = { rowIndex, cellIndex };

    const setActiveCellUp = () => activeCellCoordinates.value.rowIndex > 0 && (activeCellCoordinates.value.rowIndex -= 1);
    const setActiveCellRight = () => {
        activeCellCoordinates.value.cellIndex >= columnCount.value - 1 && addColumn();
        activeCellCoordinates.value.cellIndex += 1;
        selectActiveCell();
    };
    const setActiveCellDown = () => {
        activeCellCoordinates.value.rowIndex >= rowCount.value - 1 && addRow();
        activeCellCoordinates.value.rowIndex += 1;
        selectActiveCell();
    };
    const setActiveCellLeft = () => activeCellCoordinates.value.cellIndex > 0 && (activeCellCoordinates.value.cellIndex -= 1);

    const updateCell = ({ rowIndex, cellIndex }: CellCoordinates, cell: ILuminaCell) => sheet.value.rows[rowIndex].cells[cellIndex] = cell;
    const updateActiveCell = (cell: ILuminaCell) => updateCell(activeCellCoordinates.value, cell);
    const setCellValue = ({ rowIndex, cellIndex }: CellCoordinates, v: string) => sheet.value.rows[rowIndex].cells[cellIndex].value = v;
    const setActiveCellValue = (v: string) => setCellValue(activeCellCoordinates.value, v);

    /** Cell Style */
    const updateCellStyle = (coords: CellCoordinates, style: ILuminaCellStyle) => sheet.value.rows[coords.rowIndex].cells[coords.cellIndex].style = style;
    const updateSelectionStyle = (style: ILuminaCellStyle) => {
        for (let row = selectedCells.value.start.rowIndex; row <= selectedCells.value.end.rowIndex; row++) {
            for (let col = selectedCells.value.start.cellIndex; col <= selectedCells.value.end.cellIndex; col++) {
                const cellStyle = sheet.value.rows[row].cells[col].style;
                updateCellStyle({ rowIndex: row, cellIndex: col }, { ...cellStyle, ...style });
            }
        }
    };
    const updateActiveCellStyle = (style: ILuminaCellStyle) => updateActiveCell({ ...ActiveCell.value, style: { ...ActiveCell.value.style, ...style } });
    const updateStyle = (style: ILuminaCellStyle) => hasSelection.value ? updateSelectionStyle(style) : updateActiveCellStyle(style);

    return {
        file,

        loadFromFile,
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

        updateColStyle,
        updateRowStyle,

        addRow,
        addColumn,
        deleteRow,
        deleteColumn,

        hoverCellCoordinates,
        setHoverCellCoordinates,

        selectedCells,
        hasSelection,
        isSheetSelected,

        setSelectedCells,
        startSelection,
        endSelection,
        selectRow,
        selectColumn,
        selectSheet,
        selectActiveCell,

        activeCellCoordinates,
        ActiveCell,
        ActiveCellName,

        setActiveCell,
        setActiveCellUp,
        setActiveCellRight,
        setActiveCellDown,
        setActiveCellLeft,

        updateCell,
        updateActiveCell,
        setCellValue,
        setActiveCellValue,

        updateCellStyle,
        updateSelectionStyle,
        updateActiveCellStyle,
        updateStyle,
    };
});
