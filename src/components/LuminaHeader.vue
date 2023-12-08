<template>
    <div class="flex">
        <div class="flex items-center w-6 h-6 border p-0.5 bg-slate-200">&nbsp;</div>
        <div v-for="i in store.maxColumns" :key="i" class="flex items-center justify-center font-semibold w-20 h-6 border p-0.5 bg-slate-100">
            {{ indexToColumn(i - 1) }}
        </div>
        <button class="flex items-center justify-center px-4 bg-slate-300" @click="store.addColumn()">
            <IconPlus :size="16" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";
import { useStore } from "../store/store";
import { indexToColumn } from "../utils/helpers";

const store = useStore();
</script>
