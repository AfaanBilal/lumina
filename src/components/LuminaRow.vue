<template>
    <div class="flex items-center w-full">
        <LuminaIndexCell :index="index" />
        <LuminaCell v-for="(cell, i) of row.cells" :key="cell.id" :cell="cell" :index="i" :row-index="index" />
    </div>
</template>

<script setup lang="ts">
import type { ILuminaRow } from "../App.d";
import LuminaIndexCell from "./LuminaIndexCell.vue";
import LuminaCell from "./LuminaCell.vue";

defineProps<{ index: number; row: ILuminaRow; }>();
</script>
