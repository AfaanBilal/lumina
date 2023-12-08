<template>
    <div class="flex items-center justify-between p-2">
        <h1 class="text-2xl">Lumina</h1>
        <a href="https://afaan.dev" target="_blank" rel="noopener" class="text-lg text-slate-500 hover:text-blue-500">&copy; Afaan Bilal</a>
    </div>
    <LuminaSheet :sheet="store.sheet" />
</template>

<script setup lang="ts">
import { useStore } from "./store/store";
import LuminaSheet from "./components/LuminaSheet.vue";

const store = useStore();
</script>
