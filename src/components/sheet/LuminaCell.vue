<template>
    <div v-if="showCell" class="flex items-center animate-[fadeIn_.3s_ease-in-out] select-none text-xs bg-white" :class="{
        'border': store.file.settings.showGridlines,
        '!bg-slate-100': store.file.settings.showStripes && rowIndex % 2 == 1,
        'border-y-slate-400': store.file.settings.showRowBand && ram.activeCellCoordinates.rowIndex === rowIndex && ram.activeCellCoordinates.cellIndex > cellIndex,
        'border-x-slate-400': store.file.settings.showColumnBand && ram.activeCellCoordinates.cellIndex === cellIndex && ram.activeCellCoordinates.rowIndex > rowIndex,

        '!border-2 !border-blue-500': isActive,
        'border-dashed border-blue-400': isHovered && !isActive,

        '!bg-blue-200': isSelected,
        'border-t-blue-700': isSelected && onSelectionTopEdge && !onSheetTopEdge,
        'border-r-blue-700': isSelected && onSelectionRightEdge,
        'border-b-blue-700': isSelected && onSelectionBottomEdge,
        'border-l-blue-700': isSelected && onSelectionLeftEdge && !onSheetLeftEdge,

        '!bg-slate-300': props.cell.style?.locked,
        '!bg-slate-300 sticky z-40': store.sheet.style.rows?.[rowIndex]?.frozen || store.sheet.style.cols?.[cellIndex]?.frozen,

        '!bg-slate-300 opacity-0': isCellHidden && !store.file.settings.showHidden,
        '!bg-slate-300 opacity-70': isCellHidden && store.file.settings.showHidden,
    }" :style="commonStyle + styleFrozen + styleMerged"
        @click="ram.setActiveCell({ rowIndex: props.rowIndex, cellIndex: props.cellIndex })" @mouseenter="mouseEnter">
        <div v-show="!isCellEditable" class="flex items-center justify-start w-full h-full p-0.5 truncate" :class="{
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
            {{ store.file.settings.showFormulae ? value : calculatedValue }}
        </div>
        <input v-if="isCellEditable" ref="input" v-model="value" type="text" class="w-full h-full outline-none" :class="{
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
import { useRAM } from "../../store/ram";

const props = defineProps<{ rowIndex: number; cellIndex: number; cell: ILuminaCell; }>();

const store = useStore();
const ram = useRAM();

const input = ref<HTMLInputElement | null>(null);
const focusInput = () => nextTick(() => input.value?.focus());

const showCell = computed(() => {
    const selfMerged = props.cell.style?.merged;
    const upMerged = props.rowIndex > 0 && store.sheet.rows[props.rowIndex - 1].cells[props.cellIndex].style?.merged;
    const leftMerged = props.cellIndex > 0 && store.sheet.rows[props.rowIndex].cells[props.cellIndex - 1].style?.merged;

    if (
        selfMerged &&
        (
            (upMerged && selfMerged.rowIndex === upMerged.rowIndex && selfMerged.cellIndex === upMerged.cellIndex) ||
            (leftMerged && selfMerged.rowIndex === leftMerged.rowIndex && selfMerged.cellIndex === leftMerged.cellIndex)
        )
    ) return false;

    return true;
});

const styleFrozen = computed(() => (store.sheet.style.rows?.[props.rowIndex]?.frozen ? `top: ${store.getFrozenTop(props.rowIndex)}px;` : "") + (store.sheet.style.cols?.[props.cellIndex]?.frozen ? `left: ${store.getFrozenLeft(props.cellIndex)}px;` : ""));
const styleMerged = computed(() => {
    if (!props.cell.style?.merged) return "";
    if (props.cell.style?.merged.rowIndex !== props.rowIndex && props.cell.style?.merged.cellIndex !== props.cellIndex) return "";

    let mergeRowCount = 0;
    for (let i = props.rowIndex; i < store.rowCount; i++) {
        const merged = store.sheet.rows[i].cells[props.cellIndex].style?.merged;

        if (!merged || merged.rowIndex !== props.rowIndex || merged.cellIndex !== props.cellIndex) break;

        mergeRowCount++;
    }

    let mergeColumnCount = 0;
    for (let i = props.cellIndex; i < store.columnCount; i++) {
        const merged = store.sheet.rows[props.rowIndex].cells[i].style?.merged;

        if (!merged || merged.rowIndex !== props.rowIndex || merged.cellIndex !== props.cellIndex) break;

        mergeColumnCount++;
    }

    return `grid-row: span ${mergeRowCount}; grid-column: span ${mergeColumnCount};`;
});

const isActive = computed(() => ram.activeCellCoordinates.rowIndex === props.rowIndex && ram.activeCellCoordinates.cellIndex === props.cellIndex);
const isHovered = computed(() => ram.hoverCellCoordinates.rowIndex === props.rowIndex && ram.hoverCellCoordinates.cellIndex === props.cellIndex);

const isSelected = computed(() => {
    const start = ram.selectedCells.start;
    const end = ram.selectedCells.end;

    if (props.rowIndex < start.rowIndex) return false;
    if (props.cellIndex < start.cellIndex) return false;

    if (props.rowIndex > end.rowIndex) return false;
    if (props.cellIndex > end.cellIndex) return false;

    return true;
});

watch(isActive, v => {
    if (!v) return;

    store.file.settings.autofocus && focusInput();
    ram.selectActiveCell();
});

const onSelectionTopEdge = computed(() => props.rowIndex === ram.selectedCells.start.rowIndex);
const onSelectionRightEdge = computed(() => props.cellIndex === ram.selectedCells.end.cellIndex);
const onSelectionBottomEdge = computed(() => props.rowIndex === ram.selectedCells.end.rowIndex);
const onSelectionLeftEdge = computed(() => props.cellIndex === ram.selectedCells.start.cellIndex);
const onSheetTopEdge = computed(() => props.rowIndex === 0);
const onSheetLeftEdge = computed(() => props.cellIndex === 0);

const isCellEditable = computed(() => isActive.value && !props.cell.style?.locked && !store.sheet.locked);
const isCellHidden = computed(() => store.sheet.style.rows?.[props.rowIndex]?.hidden || store.sheet.style.cols?.[props.cellIndex]?.hidden);

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
    ram.setHoverCellCoordinates({ rowIndex: props.rowIndex, cellIndex: props.cellIndex });
    e.buttons === 1 && ram.endSelection();
};
</script>
