<template>
    <div v-show="store.file.settings.showFormulaBar" class="flex">
        <div class="flex items-center justify-center w-10 p-1 font-mono font-semibold border-r border-y">
            {{ store.ActiveCellName }}
        </div>
        <div class="flex items-center justify-center px-2 py-1 border-y">
            <IconMathFunction :size="18" />
        </div>
        <input v-model="activeCellValue" type="text"
            class="self-stretch flex-1 p-1 mr-0.5 border outline-none bg-slate-50 focus:border-slate-400"
            @keyup.enter="store.setActiveCellDown()">
        <div v-if="isFormula(activeCellValue)" class="flex items-center justify-center p-1 border-y bg-slate-50">
            <IconEqual :size="18" />
        </div>
        <div v-if="isFormula(activeCellValue)" class="flex-1 p-1 font-semibold border border-l-0 bg-slate-50">
            {{ calculateValue(activeCellValue) }}
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

import { computed } from "vue";
import { IconMathFunction, IconEqual } from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { calculateValue } from "../../utils/computer";
import { isFormula } from "../../utils/helpers";

const store = useStore();

const activeCellValue = computed({ get() { return store.ActiveCell.value; }, set(v: string) { store.setActiveCellValue(v); } });
</script>
