import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ulid } from "ulid";
import { ILuminaCell, ILuminaSheet, LuminaCellType } from "../App.d";

const emptyCell = (): ILuminaCell => ({ id: "cell_" + ulid(), value: "" });
const generateEmptyCells = (cellCount: number): Array<ILuminaCell> => [...Array(cellCount).keys()].map(() => emptyCell());

export const useStore = defineStore("counter", () => {
    const selectedCell = ref("");
    const sheet = ref<ILuminaSheet>({
        id: "sheet_" + ulid(),
        rows: [
            {
                id: "r1",
                cells: [
                    { id: "c1", value: "A1", type: LuminaCellType.Text },
                    { id: "c2", value: "B1", type: LuminaCellType.Text },
                    { id: "c3", value: "C1", type: LuminaCellType.Text },
                ],
            },
            {
                id: "r2",
                cells: [
                    { id: "c4", value: "A2", type: LuminaCellType.Text },
                    { id: "c5", value: "B2", type: LuminaCellType.Text },
                    { id: "c6", value: "C2", type: LuminaCellType.Text },
                ],
            },
        ],
    });

    const maxColumns = computed(() => Math.max(...sheet.value.rows.map(r => r.cells.length)));
    const maxRows = computed(() => sheet.value.rows.length);

    function selectCell(id: string) {
        selectedCell.value = id;
    }

    function addRow(index?: number) {
        const emptyRow = { id: "row_" + ulid(), cells: generateEmptyCells(maxColumns.value) };

        if (index) {
            sheet.value.rows.splice(index, 0, emptyRow);
        } else {
            sheet.value.rows.push(emptyRow);
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

        sheet,
        maxRows,
        addRow,
        maxColumns,
        addColumn,
    };
});
