<template>
    <div class="flex flex-col">
        <div class="flex items-center justify-between p-2">
            <div class="flex items-center gap-2">
                <img src="/logo.png" alt="logo" class="w-8">
                <h1 class="text-2xl font-semibold">Lumina</h1>
            </div>
            <div class="flex self-start gap-2 text-sm">
                <a href="https://github.com/AfaanBilal/lumina" target="_blank" rel="noopener"
                    class="flex items-center gap-1 pr-2 border-r border-r-slate-300 text-slate-500 hover:text-blue-500">
                    <IconBrandGithub :size="16" /> GitHub
                </a>
                <a href="https://afaan.dev" target="_blank" rel="noopener"
                    class="flex items-center gap-1 text-slate-500 hover:text-blue-500">
                    <IconCopyright :size="16" /> Afaan Bilal
                </a>
            </div>
        </div>
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

import { IconCopyright, IconBrandGithub } from "@tabler/icons-vue";
import Toolbar from "./Toolbar.vue";
</script>
