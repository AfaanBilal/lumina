import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ulid } from "ulid";
import { ILuminaCell, ILuminaRow, ILuminaSheet } from "../App.d";

const INITIAL_ROW_COUNT = 100;
const INITIAL_COLUMN_COUNT = Math.floor(window.innerWidth / 80);

const emptyCell = (): ILuminaCell => ({ id: "cell_" + ulid(), value: "" });
const emptyRow = (cellCount: number): ILuminaRow => ({ id: "row_" + ulid(), cells: [...Array(cellCount).keys()].map(() => emptyCell()) });

export const useStore = defineStore("counter", () => {
    const settings = ref({
        stripes: false,
        rowBand: false,
        colBand: false,
    });

    const activeCell = ref({ rowIndex: 0, cellIndex: 0 });
    const sheet = ref<ILuminaSheet>({
        id: "sheet_" + ulid(),
        rows: [...Array(INITIAL_ROW_COUNT).keys()].map(() => emptyRow(INITIAL_COLUMN_COUNT)),
    });

    const maxColumns = computed(() => Math.max(...sheet.value.rows.map(r => r.cells.length)));
    const maxRows = computed(() => sheet.value.rows.length);

    function selectCell(rowIndex: number, cellIndex: number) {
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

    function updateCell(rowIndex: number, cellIndex: number, cell: ILuminaCell) {
        sheet.value.rows[rowIndex].cells[cellIndex] = cell;
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

    return {
        settings,

        activeCell,
        selectCell,
        selectCellLeft,
        selectCellRight,
        selectCellUp,
        selectCellDown,
        updateCell,

        sheet,
        maxRows,
        addRow,
        maxColumns,
        addColumn,
    };
});
