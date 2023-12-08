<template>
    <div class="flex items-center w-20 h-6 border p-0.5" :class="{ 'border-blue-500': isSelected }" @click="store.selectCell(cell.id)">
        <div v-show="!isSelected">{{ cell.value }}</div>
        <div v-show="isSelected">
            <input v-model="value" type="text" class="w-20 h-6 p-0.5">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { ILuminaCell } from "../App.d";
import { useStore } from "../store/store";

const props = defineProps<{ index: number; rowIndex: number; cell: ILuminaCell; }>();

const store = useStore();

const isSelected = computed(() => store.selectedCell === props.cell.id);
const value = ref(props.cell.value);
</script>
