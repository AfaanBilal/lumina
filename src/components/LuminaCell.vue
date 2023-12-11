<template>
    <div class="flex text-sm items-center border p-0.5 animate-[fadeIn_.3s_ease-in-out] select-none" :class="{
        'bg-slate-100': store.settings.stripes && rowIndex % 2 == 1,
        'border-2 border-blue-500': isActive,
        'border-y-slate-400': store.settings.rowBand && store.activeCell.rowIndex === rowIndex && store.activeCell.cellIndex > cellIndex,
        'border-x-slate-400': store.settings.colBand && store.activeCell.cellIndex === cellIndex && store.activeCell.rowIndex > rowIndex,
        'border-dashed border-blue-400': isHovered && !isActive,
        'bg-blue-200': isSelected && !isActive,
        'border-t-blue-700': isSelected && onSelectionTopEdge && !onSheetTopEdge,
        'border-r-blue-700': isSelected && onSelectionRightEdge,
        'border-b-blue-700': isSelected && onSelectionBottomEdge,
        'border-l-blue-700': isSelected && onSelectionLeftEdge && !onSheetLeftEdge,
    }"
        :style="`background-color: ${cell.style?.backgroundColor}; color: ${cell.style?.textColor}; text-align: ${cell.style?.textAlignment}; font-size: ${cell.style?.fontSize || 11}px;`"
        @click="cellClick" @mouseenter="mouseEnter">
        <div v-show="!isActive" class="w-full overflow-hidden" :class="{
            'font-bold': props.cell.style?.bold,
            'italic': props.cell.style?.italic,
            'underline': props.cell.style?.underline,
        }">
            {{ computedValue }}
        </div>
        <div v-if="isActive">
            <input ref="input" v-model="value" type="text" class="w-full h-5 outline-none" :class="{
                'font-bold': props.cell.style?.bold,
                'italic': props.cell.style?.italic,
                'underline': props.cell.style?.underline,
            }" @keyup.enter="store.selectCellDown()">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { Parser } from "expr-eval";
import { useStore } from "../store/store";
import type { HashMap, ILuminaCell, TLuminaCellValue } from "../App.d";
import { isFormula, columnToIndex, isNumeric, toNumber } from "../utils/helpers";

const props = defineProps<{ rowIndex: number; cellIndex: number; cell: ILuminaCell; }>();

const store = useStore();

const isActive = computed(() => store.activeCell.rowIndex === props.rowIndex && store.activeCell.cellIndex === props.cellIndex);
const isHovered = computed(() => store.hoverCellCoordinates.rowIndex === props.rowIndex && store.hoverCellCoordinates.cellIndex === props.cellIndex);

const isSelected = computed(() => {
    const start = store.selectedCells.start;
    const end = store.selectedCells.end;

    if (props.rowIndex < start.rowIndex) return false;
    if (props.cellIndex < start.cellIndex) return false;

    if (props.rowIndex > end.rowIndex) return false;
    if (props.cellIndex > end.cellIndex) return false;

    return true;
});

const onSelectionTopEdge = computed(() => props.rowIndex === store.selectedCells.start.rowIndex);
const onSelectionRightEdge = computed(() => props.cellIndex === store.selectedCells.end.cellIndex);
const onSelectionBottomEdge = computed(() => props.rowIndex === store.selectedCells.end.rowIndex);
const onSelectionLeftEdge = computed(() => props.cellIndex === store.selectedCells.start.cellIndex);
const onSheetTopEdge = computed(() => props.rowIndex === 0);
const onSheetLeftEdge = computed(() => props.cellIndex === 0);

const value = computed<TLuminaCellValue>({
    get() {
        return props.cell.value;
    },
    set(v: TLuminaCellValue) {
        store.setCellValue({ rowIndex: props.rowIndex, cellIndex: props.cellIndex }, v);
    },
});

const input = ref<HTMLInputElement | null>(null);
const cellClick = () => {
    store.selectCell({ rowIndex: props.rowIndex, cellIndex: props.cellIndex });

    if (store.settings.autofocus) {
        nextTick(() => input.value?.focus());
    }
};

const mouseEnter = (e: MouseEvent) => {
    const c = { rowIndex: props.rowIndex, cellIndex: props.cellIndex };

    store.setHoverCellCoordinates(c);

    if (e.buttons === 1) {
        store.endSelection();
    }
};

const cellValue = (c: string): string => {
    const col = c.toUpperCase().match(/[A-Z]+/g);
    const row = c.toUpperCase().match(/[\d]+/g);

    if (!col || !row) return "";

    const cellIndex = columnToIndex(col[0]);
    const rowIndex = parseInt(row[0]) - 1;

    return store.sheet.rows[rowIndex].cells[cellIndex].value;
};

const ERROR = "#ERROR";

const computedValue = computed(() => {
    const v = props.cell.value;

    if (isFormula(v)) {
        const cells = v.toUpperCase().match(/[A-Z]+[\d]+/g);

        let values: HashMap<number> = {};
        if (cells) {
            for (let i = 0; i < cells.length; i++) {
                const v = cellValue(cells[i]);

                if (!isNumeric(v)) return ERROR;

                values[cells[i].toLowerCase()] = toNumber(v);
            }
        }

        try {
            return Parser.parse(v.substring(1).toLowerCase()).evaluate(values);
        } catch (e) {
            return ERROR;
        }
    }

    return v;
});
</script>
