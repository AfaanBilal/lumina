<template>
    <div class="border-b-4 border-r-4 cursor-pointer border-slate-300 bg-slate-200"
        :class="{ 'bg-blue-100 border-blue-600': store.isWholeSheetSelected }"
        @click="store.selectSheet()">
        &nbsp;
    </div>
    <div v-for="i in store.maxColumns" :key="i"
        class="relative text-sm flex flex-shrink-0 items-center justify-center font-medium w-20 h-6 border p-0.5 bg-slate-100 group cursor-pointer"
        :class="{
            'bg-slate-200': i - 1 === store.activeCell.cellIndex,
            'bg-blue-100 border-x-blue-700 border-t-blue-700': store.selectedCells.start.cellIndex === i - 1 && store.selectedCells.end.cellIndex === i - 1
        }" @click="store.selectColumn(i - 1)">
        <button class="absolute items-center justify-center p-0.5 left-1 bg-slate-300 hidden group-hover:flex"
            title="Add a colum to the left" @click="store.addColumn(i - 1)">
            <IconPlus :size="12" />
        </button>

        {{ indexToColumn(i - 1) }}
    </div>
</template>

<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";
import { useStore } from "../store/store";
import { indexToColumn } from "../utils/helpers";

const store = useStore();
</script>
