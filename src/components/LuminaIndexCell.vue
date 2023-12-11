<template>
    <div class="relative flex items-center justify-center font-medium text-sm border p-0.5 bg-slate-100 group select-none cursor-pointer"
        :class="{ 'bg-slate-200': index === store.activeCell.rowIndex, 'bg-blue-100 border-l-blue-700 border-y-blue-700': isRowSelected }"
        @click="store.selectRow(index)">
        <button class="absolute top-0 left-0 items-center justify-center hidden bg-slate-300 group-hover:flex"
            title="Add a row above" @click="store.addRow(index - 1)">
            <IconPlus :size="10" />
        </button>

        {{ index + 1 }}
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IconPlus } from "@tabler/icons-vue";
import { useStore } from "../store/store";

const props = defineProps<{ index: number }>();

const store = useStore();

const isRowSelected = computed(() => store.selectedCells.start.rowIndex === props.index && store.selectedCells.end.rowIndex === props.index);
</script>
