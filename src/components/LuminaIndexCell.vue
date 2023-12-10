<template>
    <div class="relative flex items-center justify-center font-medium text-sm border p-0.5 bg-slate-100 group select-none"
        :class="{ 'bg-slate-200': index === store.activeCell.rowIndex }">
        <button class="absolute items-center justify-center p-0.5 top-1 bg-slate-300 hidden group-hover:flex"
            title="Add a row above" @click="store.addRow(index - 1)">
            <IconPlus :size="12" />
        </button>

        {{ index + 1 }}
    </div>
</template>

<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";
import { useStore } from "../store/store";

defineProps<{ index: number }>();

const store = useStore();
</script>
