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
import { CellCoordinates, CellSelection, ILuminaCellStyle } from "../App";
import { coordinatesToName, nonStyleProps } from "../utils/helpers";
import { useStore } from "./store";

export const useRAM = defineStore("lumina-ram", () => {
    const store = useStore();

    /** Hover */
    const hoverCellCoordinates = ref<CellCoordinates>({ rowIndex: -1, cellIndex: -1 });
    const setHoverCellCoordinates = ({ rowIndex, cellIndex }: CellCoordinates) => {
        hoverCellCoordinates.value.rowIndex = rowIndex;
        hoverCellCoordinates.value.cellIndex = cellIndex;
    };

    /** Selection */
    const selectedCells = ref<CellSelection>({ start: { rowIndex: -1, cellIndex: -1 }, end: { rowIndex: -1, cellIndex: -1 } });
    const hasSelection = computed(() => selectedCells.value.start.rowIndex != selectedCells.value.end.rowIndex || selectedCells.value.start.cellIndex != selectedCells.value.end.cellIndex);
    const SelectionName = computed(() => coordinatesToName(selectedCells.value.start) + ":" + coordinatesToName(selectedCells.value.end));
    const isSheetSelected = computed(() => {
        if (selectedCells.value.start.rowIndex != 0) return false;
        if (selectedCells.value.start.cellIndex != 0) return false;

        if (selectedCells.value.end.rowIndex != store.rowCount - 1) return false;
        if (selectedCells.value.end.cellIndex != store.columnCount - 1) return false;

        return true;
    });

    const setSelectedCells = (selection: CellSelection) => selectedCells.value = selection;
    const startSelection = () => setSelectedCells({ start: Object.assign({}, hoverCellCoordinates.value), end: Object.assign({}, hoverCellCoordinates.value) });
    const endSelection = () => {
        selectedCells.value.end = Object.assign({}, hoverCellCoordinates.value);
        setActiveCell(Object.assign({}, selectedCells.value.start));
    };

    const selectRow = (rowIndex: number) => setSelectedCells({ start: { rowIndex, cellIndex: 0 }, end: { rowIndex, cellIndex: store.columnCount - 1 } });
    const selectColumn = (cellIndex: number) => setSelectedCells({ start: { rowIndex: 0, cellIndex }, end: { rowIndex: store.rowCount - 1, cellIndex } });
    const selectSheet = () => setSelectedCells({ start: { rowIndex: 0, cellIndex: 0 }, end: { rowIndex: store.rowCount - 1, cellIndex: store.columnCount - 1 } });
    const selectActiveCell = () => setSelectedCells({ start: Object.assign({}, activeCellCoordinates.value), end: Object.assign({}, activeCellCoordinates.value) });

    /** Active cell */
    const activeCellCoordinates = ref<CellCoordinates>({ rowIndex: 0, cellIndex: 0 });
    const ActiveCell = computed(() => store.sheet.rows[activeCellCoordinates.value.rowIndex].cells[activeCellCoordinates.value.cellIndex]);
    const ActiveCellName = computed(() => coordinatesToName(activeCellCoordinates.value));

    const setActiveCell = ({ rowIndex, cellIndex }: CellCoordinates) => activeCellCoordinates.value = { rowIndex, cellIndex };

    const setActiveCellUp = () => activeCellCoordinates.value.rowIndex > 0 && (activeCellCoordinates.value.rowIndex -= 1);
    const setActiveCellRight = () => {
        activeCellCoordinates.value.cellIndex >= store.columnCount - 1 && store.addColumn();
        activeCellCoordinates.value.cellIndex += 1;
        selectActiveCell();
    };
    const setActiveCellDown = () => {
        activeCellCoordinates.value.rowIndex >= store.rowCount - 1 && store.addRow();
        activeCellCoordinates.value.rowIndex += 1;
        selectActiveCell();
    };
    const setActiveCellLeft = () => activeCellCoordinates.value.cellIndex > 0 && (activeCellCoordinates.value.cellIndex -= 1);

    const formatPainterStyle = ref<ILuminaCellStyle | false>(false);
    const setFormatPainterStyle = (s: ILuminaCellStyle | false) => formatPainterStyle.value = s;
    const startPaintFormat = () => setFormatPainterStyle(Object.assign({}, ActiveCell.value.style));
    const applyPaintFormat = () => {
        if (!formatPainterStyle.value) return;

        for (let i = 0; i < nonStyleProps.length; i++) {
            if (formatPainterStyle.value[nonStyleProps[i]]) {
                delete formatPainterStyle.value[nonStyleProps[i]];
            }
        }

        store.updateStyle(formatPainterStyle.value);
        setFormatPainterStyle(false);
    };

    return {
        hoverCellCoordinates,
        setHoverCellCoordinates,

        selectedCells,
        hasSelection,
        SelectionName,
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

        formatPainterStyle,
        setFormatPainterStyle,
        startPaintFormat,
        applyPaintFormat,
    };
}, { undo: { disable: true } });
