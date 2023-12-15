<template>
    <div ref="grid" class="relative grid overflow-auto" :onmousedown="onMouseDown" :onmouseup="onMouseUp" :style="`
            grid-template-rows: ${rowTemplate};
            grid-template-columns: ${colTemplate};
        `">
        <LuminaSheetHeader />

        <template v-for="(row, i) of sheet.rows" :key="row.id">
            <LuminaIndexCell :index="i" />
            <LuminaCell v-for="(cell, j) of row.cells" :key="cell.id" :cell="cell" :row-index="i" :cell-index="j" />
        </template>

        <button class="flex items-center justify-center w-10 px-2 bg-slate-300 hover:bg-slate-200" title="Add row"
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

defineProps<{ sheet: ILuminaSheet }>();

const grid = ref();
const store = useStore();

const rowTemplate = computed(() => {
    let r = "";

    for (let i = 0; i < store.sheet.rows.length; i++) {
        r += (store.sheet.style.rows?.[i]?.height || 24) + "px ";
    }

    return r;
});

const colTemplate = computed(() => {
    let c = "2.5rem ";

    for (let i = 0; i < store.sheet.rows[0].cells.length; i++) {
        c += (store.sheet.style.cols?.[i]?.width || 80) + "px ";
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
                store.selectCellDown();
                break;
        }

        return;
    }

    switch (e.key) {
        case "ArrowUp":
            e.preventDefault();
            store.selectCellUp();
            break;
        case "ArrowDown":
            e.preventDefault();
            store.selectCellDown();
            break;
        case "ArrowLeft":
            e.preventDefault();
            store.selectCellLeft();
            break;
        case "ArrowRight":
            e.preventDefault();
            store.selectCellRight();
            break;
        case "Delete":
        case "Backspace":
            e.preventDefault();
            store.setActiveCellValue("");
            break;
    }
};

const onMouseDown = () => store.startSelection();
const onMouseUp = () => store.endSelection();

onMounted(() => window.addEventListener("keydown", navKeyListener));
onUnmounted(() => window.removeEventListener("keydown", navKeyListener));
</script>
