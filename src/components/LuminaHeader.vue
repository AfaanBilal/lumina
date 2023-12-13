<template>
    <div class="border-b-4 border-r-4 cursor-pointer border-slate-300 bg-slate-200"
        :class="{ 'bg-blue-100 border-blue-600': store.isWholeSheetSelected }" @click="store.selectSheet()">
        &nbsp;
    </div>
    <div v-for="i in store.maxColumns" :key="i"
        class="relative text-sm flex flex-shrink-0 items-center justify-center font-medium h-6 border p-0.5 bg-slate-100 group cursor-pointer select-none"
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

            <div class="flex flex-col w-40 gap-2 p-2 text-sm">
                <div class="font-bold text-md">Column {{ indexToColumn(i - 1) }}</div>
                <div class="flex items-center justify-between gap-2">
                    <div class="font-semibold">Width</div>
                    <div class="flex items-baseline gap-1">
                        <input type="number" min="10" max="100" class="p-1 outline-none"
                            :value="store.sheet.style.cols?.[i - 1]?.width || '80'"
                            @change="e => store.updateColStyle(i - 1, { width: parseInt((e.target as HTMLInputElement).value) })">px
                    </div>
                </div>
            </div>
        </Dropdown>
    </div>
</template>

<script setup lang="ts">
import { IconPlus, IconDotsVertical } from "@tabler/icons-vue";
import Dropdown from "v-dropdown";
import { useStore } from "../store/store";
import { indexToColumn } from "../utils/helpers";

const store = useStore();
</script>
