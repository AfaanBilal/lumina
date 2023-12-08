<template>
    <div class="flex items-center w-full">
        <LuminaCell :cell="indexCell" :index="-1" :row-index="index" />
        <LuminaCell v-for="(cell, i) of row.cells" :key="cell.id" :cell="cell" :index="i" :row-index="index" />
        <button @click="store.addColumn()">Add Column</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ILuminaRow } from "../App.d";
import LuminaCell from "./LuminaCell.vue";
import { useStore } from "../store/store";

const props = defineProps<{ index: number; row: ILuminaRow; }>();

const store = useStore();

const isTopLeft = computed(() => props.index === -1);
const indexCell = { id: "index", value: isTopLeft.value ? "" : props.index + 1 };
</script>
