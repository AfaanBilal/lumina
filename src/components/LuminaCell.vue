<template>
    <div class="flex flex-shrink-0 text-sm items-center w-20 h-6 border p-0.5" :class="{ 'bg-slate-100': store.settings.stripes && rowIndex % 2 == 1, 'border-2 border-blue-500': isSelected, 'border-x-slate-400': store.activeCell.cellIndex === index && store.activeCell.rowIndex > rowIndex, 'border-y-slate-400': store.activeCell.rowIndex === rowIndex && store.activeCell.cellIndex > index }" @click="cellClick">
        <div v-show="!isSelected" class="w-full overflow-clip">{{ cell.value }}</div>
        <div v-if="isSelected">
            <input ref="input" v-model="value" type="text" class="w-full h-5 outline-none" @keyup.enter="store.selectCellDown()">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useStore } from "../store/store";
import type { ILuminaCell, TLuminaCellValue } from "../App.d";

const props = defineProps<{ index: number; rowIndex: number; cell: ILuminaCell; }>();

const store = useStore();

const isSelected = computed(() => store.activeCell.rowIndex === props.rowIndex && store.activeCell.cellIndex === props.index);

const value = computed<TLuminaCellValue>({
    get() {
        return props.cell.value;
    },
    set(v: TLuminaCellValue) {
        store.updateCell(props.rowIndex, props.index, { ...props.cell, value: v });
    },
});

const input = ref<HTMLInputElement | null>(null);
const cellClick = () => {
    store.selectCell(props.rowIndex, props.index);
    nextTick(() => input.value?.focus());
};
</script>
