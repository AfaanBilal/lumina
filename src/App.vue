<template>
    <div class="flex flex-col w-screen h-screen overflow-hidden">
        <TopBar />
        <LuminaSheet :key="store.sheet.id" :sheet="store.sheet" />
        <div class="flex-1 min-h-0 bg-slate-100">&nbsp;</div>
        <BottomBar />
        <ReferenceModal />
    </div>
</template>

<script setup lang="ts">
/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import "vue3-toastify/dist/index.css";

import { useStore } from "./store/store";
import LuminaSheet from "./components/sheet/LuminaSheet.vue";
import ReferenceModal from "./components/ReferenceModal.vue";
import TopBar from "./components/top-bar/TopBar.vue";
import BottomBar from "./components/bottom-bar/BottomBar.vue";

const store = useStore();
</script>
