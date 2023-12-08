import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ulid } from "ulid";
import { ILuminaCell, ILuminaRow, ILuminaSheet } from "../App.d";

const INITIAL_ROW_COUNT = 20;
const INITIAL_COLUMN_COUNT = 15;

const emptyCell = (): ILuminaCell => ({ id: "cell_" + ulid(), value: "" });
const emptyRow = (cellCount: number): ILuminaRow => ({ id: "row_" + ulid(), cells: [...Array(cellCount).keys()].map(() => emptyCell()) });

export const useStore = defineStore("counter", () => {
    const selectedCell = ref({ rowIndex: 0, cellIndex: 0 });
    const sheet = ref<ILuminaSheet>({
        id: "sheet_" + ulid(),
        rows: [...Array(INITIAL_ROW_COUNT).keys()].map(() => emptyRow(INITIAL_COLUMN_COUNT)),
    });

    const maxColumns = computed(() => Math.max(...sheet.value.rows.map(r => r.cells.length)));
    const maxRows = computed(() => sheet.value.rows.length);

    function selectCell(rowIndex: number, cellIndex: number) {
        selectedCell.value.rowIndex = rowIndex;
        selectedCell.value.cellIndex = cellIndex;
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
                if (i === index) {
                    sheet.value.rows[i].cells.push(emptyCell());
                }
            } else {
                sheet.value.rows[i].cells.push(emptyCell());
            }
        }
    }

    return {
        selectedCell,
        selectCell,
        updateCell,

        sheet,
        maxRows,
        addRow,
        maxColumns,
        addColumn,
    };
});
