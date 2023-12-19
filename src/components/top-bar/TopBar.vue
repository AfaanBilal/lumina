<template>
    <div class="flex flex-col">
        <div class="flex flex-wrap items-center justify-between p-2">
            <div class="flex items-center gap-2">
                <img src="/logo.png" alt="logo" class="w-5">
                <h1 class="text-xl font-semibold">Lumina</h1>
            </div>
            <div class="flex items-center self-start justify-end gap-2 text-sm">
                <input v-model="filename" type="text" title="Filename"
                    class="px-1 text-sm font-semibold text-right border border-transparent rounded-sm outline-none hover:border-slate-300 focus:border-slate-400 focus:text-left">
                <a href="https://github.com/AfaanBilal/lumina" target="_blank" rel="noopener"
                    class="flex items-center gap-1 px-2 text-xs border-x print:hidden text-slate-500 hover:text-blue-500">
                    <IconBrandGithub :size="16" /> GitHub
                </a>
                <a href="https://afaan.dev" target="_blank" rel="noopener"
                    class="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-500">
                    <IconCopyright :size="16" /> Afaan Bilal <span class="hidden print:flex">(afaan.dev)</span>
                </a>
            </div>
        </div>
        <TopBanner />
        <Toolbar />
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

import { computed } from "vue";
import { IconCopyright, IconBrandGithub } from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import Toolbar from "./Toolbar.vue";
import TopBanner from "./TopBanner.vue";

const store = useStore();

const filename = computed<string>({ get() { return store.file.name; }, set(v: string) { store.setFileName(v); } });
</script>
