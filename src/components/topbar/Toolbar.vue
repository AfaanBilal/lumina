<template>
    <div class="flex flex-col gap-1 p-1 text-xs print:hidden">
        <MenuBar />
        <StyleBar />
        <FormulaBar />
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

import MenuBar from "./MenuBar.vue";
import StyleBar from "./StyleBar.vue";
import FormulaBar from "./FormulaBar.vue";
</script>
