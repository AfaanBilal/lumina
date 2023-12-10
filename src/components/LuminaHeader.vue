<template>
    <div class="border-b-4 border-r-4 border-slate-300 bg-slate-200">&nbsp;</div>
    <div v-for="i in store.maxColumns" :key="i" class="relative text-sm flex flex-shrink-0 items-center justify-center font-medium w-20 h-6 border p-0.5 bg-slate-100 group" :class="{ 'bg-slate-200': i - 1 === store.activeCell.cellIndex }">
        <button class="absolute items-center justify-center p-0.5 left-1 bg-slate-300 hidden group-hover:flex" title="Add a colum to the left" @click="store.addColumn(i-1)">
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
