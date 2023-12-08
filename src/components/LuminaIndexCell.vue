<template>
    <div class="flex items-center justify-center font-medium text-sm flex-shrink-0 w-10 h-6 border p-0.5 bg-slate-100" :class="{ 'bg-slate-200': index === store.activeCell.rowIndex }">
        {{ index + 1 }}
    </div>
</template>

<script setup lang="ts">
import { useStore } from "../store/store";

defineProps<{ index: number }>();

const store = useStore();
</script>
