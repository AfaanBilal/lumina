<template>
    <div class="flex items-center justify-center font-medium text-sm border p-0.5 bg-slate-100 group select-none cursor-pointer sticky left-0"
        :class="{
            'bg-slate-200': index === store.activeCellCoordinates.rowIndex,
            'bg-blue-100 border-l-blue-700 border-y-blue-700': isRowSelected,
            'sticky bg-slate-300 z-50': store.sheet.style.rows?.[index]?.frozen,
        }" :style="(store.sheet.style.rows?.[index]?.frozen ? `top: ${store.getFrozenTop(index)}px;` : '')"
        @click="store.selectRow(index)">
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
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input :id="'frozen-row-' + index" v-model="frozen" type="checkbox" class="accent-slate-600">
                    <label :for="'frozen-row-' + index" class="cursor-pointer select-none hover:font-medium">Freeze</label>
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addRow(index)">
                    <IconRowInsertTop :size="18" /> Insert row above
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addRow(index + 1)">
                    <IconRowInsertBottom :size="18" /> Insert row below
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.deleteRow(index)">
                    <IconRowRemove :size="18" /> Delete row
                </div>
            </div>
        </Dropdown>
    </div>
</template>

<script setup lang="ts">
/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import Dropdown from "v-dropdown";
import { computed } from "vue";
import { IconDotsVertical, IconLineHeight, IconRowInsertTop, IconRowInsertBottom, IconRowRemove } from "@tabler/icons-vue";
import { useStore } from "../../store/store";

const props = defineProps<{ index: number }>();

const store = useStore();

const isRowSelected = computed(() => store.selectedCells.start.rowIndex === props.index && store.selectedCells.end.rowIndex === props.index);
const frozen = computed({ get() { return store.sheet.style.rows?.[props.index]?.frozen || false; }, set(v: boolean) { store.updateRowStyle(props.index, { frozen: v }); } });
</script>
