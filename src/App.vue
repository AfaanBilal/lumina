<template>
    <div class="flex flex-col w-screen h-screen overflow-hidden">
        <LuminaTopBar />
        <LuminaSheet :sheet="store.sheet" />
        <ReferenceModal />
    </div>
</template>

<script setup lang="ts">
import { useStore } from "./store/store";
import LuminaSheet from "./components/LuminaSheet.vue";
import ReferenceModal from "./components/ReferenceModal.vue";
import LuminaTopBar from "./components/LuminaTopBar.vue";

const store = useStore();
</script>
