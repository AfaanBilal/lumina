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
    }" :style="`
        background-color: ${cell.style?.backgroundColor};
        color: ${cell.style?.textColor};
        text-align: ${cell.style?.textAlignment};
        font-size: ${cell.style?.fontSize || 11}px;
    `" @click="cellClick" @mouseenter="mouseEnter">
        <div v-show="!isActive" class="w-full overflow-hidden" :class="{
            'font-bold': props.cell.style?.bold,
            'italic': props.cell.style?.italic,
            'underline': props.cell.style?.underline,
            'line-through': props.cell.style?.strikethrough,
        }">
            {{ computedValue }}
        </div>
        <div v-if="isActive">
            <input ref="input" v-model="value" type="text" class="w-full h-5 outline-none" :class="{
                'font-bold': props.cell.style?.bold,
                'italic': props.cell.style?.italic,
                'underline': props.cell.style?.underline,
                'line-through': props.cell.style?.strikethrough,
            }" @keyup.enter="store.selectCellDown()">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useStore } from "../store/store";
import type { HashMap, ILuminaCell, TLuminaCellValue } from "../App.d";
import { isFormula, cellCoordinates, isNumeric, toNumber, REGEX_RANGE, REGEX_CELL } from "../utils/helpers";
import { parser } from "../utils/parser";
import { Values } from "expr-eval";

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
    const coords = cellCoordinates(c);
    if (!coords) return "";

    return store.sheet.rows[coords.rowIndex].cells[coords.cellIndex].value;
};

const rangeValues = (r: string): string[] => {
    const startCell = r.split(":")[0];
    const endCell = r.split(":")[1];

    const start = cellCoordinates(startCell);
    const end = cellCoordinates(endCell);

    if (!start || !end) return [];

    const values: string[] = [];

    for (let row = start.rowIndex; row <= end.rowIndex; row++) {
        for (let col = start.cellIndex; col <= end.cellIndex; col++) {
            values.push(store.sheet.rows[row].cells[col].value);
        }
    }

    return values;
};

const ERROR = "#ERROR";

const computedValue = computed(() => {
    const v = props.cell.value;

    if (isFormula(v)) {
        let values: HashMap<number | number[]> = {};

        const ranges = v.toUpperCase().match(REGEX_RANGE);
        if (ranges) {
            for (let i = 0; i < ranges.length; i++) {
                values[ranges[i].toLowerCase().replace(":", "_")] = rangeValues(ranges[i]).map(toNumber);
            }
        }

        const cells = v.toUpperCase().match(REGEX_CELL);
        if (cells) {
            for (let i = 0; i < cells.length; i++) {
                const v = cellValue(cells[i]);

                if (!isNumeric(v)) return ERROR;

                values[cells[i].toLowerCase()] = toNumber(v);
            }
        }

        try {
            return parser.parse(v.substring(1).toLowerCase().replace(":", "_")).evaluate(values as Values);
        } catch (e) {
            console.log(e);
            return ERROR;
        }
    }

    return v;
});
</script>
