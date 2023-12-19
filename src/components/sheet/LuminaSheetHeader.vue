<template>
    <div class="sticky top-0 left-0 z-20 border-b-4 border-r-4 cursor-pointer border-slate-300 bg-slate-200"
        :class="{ 'bg-blue-100 border-blue-600': ram.isSheetSelected }" @click="ram.selectSheet()">
        &nbsp;
    </div>
    <div v-for="(_, i) in store.columnCount" :key="i"
        class="text-sm flex flex-shrink-0 items-center justify-center font-medium h-6 border p-0.5 bg-slate-100 group cursor-pointer select-none sticky top-0"
        :class="{
            'bg-slate-200': i === ram.activeCellCoordinates.cellIndex,
            'bg-blue-300': ram.selectedCells.start.cellIndex <= i && ram.selectedCells.end.cellIndex >= i,
            'bg-slate-300 z-50': store.sheet.style.cols?.[i]?.frozen,
            'bg-slate-300 opacity-70': store.sheet.style.cols?.[i]?.hidden,
        }" :style="(store.sheet.style.cols?.[i]?.frozen ? `left: ${store.getFrozenLeft(i)}px;` : '')"
        @click="ram.selectColumn(i)">
        <button
            class="absolute items-center justify-center p-0.5 left-1 hidden rounded-full group-hover:flex hover:bg-slate-300"
            title="Insert column left" @click="store.addColumn(i)">
            <IconPlus :size="10" />
        </button>

        {{ indexToColumn(i) }}

        <Dropdown class="absolute right-1 !flex items-center justify-center">
            <template #trigger>
                <button
                    class="p-0.5 items-center justify-center hidden rounded-full group-hover:flex hover:bg-slate-300 my-auto">
                    <IconDotsVertical :size="10" />
                </button>
            </template>

            <div class="flex flex-col text-sm w-52">
                <div class="p-2 font-semibold border-b text-md">Column {{ indexToColumn(i) }}</div>
                <div class="flex items-center gap-2 p-2">
                    <IconArrowAutofitWidth :size="16" />
                    <div class="flex-1 font-semibold">Width</div>
                    <div class="flex items-baseline gap-1">
                        <input type="number" min="40" max="2500" class="p-1 border rounded outline-none"
                            :value="store.sheet.style.cols?.[i]?.width || '80'"
                            @change="e => store.updateColStyle(i, { width: parseInt((e.target as HTMLInputElement).value) })">px
                    </div>
                </div>
                <div class="flex items-center gap-2 p-2 border-t">
                    <input :id="'frozen-col-' + i" :checked="store.sheet.style.rows?.[i]?.frozen" type="checkbox"
                        class="w-4 accent-slate-600"
                        @change="e => store.updateColStyle(i, { frozen: (e.target as HTMLInputElement).checked })">
                    <label :for="'frozen-col-' + i" class="font-semibold cursor-pointer select-none">Freeze</label>
                </div>
                <div class="flex items-center gap-2 p-2 border-t">
                    <input :id="'hidden-col-' + i" :checked="store.sheet.style.rows?.[i]?.hidden" type="checkbox"
                        class="w-4 accent-slate-600"
                        @change="e => store.updateColStyle(i, { hidden: (e.target as HTMLInputElement).checked })">
                    <label :for="'hidden-col-' + i" class="font-semibold cursor-pointer select-none">Hide</label>
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold border-t text-slate-400"
                    :class="{ 'text-slate-900 cursor-pointer hover:bg-slate-100': i > 1 }"
                    @click="store.moveColumnLeft(i)">
                    <IconArrowMoveLeft :size="16" /> Move left
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold border-b text-slate-400"
                    :class="{ 'text-slate-900 cursor-pointer hover:bg-slate-100': i < store.columnCount - 1 }"
                    @click="store.moveColumnRight(i)">
                    <IconArrowMoveRight :size="16" /> Move right
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addColumn(i)">
                    <IconColumnInsertLeft :size="16" /> Insert column left
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addColumn(i + 1)">
                    <IconColumnInsertRight :size="16" /> Insert column right
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold border-t cursor-pointer hover:bg-slate-100"
                    @click="store.deleteColumn(i)">
                    <IconColumnRemove :size="16" /> Delete column
                </div>
            </div>
        </Dropdown>
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

import Dropdown from "v-dropdown";
import {
    IconPlus, IconDotsVertical, IconArrowAutofitWidth, IconColumnRemove,
    IconColumnInsertLeft, IconColumnInsertRight, IconArrowMoveLeft, IconArrowMoveRight,
} from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { indexToColumn } from "../../utils/helpers";
import { useRAM } from "../../store/ram";

const store = useStore();
const ram = useRAM();
</script>
