<template>
    <div v-show="store.file.settings.showStyleBar" class="flex flex-wrap gap-2 px-1">
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': bold }" title="Bold" @click="bold = !bold">
                <IconBold :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border-r cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': italic }" title="Italic" @click="italic = !italic">
                <IconItalic :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': underline }" title="Underline"
                @click="underline = !underline">
                <IconUnderline :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': strikethrough }" title="Strikethrough"
                @click="strikethrough = !strikethrough">
                <IconStrikethrough :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': ram.ActiveCell.style?.textAlignment === 'left' }"
                title="Text align left" @click="setTextAlign('left')">
                <IconAlignLeft :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': ram.ActiveCell.style?.textAlignment === 'center' }"
                title="Text align center" @click="setTextAlign('center')">
                <IconAlignCenter :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': ram.ActiveCell.style?.textAlignment === 'right' }"
                title="Text align right" @click="setTextAlign('right')">
                <IconAlignRight :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': ram.ActiveCell.style?.verticalAlignment === 'top' }"
                title="Vertical align top" @click="setVerticalAlign('top')">
                <IconLayoutAlignTop :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': ram.ActiveCell.style?.verticalAlignment === 'middle' }"
                title="Vertical align middle" @click="setVerticalAlign('middle')">
                <IconLayoutAlignCenter :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': ram.ActiveCell.style?.verticalAlignment === 'bottom' }"
                title="Vertical align bottom" @click="setVerticalAlign('bottom')">
                <IconLayoutAlignBottom :size="18" />
            </div>
        </div>
        <div class="flex items-center justify-center border rounded">
            <select class="w-full outline-none" :value="ram.ActiveCell.style?.fontFamily || 'Manrope'"
                @change="setFontFamily">
                <option v-for="f in fontList" :key="f" :value="f">{{ f }}</option>
            </select>
        </div>
        <div class="flex items-center justify-center">
            <div class="flex items-center self-stretch justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-100"
                title="Decrease font size"
                @click="store.updateStyle({ fontSize: (ram.ActiveCell.style?.fontSize || 12) - 1 })">
                <IconMinus :size="18" />
            </div>
            <input type="number" min="8" max="200" :value="ram.ActiveCell.style?.fontSize || 12"
                class="outline-none text-center p-0.5 w-6 border-y [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                title="Font size" @change="setFontSize">
            <div class="flex items-center self-stretch justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-100"
                title="Increase font size"
                @click="store.updateStyle({ fontSize: (ram.ActiveCell.style?.fontSize || 12) + 1 })">
                <IconPlus :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center gap-1 px-1 border rounded-l hover:bg-slate-100" title="Background color">
                <IconBucketDroplet :size="18" />
                <color-picker v-model:pure-color="backgroundColor" shape="circle" :round-history="true" />
            </div>
            <div class="flex items-center gap-1 px-1 border-y hover:bg-slate-100" title="Text color">
                <IconTextColor :size="18" />
                <color-picker v-model:pure-color="textColor" shape="circle" :round-history="true" />
            </div>
            <div class="flex items-center gap-1 px-1 border rounded-r hover:bg-slate-100" title="Border color">
                <IconBorderOuter :size="18" />
                <color-picker v-model:pure-color="borderColor" shape="circle" :round-history="true" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': border?.all }" title="Border"
                @click="border = { all: !border?.all };">
                <IconBorderAll :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border-r cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': border?.top }" title="Border top"
                @click="border = { ...border, all: false, top: !border?.top };">
                <IconBorderTop :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border-r cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': border?.right }" title="Border right"
                @click="border = { ...border, all: false, right: !border?.right };">
                <IconBorderRight :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': border?.bottom }" title="Border bottom"
                @click="border = { ...border, all: false, bottom: !border?.bottom };">
                <IconBorderBottom :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': border?.left }" title="Border left"
                @click="border = { ...border, all: false, left: !border?.left };">
                <IconBorderLeft :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': borderType === 'solid' }" title="Border solid"
                @click="borderType = 'solid'">
                <IconSlash class="rotate-12" :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': borderType === 'dashed' }" title="Border dashed"
                @click="borderType = 'dashed'">
                <IconLineDashed class="-rotate-45" :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': borderType === 'dotted' }" title="Border dotted"
                @click="borderType = 'dotted'">
                <IconLineDotted class="-rotate-45" :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded" :class="{
                'bg-slate-800 text-white hover:bg-slate-600': ram.ActiveCell.style?.merged,
                'cursor-pointer hover:bg-slate-200': isMergeAvailable,
            }" title="Merge cells" @click="toggleMerge">
                <IconFocusCentered :size="18" :class="{ 'text-slate-400': !isMergeAvailable }" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded cursor-pointer hover:bg-slate-200" :class="{
                'bg-slate-800 text-white hover:bg-slate-600': ram.formatPainterStyle !== false,
            }" title="Paint format" @click="ram.startPaintFormat()">
                <IconPaint :size="16" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded"
                :class="{ 'cursor-pointer hover:bg-slate-200': hasStyleApplied }" title="Clear format"
                @click="store.clearStyle()">
                <IconPaintOff :size="16" :class="{ 'text-slate-400': !hasStyleApplied }" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white hover:bg-slate-600': locked }" title="Lock / Unlock"
                @click="locked = !locked">
                <IconLock :size="16" />
            </div>
        </div>
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

