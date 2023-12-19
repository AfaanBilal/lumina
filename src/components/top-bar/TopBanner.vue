<template>
    <div class="flex flex-col">
        <div v-if="store.sheet.locked" class="flex items-center justify-center gap-2 p-2 text-sm text-white bg-slate-700">
            <IconLock :size="16" />
            This sheet is locked
            <button class="underline" @click="store.setSheetLocked(store.activeSheetIndex, false)">Unlock</button>
        </div>
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

import { IconLock } from "@tabler/icons-vue";
import { useStore } from "../../store/store";

const store = useStore();
</script>
