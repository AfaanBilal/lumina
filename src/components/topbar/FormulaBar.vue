<template>
    <div class="flex border rounded">
        <div class="flex items-center justify-center w-10 p-1 font-mono font-semibold border-r">
            {{ store.ActiveCellName }}
        </div>
        <div class="p-1 border-r">
            <IconMathFunction :size="18" />
        </div>
        <input v-model="activeCellValue" type="text" class="flex-1 p-1 outline-none bg-slate-100"
            @keyup.enter="store.selectCellDown()">
        <div v-if="isFormula(activeCellValue)" class="flex-1 p-1 font-semibold border-l bg-slate-100">
            {{ calculateValue(activeCellValue) }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IconMathFunction } from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { calculateValue } from "../../utils/computer";
import { isFormula } from "../../utils/helpers";

const store = useStore();

const activeCellValue = computed({ get() { return store.ActiveCell.value; }, set(v: string) { store.setActiveCellValue(v); } });
</script>