import { computed } from "vue";
import {
    IconBold, IconItalic, IconUnderline,
    IconAlignLeft, IconAlignCenter, IconAlignRight, IconStrikethrough,
    IconLayoutAlignTop, IconLayoutAlignCenter, IconLayoutAlignBottom,
    IconMinus, IconPlus, IconBucketDroplet, IconTextColor,
    IconBorderLeft, IconBorderBottom, IconBorderRight, IconBorderTop, IconBorderAll,
    IconBorderOuter, IconLineDashed, IconLineDotted, IconSlash, IconFocusCentered, IconPaintOff, IconLock,
} from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { useRAM } from "../../store/ram";
import { IconPaint } from "@tabler/icons-vue";
import { nonStyleProps } from "../../utils/helpers";
import { ILuminaCellStyle } from "../../App.d";

const store = useStore();
const ram = useRAM();

const bold = computed({ get() { return ram.ActiveCell.style?.bold; }, set(v) { store.updateStyle({ bold: v }); } });
const italic = computed({ get() { return ram.ActiveCell.style?.italic; }, set(v) { store.updateStyle({ italic: v }); } });
const underline = computed({ get() { return ram.ActiveCell.style?.underline; }, set(v) { store.updateStyle({ underline: v }); } });
const strikethrough = computed({ get() { return ram.ActiveCell.style?.strikethrough; }, set(v) { store.updateStyle({ strikethrough: v }); } });

const setFontFamily = (e: Event) => store.updateStyle({ fontFamily: (e.target as HTMLInputElement).value });
const setFontSize = (e: Event) => store.updateStyle({ fontSize: parseInt((e.target as HTMLInputElement).value) });
const setTextAlign = (alignment: "left" | "center" | "right") => store.updateStyle({ textAlignment: alignment });
const setVerticalAlign = (alignment: "top" | "middle" | "bottom") => store.updateStyle({ verticalAlignment: alignment });

const backgroundColor = computed({ get() { return ram.ActiveCell.style?.backgroundColor || "rgb(255,255,255)"; }, set(color: string) { store.updateStyle({ backgroundColor: color }); } });
const textColor = computed({ get() { return ram.ActiveCell.style?.textColor || "rgb(0,0,0)"; }, set(color: string) { store.updateStyle({ textColor: color }); } });
const borderColor = computed({ get() { return ram.ActiveCell.style?.borderColor || "rgb(0,0,0)"; }, set(color: string) { store.updateStyle({ borderColor: color }); } });

const border = computed({ get() { return ram.ActiveCell.style?.border; }, set(v) { store.updateStyle({ border: v }); } });
const borderType = computed({ get() { return ram.ActiveCell.style?.borderType; }, set(type: "solid" | "dashed" | "dotted" | undefined) { store.updateStyle({ borderType: type }); } });
const locked = computed({ get() { return ram.ActiveCell.style?.locked; }, set(v) { store.updateStyle({ locked: v }); } });

const isMergeAvailable = computed(() => ram.ActiveCell.style?.merged || !(ram.selectedCells.start.rowIndex === ram.selectedCells.end.rowIndex && ram.selectedCells.start.cellIndex === ram.selectedCells.end.cellIndex));
const hasStyleApplied = computed(() => ram.ActiveCell.style && Object.keys(ram.ActiveCell.style).filter(k => !nonStyleProps.includes(k as keyof ILuminaCellStyle)).length > 0);

const toggleMerge = () => {
    if (ram.ActiveCell.style?.merged) {
        for (let i = ram.activeCellCoordinates.rowIndex; i < store.rowCount; i++) {
            for (let j = ram.activeCellCoordinates.cellIndex; j < store.columnCount; j++) {
                const merged = store.sheet.rows[i].cells[j].style?.merged;

                if (merged && merged.rowIndex === ram.activeCellCoordinates.rowIndex && merged.cellIndex === ram.activeCellCoordinates.cellIndex) {
                    store.updateCellStyle({ rowIndex: i, cellIndex: j }, { merged: false });
                }
            }
        }

        return;
    }

    store.updateStyle({ merged: Object.assign({}, ram.activeCellCoordinates) });
};

const fontList = [
    "Manrope",
    "Arial",
    "Calibri",
    "Helvetica",
    "Segoe UI",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Brush Script MT",
];
</script>
