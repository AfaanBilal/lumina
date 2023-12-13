<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-between p-2">
            <div class="flex items-center gap-2">
                <img src="/logo.png" alt="logo" class="w-8">
                <h1 class="text-2xl font-semibold">Lumina</h1>
            </div>
            <a href="https://afaan.dev" target="_blank" rel="noopener"
                class="self-start text-sm text-slate-500 hover:text-blue-500">&copy; Afaan Bilal</a>
        </div>
        <LuminaToolbar />
        <LuminaSheet :sheet="store.sheet" />
    </div>
</template>

<script setup lang="ts">
import { useStore } from "./store/store";
import LuminaSheet from "./components/LuminaSheet.vue";
import LuminaToolbar from "./components/LuminaToolbar.vue";

const store = useStore();
</script>
