<template>
    <div class="flex items-center border p-0.5 animate-[fadeIn_.3s_ease-in-out] select-none" :class="{
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
    }" :style="commonStyle" @click="store.selectCell({ rowIndex: props.rowIndex, cellIndex: props.cellIndex })"
        @mouseenter="mouseEnter">
        <div v-show="!isActive" class="flex items-center justify-center w-full h-full overflow-hidden" :class="{
            'font-bold': props.cell.style?.bold,
            'italic': props.cell.style?.italic,
            'underline': props.cell.style?.underline,
            'line-through': props.cell.style?.strikethrough,
            '!justify-start': props.cell.style?.textAlignment === 'left',
            '!justify-center': props.cell.style?.textAlignment === 'center',
            '!justify-end': props.cell.style?.textAlignment === 'right',
            '!items-start': props.cell.style?.verticalAlignment === 'top',
            '!items-center': props.cell.style?.verticalAlignment === 'middle',
            '!items-end': props.cell.style?.verticalAlignment === 'bottom',
        }">
            {{ computedValue }}
        </div>
        <div v-if="isActive">
            <input ref="input" v-model="value" type="text" class="w-full h-full outline-none" :class="{
                'font-bold': props.cell.style?.bold,
                'italic': props.cell.style?.italic,
                'underline': props.cell.style?.underline,
                'line-through': props.cell.style?.strikethrough,
            }" :style="commonStyle">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useStore } from "../../store/store";
import type { ILuminaCell, TLuminaCellValue } from "../../App.d";
import { isFormula } from "../../utils/helpers";
import { calculateValue } from "../../utils/computer";

const props = defineProps<{ rowIndex: number; cellIndex: number; cell: ILuminaCell; }>();

const store = useStore();

const input = ref<HTMLInputElement | null>(null);
const focusInput = () => nextTick(() => input.value?.focus());

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

watch(isActive, v => store.settings.autofocus && v && focusInput());

const onSelectionTopEdge = computed(() => props.rowIndex === store.selectedCells.start.rowIndex);
const onSelectionRightEdge = computed(() => props.cellIndex === store.selectedCells.end.cellIndex);
const onSelectionBottomEdge = computed(() => props.rowIndex === store.selectedCells.end.rowIndex);
const onSelectionLeftEdge = computed(() => props.cellIndex === store.selectedCells.start.cellIndex);
const onSheetTopEdge = computed(() => props.rowIndex === 0);
const onSheetLeftEdge = computed(() => props.cellIndex === 0);

const commonStyle = computed(() => {
    if (!props.cell.style) return "";

    const style = props.cell.style;

    let s = "";

    style.backgroundColor && (s += `background-color: ${style.backgroundColor};`);
    style.textColor && (s += `color: ${style.textColor};`);
    style.textAlignment && (s += `text-align: ${style.textAlignment}`);
    style.fontSize && (s += `font-size: ${style.fontSize}px`);

    return s;
});

const value = computed<TLuminaCellValue>({
    get() {
        return props.cell.value;
    },
    set(v: TLuminaCellValue) {
        store.setCellValue({ rowIndex: props.rowIndex, cellIndex: props.cellIndex }, v);
    },
});

const mouseEnter = (e: MouseEvent) => {
    const c = { rowIndex: props.rowIndex, cellIndex: props.cellIndex };

    store.setHoverCellCoordinates(c);

    if (e.buttons === 1) {
        store.endSelection();
    }
};

const computedValue = computed(() => {
    const v = props.cell.value;

    if (isFormula(v)) {
        return calculateValue(v);
    }

    return v;
});
</script>
