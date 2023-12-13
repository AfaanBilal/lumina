<template>
    <div class="grid overflow-x-auto border" :onmousedown="onMouseDown" :onmouseup="onMouseUp" :style="`
            grid-template-rows: ${rowTemplate};
            grid-template-columns: ${colTemplate};
        `">
        <LuminaHeader />

        <template v-for="(row, i) of sheet.rows" :key="row.id">
            <LuminaIndexCell :index="i" />
            <LuminaCell v-for="(cell, j) of row.cells" :key="cell.id" :cell="cell" :row-index="i" :cell-index="j" />
        </template>

        <button class="flex items-center justify-center h-6 px-2 w-fit bg-slate-300" @click="store.addRow()">
            <IconPlus :size="16" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";
import { computed, onMounted, onUnmounted } from "vue";

import { useStore } from "../store/store";
import type { ILuminaSheet } from "../App.d";
import LuminaHeader from "./LuminaHeader.vue";
import LuminaCell from "./LuminaCell.vue";
import LuminaIndexCell from "./LuminaIndexCell.vue";

defineProps<{ sheet: ILuminaSheet }>();

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

const navKeyListener = (e: KeyboardEvent) => {
    if (document.activeElement && document.activeElement.tagName.toLowerCase() === "input") return;

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
