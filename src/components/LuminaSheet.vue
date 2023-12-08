<template>
    <div class="flex flex-col w-full border">
        <LuminaRow :row="headerRow" :index="-1" :max-rows="store.maxRows" />
        <LuminaRow v-for="(row, i) of sheet.rows" :key="row.id" :row="row" :index="i" />
        <button @click="store.addRow()">Add Row</button>
    </div>
</template>

<script setup lang="ts">
import type { ILuminaSheet } from "../App.d";
import LuminaRow from "./LuminaRow.vue";
import { useStore } from "../store/store";
import { computed } from "vue";

defineProps<{ sheet: ILuminaSheet }>();

const store = useStore();

const headerRow = computed(() => ({
    id: "header",
    cells: [...Array(store.maxColumns).keys()].map(i => ({ id: "header_" + String.fromCharCode(65 + i), value: String.fromCharCode(65 + i) })),
}));
</script>
