<template>
    <div class="flex flex-col overflow-x-scroll border">
        <LuminaHeader />
        <LuminaRow v-for="(row, i) of sheet.rows" :key="row.id" :row="row" :index="i" />
        <button class="flex items-center justify-center h-6 px-2 w-fit bg-slate-300" @click="store.addRow()">
            <IconPlus :size="16" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { IconPlus } from "@tabler/icons-vue";

import type { ILuminaSheet } from "../App.d";
import { useStore } from "../store/store";
import LuminaRow from "./LuminaRow.vue";
import LuminaHeader from "./LuminaHeader.vue";

defineProps<{ sheet: ILuminaSheet }>();

const store = useStore();
</script>
