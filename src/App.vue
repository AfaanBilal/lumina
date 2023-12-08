<template>
    <h1>Lumina</h1>
    <LuminaSheet :sheet="store.sheet" />
</template>

<script setup lang="ts">
import LuminaSheet from "./components/LuminaSheet.vue";
import { useStore } from "./store/store";

const store = useStore();
</script>
