<template>
    <div class="flex flex-col w-full border">
        <LuminaHeader />
        <LuminaRow v-for="(row, i) of sheet.rows" :key="row.id" :row="row" :index="i" />
        <button @click="store.addRow()">Add Row</button>
    </div>
</template>

<script setup lang="ts">
import type { ILuminaSheet } from "../App.d";
import { useStore } from "../store/store";
import LuminaRow from "./LuminaRow.vue";
import LuminaHeader from "./LuminaHeader.vue";

defineProps<{ sheet: ILuminaSheet }>();

const store = useStore();
</script>
