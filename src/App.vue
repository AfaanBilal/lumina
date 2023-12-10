<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-between p-2">
            <div class="flex items-center gap-2">
                <img src="/public/logo.png" alt="logo" class="w-8">
                <h1 class="text-2xl font-semibold">Lumina</h1>
            </div>
            <a href="https://afaan.dev" target="_blank" rel="noopener" class="text-lg text-slate-500 hover:text-blue-500">&copy; Afaan Bilal</a>
        </div>
        <div class="flex gap-4 p-1 text-xs">
            <div class="flex border">
                <div class="p-0.5 rounded-l border-r cursor-pointer" :class="{'bg-slate-800 text-white': store.ActiveCell.style?.bold}" @click="store.updateActiveCellStyle({ ...store.ActiveCell.style, bold: !store.ActiveCell.style?.bold })">
                    <IconBold :size="16" />
                </div>
                <div class="p-0.5 cursor-pointer" :class="{'bg-slate-800 text-white': store.ActiveCell.style?.italic}" @click="store.updateActiveCellStyle({ ...store.ActiveCell.style, italic: !store.ActiveCell.style?.italic })">
                    <IconItalic :size="16" />
                </div>
                <div class="p-0.5 rounded-r border-l cursor-pointer" :class="{'bg-slate-800 text-white': store.ActiveCell.style?.underline}" @click="store.updateActiveCellStyle({ ...store.ActiveCell.style, underline: !store.ActiveCell.style?.underline })">
                    <IconUnderline :size="16" />
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
</script>
