<template>
    <div class="flex items-center justify-center font-medium text-sm border p-0.5 bg-slate-100 group select-none cursor-pointer sticky left-0"
        :class="{
            'bg-blue-300': isSelected,
            'sticky bg-slate-300 z-50': store.sheet.style.rows?.[index]?.frozen,
            'bg-slate-300 opacity-0': store.sheet.style.rows?.[index]?.hidden && !store.file.settings.showHidden,
            'bg-slate-300 opacity-70': store.sheet.style.rows?.[index]?.hidden && store.file.settings.showHidden,
        }" :style="(store.sheet.style.rows?.[index]?.frozen ? `top: ${store.getFrozenTop(index)}px;` : '')"
        @click="ram.selectRow(index)">
        {{ index + 1 }}

        <Dropdown class="absolute right-0 !flex items-center justify-center">
            <template #trigger>
                <button
                    class="p-0.5 items-center justify-center hidden rounded-full group-hover:flex hover:bg-slate-300 my-auto">
                    <IconDotsVertical :size="10" />
                </button>
            </template>

            <div class="flex flex-col w-48 text-sm">
                <div class="p-2 font-semibold border-b text-md">Row {{ index + 1 }}</div>
                <div class="flex items-center gap-2 p-2">
                    <IconLineHeight :size="16" />
                    <div class="flex-1 font-semibold">Height</div>
                    <div class="flex items-baseline gap-1">
                        <input type="number" min="20" max="1000" class="p-1 border rounded outline-none"
                            :value="store.sheet.style.rows?.[index + 1]?.height || '24'"
                            @change="e => store.updateRowStyle(index + 1, { height: parseInt((e.target as HTMLInputElement).value) })">px
                    </div>
                </div>
                <div class="flex items-center gap-2 p-2 border-t">
                    <input :id="'frozen-row-' + index" v-model="frozen" type="checkbox" class="w-4 accent-slate-600">
                    <label :for="'frozen-row-' + index" class="font-semibold cursor-pointer select-none">Freeze</label>
                </div>
                <div class="flex items-center gap-2 p-2 border-t">
                    <input :id="'hidden-row-' + index" v-model="hidden" type="checkbox" class="w-4 accent-slate-600">
                    <label :for="'hidden-row-' + index" class="font-semibold cursor-pointer select-none">Hide</label>
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold border-t text-slate-400"
                    :class="{ 'text-slate-900 cursor-pointer hover:bg-slate-100': index > 0 }"
                    @click="store.moveRowUp(index)">
                    <IconArrowMoveUp :size="16" /> Move up
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold border-b text-slate-400"
                    :class="{ 'text-slate-900 cursor-pointer hover:bg-slate-100': index < store.rowCount - 1 }"
                    @click="store.moveRowDown(index)">
                    <IconArrowMoveDown :size="16" /> Move down
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addRow(index)">
                    <IconRowInsertTop :size="16" /> Insert row above
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                    @click="store.addRow(index + 1)">
                    <IconRowInsertBottom :size="16" /> Insert row below
                </div>
                <div class="flex items-center gap-2 p-2 font-semibold border-t cursor-pointer hover:bg-slate-100"
                    @click="store.deleteRow(index)">
                    <IconRowRemove :size="16" /> Delete row
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
import {
    IconDotsVertical, IconLineHeight, IconRowInsertTop, IconRowInsertBottom,
    IconRowRemove, IconArrowMoveUp, IconArrowMoveDown,
} from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { useRAM } from "../../store/ram";

const props = defineProps<{ index: number }>();

const store = useStore();
const ram = useRAM();

const isSelected = computed(() => ram.selectedCells.start.rowIndex <= props.index && ram.selectedCells.end.rowIndex >= props.index);

const frozen = computed({ get() { return store.sheet.style.rows?.[props.index]?.frozen || false; }, set(v: boolean) { store.updateRowStyle(props.index, { frozen: v }); } });
const hidden = computed({ get() { return store.sheet.style.rows?.[props.index]?.hidden || false; }, set(v: boolean) { store.updateRowStyle(props.index, { hidden: v }); } });
</script>
