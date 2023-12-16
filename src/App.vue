<template>
    <div class="flex flex-col w-screen h-screen overflow-hidden">
        <TopBar />
        <LuminaSheet :sheet="store.sheet" />
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

import { useStore } from "./store/store";
import LuminaSheet from "./components/sheet/LuminaSheet.vue";
import ReferenceModal from "./components/ReferenceModal.vue";
import TopBar from "./components/top-bar/TopBar.vue";
import BottomBar from "./components/bottom-bar/BottomBar.vue";

const store = useStore();
</script>
