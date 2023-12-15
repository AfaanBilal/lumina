<template>
    <div class="relative flex items-center justify-center font-medium text-sm border p-0.5 bg-slate-100 group select-none cursor-pointer"
        :class="{ 'bg-slate-200': index === store.activeCell.rowIndex, 'bg-blue-100 border-l-blue-700 border-y-blue-700': isRowSelected }"
        @click="store.selectRow(index)">
        <button
            class="absolute top-0 left-0 items-center justify-center hidden rounded-sm bg-slate-300 group-hover:flex p-0.5"
            title="Add a row above" @click="store.addRow(index - 1)">
            <IconPlus :size="8" />
        </button>

        {{ index + 1 }}

        <Dropdown class="absolute right-0 !flex items-center justify-center">
            <template #trigger>
                <button class="p-0.5 items-center justify-center hidden rounded group-hover:flex hover:bg-slate-300">
                    <IconDotsVertical :size="10" />
                </button>
            </template>

            <div class="flex flex-col w-48 text-sm">
                <div class="p-2 font-semibold border-b text-md">Row {{ index + 1 }}</div>
                <div class="flex items-center gap-2 p-2">
                    <IconLineHeight :size="18" />
                    <div class="flex-1 font-semibold">Height</div>
                    <div class="flex items-baseline gap-1">
                        <input type="number" min="20" max="1000" class="p-1 outline-none"
                            :value="store.sheet.style.rows?.[index + 1]?.height || '24'"
                            @change="e => store.updateRowStyle(index + 1, { height: parseInt((e.target as HTMLInputElement).value) })">px
                    </div>
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.deleteRow(index)">
                    <IconTrash :size="18" /> Delete row
                </div>
            </div>
        </Dropdown>
    </div>
</template>

<script setup lang="ts">
import Dropdown from "v-dropdown";
import { computed } from "vue";
import { IconPlus, IconDotsVertical, IconTrash, IconLineHeight } from "@tabler/icons-vue";
import { useStore } from "../../store/store";

const props = defineProps<{ index: number }>();

const store = useStore();

const isRowSelected = computed(() => store.selectedCells.start.rowIndex === props.index && store.selectedCells.end.rowIndex === props.index);
</script>
