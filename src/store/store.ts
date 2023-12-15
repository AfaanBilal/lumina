import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ulid } from "ulid";
import { CellCoordinates, CellSelection, ILuminaCell, ILuminaCellStyle, ILuminaColStyle, ILuminaRow, ILuminaRowStyle, ILuminaSheet, Settings } from "../App.d";
import { indexToColumn } from "../utils/helpers";

const INITIAL_ROW_COUNT = Math.floor(window.innerHeight / 25);
const INITIAL_COLUMN_COUNT = Math.floor(window.innerWidth / 80);

const emptyCell = (): ILuminaCell => ({ id: "cell_" + ulid(), value: "" });
const emptyRow = (cellCount: number): ILuminaRow => ({ id: "row_" + ulid(), cells: [...Array(cellCount).keys()].map(() => emptyCell()) });

export const useStore = defineStore("counter", () => {
    const settings = ref<Settings>({
        autofocus: true,
        stripes: false,
        rowBand: false,
        colBand: false,
        referenceVisible: false,
    });

    function updateSettings(key: keyof Settings, value: boolean) {
        settings.value[key] = value;
    }

    const hoverCellCoordinates = ref<CellCoordinates>({ rowIndex: -1, cellIndex: -1 });
    function setHoverCellCoordinates({ rowIndex, cellIndex }: CellCoordinates) {
        hoverCellCoordinates.value.rowIndex = rowIndex;
        hoverCellCoordinates.value.cellIndex = cellIndex;
    }

    const selectedCells = ref<CellSelection>({ start: { rowIndex: -1, cellIndex: -1 }, end: { rowIndex: -1, cellIndex: -1 } });
    const hasSelection = computed(() => selectedCells.value.start.rowIndex != selectedCells.value.end.rowIndex || selectedCells.value.start.cellIndex != selectedCells.value.end.cellIndex);
    const isWholeSheetSelected = computed(() => {
        if (selectedCells.value.start.rowIndex != 0) return false;
        if (selectedCells.value.start.cellIndex != 0) return false;

        if (selectedCells.value.end.rowIndex != maxRows.value - 1) return false;
        if (selectedCells.value.end.cellIndex != maxColumns.value - 1) return false;

        return true;
    });

    function setSelectedCells(selection: CellSelection) {
        selectedCells.value = selection;
    }
    function startSelection() {
        selectedCells.value.start = Object.assign({}, hoverCellCoordinates.value);
        selectedCells.value.end = Object.assign({}, hoverCellCoordinates.value);
    }
    function endSelection() {
        selectedCells.value.end = Object.assign({}, hoverCellCoordinates.value);
        selectCell(Object.assign({}, selectedCells.value.start));
    }
    function selectRow(rowIndex: number) {
        selectedCells.value.start = { rowIndex, cellIndex: 0 };
        selectedCells.value.end = { rowIndex, cellIndex: maxColumns.value - 1 };
    }
    function selectColumn(cellIndex: number) {
        selectedCells.value.start = { rowIndex: 0, cellIndex };
        selectedCells.value.end = { rowIndex: maxRows.value - 1, cellIndex };
    }
    function selectSheet() {
        selectedCells.value.start = { rowIndex: 0, cellIndex: 0 };
        selectedCells.value.end = { rowIndex: maxRows.value - 1, cellIndex: maxColumns.value - 1 };
    }

    const activeCell = ref<CellCoordinates>({ rowIndex: 0, cellIndex: 0 });
    const ActiveCell = computed(() => sheet.value.rows[activeCell.value.rowIndex].cells[activeCell.value.cellIndex]);
    const ActiveCellName = computed(() => indexToColumn(activeCell.value.cellIndex) + (activeCell.value.rowIndex + 1));

    const sheet = ref<ILuminaSheet>({
        id: "sheet_" + ulid(),
        style: { rows: {}, cols: {}, },
        rows: [...Array(INITIAL_ROW_COUNT).keys()].map(() => emptyRow(INITIAL_COLUMN_COUNT)),
    });

    async function loadFromFile(file: File) {
        sheet.value = JSON.parse(await file.text());
    }

    function updateRowStyle(index: number, style: ILuminaRowStyle) {
        sheet.value.style.rows[index] = { ...sheet.value.style.rows[index], ...style };
    }
    function updateColStyle(index: number, style: ILuminaColStyle) {
        sheet.value.style.cols[index] = { ...sheet.value.style.cols[index], ...style };
    }

    const maxColumns = computed(() => Math.max(...sheet.value.rows.map(r => r.cells.length)));
    const maxRows = computed(() => sheet.value.rows.length);

    function selectCell({ rowIndex, cellIndex }: CellCoordinates) {
        activeCell.value.rowIndex = rowIndex;
        activeCell.value.cellIndex = cellIndex;
    }

    function selectCellUp() {
        if (activeCell.value.rowIndex <= 0) return;

        activeCell.value.rowIndex -= 1;
    }

    function selectCellDown() {
        if (activeCell.value.rowIndex >= maxRows.value - 1) {
            addRow();
        }

        activeCell.value.rowIndex += 1;
    }

    function selectCellLeft() {
        if (activeCell.value.cellIndex <= 0) return;

        activeCell.value.cellIndex -= 1;
    }

    function selectCellRight() {
        if (activeCell.value.cellIndex >= maxColumns.value - 1) {
            addColumn();
        }

        activeCell.value.cellIndex += 1;
    }

    function updateCell({ rowIndex, cellIndex }: CellCoordinates, cell: ILuminaCell) {
        sheet.value.rows[rowIndex].cells[cellIndex] = cell;
    }

    function updateCellStyle(coords: CellCoordinates, style: ILuminaCellStyle) {
        sheet.value.rows[coords.rowIndex].cells[coords.cellIndex].style = style;
    }

    function updateSelectionStyle(style: ILuminaCellStyle) {
        for (let row = selectedCells.value.start.rowIndex; row <= selectedCells.value.end.rowIndex; row++) {
            for (let col = selectedCells.value.start.cellIndex; col <= selectedCells.value.end.cellIndex; col++) {
                const cellStyle = sheet.value.rows[row].cells[col].style;
                updateCellStyle({ rowIndex: row, cellIndex: col }, { ...cellStyle, ...style });
            }
        }
    }

    function setCellValue({ rowIndex, cellIndex }: CellCoordinates, v: string) {
        sheet.value.rows[rowIndex].cells[cellIndex].value = v;
    }

    function updateActiveCell(cell: ILuminaCell) {
        updateCell(activeCell.value, cell);
    }

    function updateActiveCellStyle(style: ILuminaCellStyle) {
        updateActiveCell({ ...ActiveCell.value, style: { ...ActiveCell.value.style, ...style } });
    }

    function setActiveCellValue(v: string) {
        setCellValue(activeCell.value, v);
    }

    function updateStyle(style: ILuminaCellStyle) {
        hasSelection.value ?
            updateSelectionStyle(style) :
            updateActiveCellStyle(style);
    }

    function addRow(index?: number) {
        if (index) {
            sheet.value.rows.splice(index, 0, emptyRow(maxColumns.value));
        } else {
            sheet.value.rows.push(emptyRow(maxColumns.value));
        }
    }

    function addColumn(index?: number) {
        for (let i = 0; i < sheet.value.rows.length; i++) {
            if (index) {
                sheet.value.rows[i].cells.splice(index, 0, emptyCell());
            } else {
                sheet.value.rows[i].cells.push(emptyCell());
            }
        }
    }

    function deleteRow(index: number) {
        sheet.value.rows.splice(index, 1);

        if (!sheet.value.rows.length) addRow();
    }

    function deleteColumn(index: number) {
        for (let i = 0; i < sheet.value.rows.length; i++) {
            sheet.value.rows[i].cells.splice(index, 1);
        }

        if (!sheet.value.rows[0].cells.length) addColumn();
    }

    return {
        settings,
        updateSettings,

        loadFromFile,

        hoverCellCoordinates,
        setHoverCellCoordinates,

        selectedCells,
        setSelectedCells,
        startSelection,
        endSelection,
        hasSelection,
        selectRow,
        selectColumn,
        isWholeSheetSelected,
        selectSheet,

        updateColStyle,
        updateRowStyle,

        activeCell,
        ActiveCell,
        ActiveCellName,
        selectCell,
        selectCellLeft,
        selectCellRight,
        selectCellUp,
        selectCellDown,
        updateCell,
        updateCellStyle,
        updateSelectionStyle,
        updateActiveCell,
        updateActiveCellStyle,
        setCellValue,
        setActiveCellValue,
        updateStyle,

        sheet,
        maxRows,
        addRow,
        maxColumns,
        addColumn,

        deleteRow,
        deleteColumn,
    };
});
