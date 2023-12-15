<template>
    <div class="flex flex-col w-screen h-screen overflow-hidden">
        <TopBar />
        <LuminaSheet :sheet="store.sheet" />
        <ReferenceModal />
    </div>
</template>

<script setup lang="ts">
import { useStore } from "./store/store";
import LuminaSheet from "./components/sheet/LuminaSheet.vue";
import ReferenceModal from "./components/ReferenceModal.vue";
import TopBar from "./components/topbar/TopBar.vue";

const store = useStore();
</script>
