<template>
    <div ref="grid" class="relative grid overflow-auto" :onmousedown="onMouseDown" :onmouseup="onMouseUp" :style="`
            grid-template-rows: ${rowTemplate}; grid-template-columns: ${colTemplate}; zoom: ${store.file.settings.zoom};
        `">
        <LuminaSheetHeader />

        <template v-for="(row, i) of sheet.rows" :key="row.id">
            <LuminaIndexCell :index="i" />
            <LuminaCell v-for="(cell, j) of row.cells" :key="cell.id" :cell="cell" :row-index="i" :cell-index="j" />
        </template>

        <button class="flex items-center justify-center w-10 h-6 px-2 bg-slate-300 hover:bg-slate-200" title="Add row"
            @click="addRow">
            <IconPlus :size="16" />
        </button>
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

import { IconPlus } from "@tabler/icons-vue";
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "../../store/store";
import type { ILuminaSheet } from "../../App.d";
import LuminaSheetHeader from "./LuminaSheetHeader.vue";
import LuminaCell from "./LuminaCell.vue";
import LuminaIndexCell from "./LuminaIndexCell.vue";
import { useRAM } from "../../store/ram";

defineProps<{ sheet: ILuminaSheet }>();

const store = useStore();
const ram = useRAM();
const grid = ref();

const rowTemplate = computed(() => {
    let r = "24px ";

    for (let i = 0; i < store.sheet.rows.length; i++) {
        if (!store.file.settings.showHidden && store.sheet.style.rows?.[i]?.hidden) {
            r += "0 ";
        } else {
            r += (store.sheet.style.rows?.[i]?.height || 24) + "px ";
        }
    }

    return r;
});

const colTemplate = computed(() => {
    let c = "2.5rem ";

    for (let i = 0; i < store.sheet.rows[0].cells.length; i++) {
        if (!store.file.settings.showHidden && store.sheet.style.cols?.[i]?.hidden) {
            c += "0 ";
        } else {
            c += (store.sheet.style.cols?.[i]?.width || 80) + "px ";
        }
    }

    return c;
});

const addRow = () => {
    store.addRow();
    nextTick(() => grid.value.scrollTo(0, grid.value.scrollHeight));
};

const navKeyListener = (e: KeyboardEvent) => {
    const inputFocused = document.activeElement && document.activeElement.tagName.toLowerCase() === "input";
    if (inputFocused) {
        switch (e.key) {
            case "Escape":
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
                break;
            case "Enter":
                e.preventDefault();
                ram.setActiveCellDown();
                break;
        }

        return;
    }

    switch (e.key) {
        case "ArrowUp":
            e.preventDefault();
            ram.setActiveCellUp();
            break;
        case "ArrowDown":
            e.preventDefault();
            ram.setActiveCellDown();
            break;
        case "ArrowLeft":
            e.preventDefault();
            ram.setActiveCellLeft();
            break;
        case "ArrowRight":
            e.preventDefault();
            ram.setActiveCellRight();
            break;
        case "Delete":
        case "Backspace":
            e.preventDefault();
            store.setActiveCellValue("");
            break;
        case "y":
            if (!e.ctrlKey) break;
            e.preventDefault();
            store.redo();
            break;
        case "z":
            if (!e.ctrlKey) break;
            e.preventDefault();
            store.undo();
            break;
    }
};

const onMouseDown = () => ram.startSelection();
const onMouseUp = () => {
    ram.endSelection();
    ram.applyPaintFormat();
};

onMounted(() => window.addEventListener("keydown", navKeyListener));
onUnmounted(() => window.removeEventListener("keydown", navKeyListener));
</script>
