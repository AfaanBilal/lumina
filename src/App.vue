<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-between p-2">
            <div class="flex items-center gap-2">
                <img src="/public/logo.png" alt="logo" class="w-8">
                <h1 class="text-2xl font-semibold">Lumina</h1>
            </div>
            <a href="https://afaan.dev" target="_blank" rel="noopener"
                class="text-lg text-slate-500 hover:text-blue-500">&copy; Afaan Bilal</a>
        </div>
        <div class="flex gap-4 p-1 text-xs">
            <div class="flex border">
                <div class="flex items-center justify-center w-6 border-r rounded-l cursor-pointer"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.bold }" @click="toggleBold">
                    <IconBold :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 border-r cursor-pointer"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.italic }" @click="setItalic">
                    <IconItalic :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 border-r cursor-pointer"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.underline }" @click="toggleUnderline">
                    <IconUnderline :size="16" />
                </div>
                <div class="flex items-center justify-center w-6 border-r">
                    <color-picker shape="circle" :round-history="true" @pure-color-change="setBackgroundColor" />
                </div>
                <div class="flex items-center justify-center w-6">
                    <color-picker shape="circle" :round-history="true" @pure-color-change="setTextColor" />
                </div>
            </div>
            <div class="flex gap-2 ml-auto"><input v-model="stripes" type="checkbox"> Stripes</div>
            <div class="flex gap-2"><input v-model="autofocus" type="checkbox"> Auto focus input</div>
            <div class="flex gap-2"><input v-model="rowBand" type="checkbox"> Row Band</div>
            <div class="flex gap-2"><input v-model="colBand" type="checkbox"> Column Band</div>
        </div>
        <LuminaSheet :sheet="store.sheet" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store/store";
import LuminaSheet from "./components/LuminaSheet.vue";
import { IconBold } from "@tabler/icons-vue";
import { IconItalic } from "@tabler/icons-vue";
import { IconUnderline } from "@tabler/icons-vue";

const store = useStore();

const autofocus = computed<boolean>({ get() { return store.settings.autofocus; }, set(v: boolean) { store.updateSettings("autofocus", v); } });
const stripes = computed<boolean>({ get() { return store.settings.stripes; }, set(v: boolean) { store.updateSettings("stripes", v); } });
const rowBand = computed<boolean>({ get() { return store.settings.rowBand; }, set(v: boolean) { store.updateSettings("rowBand", v); } });
const colBand = computed<boolean>({ get() { return store.settings.colBand; }, set(v: boolean) { store.updateSettings("colBand", v); } });

const toggleBold = () => store.hasSelection ? store.updateSelectionStyle({ bold: !store.ActiveCell.style?.bold }) : store.updateActiveCellStyle({ bold: !store.ActiveCell.style?.bold });
const setItalic = () => store.hasSelection ? store.updateSelectionStyle({ italic: !store.ActiveCell.style?.italic }) : store.updateActiveCellStyle({ italic: !store.ActiveCell.style?.italic });
const toggleUnderline = () => store.hasSelection ? store.updateSelectionStyle({ underline: !store.ActiveCell.style?.underline }) : store.updateActiveCellStyle({ underline: !store.ActiveCell.style?.underline });
const setBackgroundColor = (color: string) => store.hasSelection ? store.updateSelectionStyle({ backgroundColor: color }) : store.updateActiveCellStyle({ backgroundColor: color });
const setTextColor = (color: string) => store.hasSelection ? store.updateSelectionStyle({ textColor: color }) : store.updateActiveCellStyle({ textColor: color });
</script>
