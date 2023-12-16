<template>
    <div class="flex gap-2 px-1">
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.bold }" title="Bold" @click="toggleBold">
                <IconBold :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border-r cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.italic }" title="Italic" @click="setItalic">
                <IconItalic :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.underline }" title="Underline"
                @click="toggleUnderline">
                <IconUnderline :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.strikethrough }" title="Strikethrough"
                @click="toggleStrikethrough">
                <IconStrikethrough :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'left' }"
                title="Text align left" @click="setTextAlign('left')">
                <IconAlignLeft :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'center' }"
                title="Text align center" @click="setTextAlign('center')">
                <IconAlignCenter :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'right' }"
                title="Text align right" @click="setTextAlign('right')">
                <IconAlignRight :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.verticalAlignment === 'top' }"
                title="Vertical align top" @click="setVerticalAlign('top')">
                <IconLayoutAlignTop :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.verticalAlignment === 'middle' }"
                title="Vertical align middle" @click="setVerticalAlign('middle')">
                <IconLayoutAlignCenter :size="18" />
            </div>
            <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.verticalAlignment === 'bottom' }"
                title="Vertical align bottom" @click="setVerticalAlign('bottom')">
                <IconLayoutAlignBottom :size="18" />
            </div>
        </div>
        <div class="flex items-center justify-center border rounded">
            <select class="w-full outline-none" :value="store.ActiveCell.style?.fontFamily || 'Arial'" @change="setFontFamily">
                <option v-for="f in fontList" :key="f" :value="f">{{ f }}</option>
            </select>
        </div>
        <div class="flex items-center justify-center">
            <div class="flex items-center self-stretch justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-100"
                title="Decrease font size"
                @click="store.updateStyle({ fontSize: (store.ActiveCell.style?.fontSize || 11) - 1 })">
                <IconMinus :size="18" />
            </div>
            <input type="number" min="8" max="200" :value="store.ActiveCell.style?.fontSize || 11"
                class="outline-none text-center p-0.5 w-6 border-y [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                title="Font size" @change="setFontSize">
            <div class="flex items-center self-stretch justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-100"
                title="Increase font size"
                @click="store.updateStyle({ fontSize: (store.ActiveCell.style?.fontSize || 11) + 1 })">
                <IconPlus :size="18" />
            </div>
        </div>
        <div class="flex">
            <div class="flex items-center gap-1 px-1 border rounded-l hover:bg-slate-100" title="Background color">
                <IconBucketDroplet :size="18" />
                <color-picker v-model:pure-color="backgroundColor" shape="circle" :round-history="true"
                    @pure-color-change="setBackgroundColor" />
            </div>
            <div class="flex items-center gap-1 px-1 border border-l-0 rounded-r hover:bg-slate-100" title="Text color">
                <IconTextColor :size="18" />
                <color-picker v-model:pure-color="textColor" shape="circle" :round-history="true"
                    @pure-color-change="setTextColor" />
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
} from "@tabler/icons-vue";
import { useStore } from "../../store/store";

const store = useStore();

const setFontFamily = (e: Event) => store.updateStyle({ fontFamily: (e.target as HTMLInputElement).value });
const setFontSize = (e: Event) => store.updateStyle({ fontSize: parseInt((e.target as HTMLInputElement).value) });
const setTextAlign = (alignment: "left" | "center" | "right") => store.updateStyle({ textAlignment: alignment });
const setVerticalAlign = (alignment: "top" | "middle" | "bottom") => store.updateStyle({ verticalAlignment: alignment });
const toggleBold = () => store.updateStyle({ bold: !store.ActiveCell.style?.bold });
const toggleStrikethrough = () => store.updateStyle({ strikethrough: !store.ActiveCell.style?.strikethrough });
const setItalic = () => store.updateStyle({ italic: !store.ActiveCell.style?.italic });
const toggleUnderline = () => store.updateStyle({ underline: !store.ActiveCell.style?.underline });

const backgroundColor = computed({ get() { return store.ActiveCell.style?.backgroundColor || "rgb(255,255,255)"; }, set() {} });
const textColor = computed({ get() { return store.ActiveCell.style?.textColor || "rgb(0,0,0)"; }, set() {} });
const setBackgroundColor = (color: string) => store.updateStyle({ backgroundColor: color });
const setTextColor = (color: string) => store.updateStyle({ textColor: color });

const fontList = [
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
