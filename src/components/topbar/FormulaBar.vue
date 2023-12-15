<template>
    <div class="flex">
        <div class="flex items-center justify-center w-10 p-1 font-mono font-semibold border rounded-l">
            {{ store.ActiveCellName }}
        </div>
        <div class="p-1 border-y">
            <IconMathFunction :size="18" />
        </div>
        <input v-model="activeCellValue" type="text"
            class="self-stretch flex-1 p-1 border outline-none bg-slate-100 focus:border-slate-400"
            :class="{ 'rounded-r': !isFormula(activeCellValue) }" @keyup.enter="store.selectCellDown()">
        <div v-if="isFormula(activeCellValue)" class="p-1 border-y bg-slate-50">
            <IconEqual :size="18" />
        </div>
        <div v-if="isFormula(activeCellValue)" class="flex-1 p-1 font-semibold border border-l-0 rounded-r bg-slate-50">
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
import { IconMathFunction } from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { calculateValue } from "../../utils/computer";
import { isFormula } from "../../utils/helpers";
import { IconEqual } from "@tabler/icons-vue";

const store = useStore();

const activeCellValue = computed({ get() { return store.ActiveCell.value; }, set(v: string) { store.setActiveCellValue(v); } });
</script>
