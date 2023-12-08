<template>
    <div class="flex items-center w-full">
        <LuminaIndexCell :index="index" />
        <LuminaCell v-for="(cell, i) of row.cells" :key="cell.id" :cell="cell" :index="i" :row-index="index" />
        <button @click="store.addColumn()">Add Column</button>
    </div>
</template>

<script setup lang="ts">
import type { ILuminaRow } from "../App.d";
import LuminaCell from "./LuminaCell.vue";
import { useStore } from "../store/store";
import LuminaIndexCell from "./LuminaIndexCell.vue";

defineProps<{ index: number; row: ILuminaRow; }>();

const store = useStore();
</script>
