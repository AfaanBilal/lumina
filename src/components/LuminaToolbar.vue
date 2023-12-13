<template>
    <div class="flex flex-col gap-1 p-1 text-xs">
        <div class="flex gap-1 border-y">
            <Dropdown>
                <template #trigger>
                    <div class="p-2 cursor-pointer hover:bg-slate-100">File</div>
                </template>

                <div class="flex flex-col text-sm">
                    <div class="p-2 text-sm font-semibold border-b">File Management</div>
                    <div class="flex items-center gap-1 px-2 py-1 border-b cursor-pointer hover:bg-slate-100">
                        <IconFile :size="18" /> Open
                    </div>
                    <div class="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-slate-100">
                        <IconDeviceFloppy :size="18" /> Save
                    </div>
                </div>
            </Dropdown>
        </div>
        <div class="flex gap-4">
            <div class="flex border rounded">
                <div class="flex items-center justify-center w-6 border-r rounded-l cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.bold }" @click="toggleBold">
                    <IconBold :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 border-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.italic }" @click="setItalic">
                    <IconItalic :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 border-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.underline }" @click="toggleUnderline">
                    <IconUnderline :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 rounded-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.strikethrough }"
                    @click="toggleStrikethrough">
                    <IconStrikethrough :size="16" />
                </div>
            </div>
            <div class="flex border rounded">
                <div class="flex items-center justify-center w-6 border-r rounded-l cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'left' }"
                    @click="setTextAlign('left')">
                    <IconAlignLeft :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 border-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'center' }"
                    @click="setTextAlign('center')">
                    <IconAlignCenter :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 rounded-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'right' }"
                    @click="setTextAlign('right')">
                    <IconAlignRight :size="16" />
                </div>
            </div>
            <div
                class="flex items-center justify-center border rounded focus-within:border-slate-400 hover:border-slate-400">
                <input type="number" min="8" max="100" :value="store.ActiveCell.style?.fontSize || 11"
                    class="outline-none p-0.5 w-10" @change="setFontSize">
            </div>
            <div class="flex border rounded">
                <div class="flex items-center justify-center w-6 border-r">
                    <color-picker shape="circle" :round-history="true" @pure-color-change="setBackgroundColor" />
                </div>
                <div class="flex items-center justify-center w-6">
                    <color-picker shape="circle" :round-history="true" @pure-color-change="setTextColor" />
                </div>
            </div>

            <Dropdown class="ml-auto">
                <template #trigger>
                    <button class="p-0.5 items-center justify-center rounded-sm flex hover:bg-slate-100">
                        <IconDotsVertical :size="10" />
                    </button>
                </template>

                <div class="flex flex-col gap-2 p-2 text-sm">
                    <div class="font-semibold text-md">Settings</div>
                    <div class="flex items-center gap-1">
                        <input id="stripes" v-model="stripes" type="checkbox">
                        <label for="stripes" class="cursor-pointer select-none hover:font-medium">Stripes</label>
                    </div>
                    <div class="flex items-center gap-1">
                        <input id="autofocus" v-model="autofocus" type="checkbox">
                        <label for="autofocus" class="cursor-pointer select-none hover:font-medium">Auto focus input</label>
                    </div>
                    <div class="flex items-center gap-1">
                        <input id="rowBand" v-model="rowBand" type="checkbox">
                        <label for="rowBand" class="cursor-pointer select-none hover:font-medium">Row band</label>
                    </div>
                    <div class="flex items-center gap-1">
                        <input id="colBand" v-model="colBand" type="checkbox">
                        <label for="colBand" class="cursor-pointer select-none hover:font-medium">Column band</label>
                    </div>
                </div>
            </Dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "../store/store";
import { IconBold, IconItalic, IconUnderline, IconAlignLeft, IconAlignCenter, IconAlignRight, IconStrikethrough, IconDotsVertical } from "@tabler/icons-vue";
import Dropdown from "v-dropdown";
import { IconDeviceFloppy } from "@tabler/icons-vue";
import { IconFile } from "@tabler/icons-vue";

const store = useStore();

const autofocus = computed<boolean>({ get() { return store.settings.autofocus; }, set(v: boolean) { store.updateSettings("autofocus", v); } });
const stripes = computed<boolean>({ get() { return store.settings.stripes; }, set(v: boolean) { store.updateSettings("stripes", v); } });
const rowBand = computed<boolean>({ get() { return store.settings.rowBand; }, set(v: boolean) { store.updateSettings("rowBand", v); } });
const colBand = computed<boolean>({ get() { return store.settings.colBand; }, set(v: boolean) { store.updateSettings("colBand", v); } });

const setFontSize = (e: Event) => store.updateStyle({ fontSize: parseInt((e.target as HTMLInputElement).value) });
const setTextAlign = (alignment: "left" | "center" | "right") => store.updateStyle({ textAlignment: alignment });
const toggleBold = () => store.updateStyle({ bold: !store.ActiveCell.style?.bold });
const toggleStrikethrough = () => store.updateStyle({ strikethrough: !store.ActiveCell.style?.strikethrough });
const setItalic = () => store.updateStyle({ italic: !store.ActiveCell.style?.italic });
const toggleUnderline = () => store.updateStyle({ underline: !store.ActiveCell.style?.underline });
const setBackgroundColor = (color: string) => store.updateStyle({ backgroundColor: color });
const setTextColor = (color: string) => store.updateStyle({ textColor: color });
</script>
