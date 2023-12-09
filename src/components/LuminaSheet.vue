<template>
    <div
        class="grid overflow-x-auto border"
        :style="`
            grid-template-rows: repeat(${sheet.rows.length}, 1.5rem);
            grid-template-columns: 2.5rem repeat(${sheet.rows[0].cells.length}, 5rem);
        `">
        <LuminaHeader />

        <template v-for="(row, i) of sheet.rows" :key="row.id">
            <LuminaIndexCell :index="i" />
            <LuminaCell v-for="(cell, j) of row.cells" :key="cell.id" :cell="cell" :index="j" :row-index="i" />
        </template>

        <button class="flex items-center justify-center h-6 px-2 w-fit bg-slate-300" @click="store.addRow()">
            <IconPlus :size="16" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";
import { onMounted, onUnmounted } from "vue";

import { useStore } from "../store/store";
import type { ILuminaSheet } from "../App.d";
import LuminaHeader from "./LuminaHeader.vue";
import LuminaCell from "./LuminaCell.vue";
import LuminaIndexCell from "./LuminaIndexCell.vue";

defineProps<{ sheet: ILuminaSheet }>();

const store = useStore();

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
    }
};

onMounted(() => window.addEventListener("keydown", navKeyListener));
onUnmounted(() => window.removeEventListener("keydown", navKeyListener));
</script>
