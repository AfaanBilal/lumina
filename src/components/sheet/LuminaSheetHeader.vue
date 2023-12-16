<template>
    <div class="sticky top-0 left-0 z-20 border-b-4 border-r-4 cursor-pointer border-slate-300 bg-slate-200"
        :class="{ 'bg-blue-100 border-blue-600': store.isWholeSheetSelected }" @click="store.selectSheet()">
        &nbsp;
    </div>
    <div v-for="i in store.columnCount" :key="i"
        class="text-sm flex flex-shrink-0 items-center justify-center font-medium h-6 border p-0.5 bg-slate-100 group cursor-pointer select-none sticky top-0"
        :class="{
            'bg-slate-200': i - 1 === store.activeCell.cellIndex,
            'bg-blue-100 border-x-blue-700 border-t-blue-700': store.selectedCells.start.cellIndex === i - 1 && store.selectedCells.end.cellIndex === i - 1
        }" @click="store.selectColumn(i - 1)">
        <button
            class="absolute items-center justify-center p-0.5 left-1 bg-slate-300 hidden rounded group-hover:flex hover:bg-slate-400"
            title="Add a colum to the left" @click="store.addColumn(i - 1)">
            <IconPlus :size="10" />
        </button>

        {{ indexToColumn(i - 1) }}

        <Dropdown class="absolute right-1 !flex items-center justify-center">
            <template #trigger>
                <button class="p-0.5 items-center justify-center hidden rounded group-hover:flex hover:bg-slate-300">
                    <IconDotsVertical :size="10" />
                </button>
            </template>

            <div class="flex flex-col text-sm w-52">
                <div class="p-2 font-semibold border-b text-md">Column {{ indexToColumn(i - 1) }}</div>
                <div class="flex items-center gap-2 p-2">
                    <IconArrowAutofitWidth :size="18" />
                    <div class="flex-1 font-semibold">Width</div>
                    <div class="flex items-baseline gap-1">
                        <input type="number" min="40" max="2500" class="p-1 outline-none"
                            :value="store.sheet.style.cols?.[i - 1]?.width || '80'"
                            @change="e => store.updateColStyle(i - 1, { width: parseInt((e.target as HTMLInputElement).value) })">px
                    </div>
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addColumn(i - 1)">
                    <IconColumnInsertLeft :size="18" /> Insert column left
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addColumn(i)">
                    <IconColumnInsertRight :size="18" /> Insert column right
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.deleteColumn(i - 1)">
                    <IconColumnRemove :size="18" /> Delete column
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
import { IconPlus, IconDotsVertical, IconArrowAutofitWidth, IconColumnRemove, IconColumnInsertLeft, IconColumnInsertRight } from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { indexToColumn } from "../../utils/helpers";

const store = useStore();
</script>
