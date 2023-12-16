<template>
    <div class="flex items-center gap-2">
        <div class="flex items-center ml-10">
            <div v-for="(s, i) in store.sheets" :key="s.id"
                class="flex justify-center gap-2 p-2 pl-4 border-l cursor-pointer first-of-type:border-none hover:bg-slate-300 border-slate-300 group"
                :class="{ 'bg-slate-900 text-white hover:bg-slate-800': store.activeSheetIndex === i }"
                @click="store.setActiveSheet(i)">
                {{ s.name }}

                <Dropdown>
                    <template #trigger>
                        <button class="items-center justify-center p-1 my-auto rounded-full hover:bg-slate-200"
                            :class="{ 'hover:bg-slate-700': store.activeSheetIndex === i }">
                            <IconDotsVertical :size="16" />
                        </button>
                    </template>

                    <div class="flex flex-col text-sm">
                        <div class="flex items-center gap-2 p-2">
                            <div class="flex-1 font-semibold">Name</div>
                            <div class="flex items-baseline gap-1">
                                <input type="text" class="p-1 border rounded outline-none" :value="store.sheets[i].name"
                                    @change="e => store.setSheetName(i, (e.target as HTMLInputElement).value)">
                            </div>
                        </div>
                        <div class="flex items-center gap-2 p-2 font-semibold cursor-pointer hover:bg-slate-100"
                            @click="store.deleteSheet(i)">
                            <IconTrash :size="18" /> Delete sheet
                        </div>
                    </div>
                </Dropdown>
            </div>
        </div>
        <div class="flex items-center gap-2 p-2 my-auto rounded-full cursor-pointer hover:bg-slate-200" title="Add Sheet"
            @click="store.addSheet">
            <IconPlus :size="20" />
        </div>
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
import { IconPlus, IconDotsVertical, IconTrash } from "@tabler/icons-vue";
import { useStore } from "../../store/store";

const store = useStore();
</script>
