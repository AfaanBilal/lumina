<template>
    <div class="flex items-center animate-[fadeIn_.3s_ease-in-out] select-none" :class="{
        'border': store.file.settings.showGridlines,
        'bg-slate-100': store.file.settings.showStripes && rowIndex % 2 == 1,
        'border-y-slate-400': store.file.settings.showRowBand && store.activeCellCoordinates.rowIndex === rowIndex && store.activeCellCoordinates.cellIndex > cellIndex,
        'border-x-slate-400': store.file.settings.showColumnBand && store.activeCellCoordinates.cellIndex === cellIndex && store.activeCellCoordinates.rowIndex > rowIndex,

        '!border-2 !border-blue-500': isActive,
        'border-dashed border-blue-400': isHovered && !isActive,

        'bg-blue-200': isSelected,
        'border-t-blue-700': isSelected && onSelectionTopEdge && !onSheetTopEdge,
        'border-r-blue-700': isSelected && onSelectionRightEdge,
        'border-b-blue-700': isSelected && onSelectionBottomEdge,
        'border-l-blue-700': isSelected && onSelectionLeftEdge && !onSheetLeftEdge,

        'sticky bg-slate-300 z-50': store.sheet.style.rows?.[rowIndex]?.frozen,
    }"
        :style="commonStyle + (store.sheet.style.rows?.[rowIndex]?.frozen ? `top: ${store.getFrozenTop(rowIndex)}px;` : '')"
        @click="store.setActiveCell({ rowIndex: props.rowIndex, cellIndex: props.cellIndex })" @mouseenter="mouseEnter">
        <div v-show="!isActive" class="flex items-center justify-start w-full h-full p-0.5 truncate" :class="{
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
        }" :style.="commonStyle">
            {{ calculatedValue }}
        </div>
        <input v-if="isActive" ref="input" v-model="value" type="text" class="w-full h-full outline-none" :class="{
            'font-bold': props.cell.style?.bold,
            'italic': props.cell.style?.italic,
            'underline': props.cell.style?.underline,
            'line-through': props.cell.style?.strikethrough,
        }" :style="commonStyle">
    </div>
</template>

<script setup lang="ts">
/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import { computed, nextTick, ref, watch } from "vue";
import { useStore } from "../../store/store";
import type { ILuminaCell, TLuminaCellValue } from "../../App.d";
import { isFormula } from "../../utils/helpers";
import { calculateValue } from "../../utils/computer";

const props = defineProps<{ rowIndex: number; cellIndex: number; cell: ILuminaCell; }>();

const store = useStore();

const input = ref<HTMLInputElement | null>(null);
const focusInput = () => nextTick(() => input.value?.focus());

const isActive = computed(() => store.activeCellCoordinates.rowIndex === props.rowIndex && store.activeCellCoordinates.cellIndex === props.cellIndex);
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

watch(isActive, v => {
    if (!v) return;

    store.file.settings.autofocus && focusInput();
    store.selectActiveCell();
});

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
    style.textAlignment && (s += `text-align: ${style.textAlignment};`);
    style.fontFamily && (s += `font-family: "${style.fontFamily}";`);
    style.fontSize && (s += `font-size: ${style.fontSize}px;`);

    (style.border?.all || style.border?.top) && (s += `border-top: 1px ${style.borderType || "solid"} ${style.borderColor || "black"};`);
    (style.border?.all || style.border?.right) && (s += `border-right: 1px ${style.borderType || "solid"} ${style.borderColor || "black"};`);
    (style.border?.all || style.border?.bottom) && (s += `border-bottom: 1px ${style.borderType || "solid"} ${style.borderColor || "black"};`);
    (style.border?.all || style.border?.left) && (s += `border-left: 1px ${style.borderType || "solid"} ${style.borderColor || "black"};`);

    return s;
});

const value = computed<TLuminaCellValue>({
    get() { return props.cell.value; },
    set(v: TLuminaCellValue) { store.setCellValue({ rowIndex: props.rowIndex, cellIndex: props.cellIndex }, v); },
});

const calculatedValue = computed(() => isFormula(props.cell.value) ? calculateValue(props.cell.value) : props.cell.value);

const mouseEnter = (e: MouseEvent) => {
    store.setHoverCellCoordinates({ rowIndex: props.rowIndex, cellIndex: props.cellIndex });
    e.buttons === 1 && store.endSelection();
};
</script>
