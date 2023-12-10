<template>
    <div
        class="flex text-sm items-center border p-0.5 animate-[fadeIn_.3s_ease-in-out]"
        :class="{
            'bg-slate-100': store.settings.stripes && rowIndex % 2 == 1,
            'border-2 border-blue-500': isSelected,
            'border-y-slate-400': store.settings.rowBand && store.activeCell.rowIndex === rowIndex && store.activeCell.cellIndex > index,
            'border-x-slate-400': store.settings.colBand && store.activeCell.cellIndex === index && store.activeCell.rowIndex > rowIndex,
        }"
        @click="cellClick">
        <div v-show="!isSelected" class="w-full overflow-clip">{{ computedValue }}</div>
        <div v-if="isSelected">
            <input ref="input" v-model="value" type="text" class="w-full h-5 outline-none" @keyup.enter="store.selectCellDown()">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { Parser } from "expr-eval";
import { useStore } from "../store/store";
import type { ILuminaCell, TLuminaCellValue } from "../App.d";
import { isFormula, columnToIndex } from "../utils/helpers";

const props = defineProps<{ index: number; rowIndex: number; cell: ILuminaCell; }>();

const store = useStore();

const isSelected = computed(() => store.activeCell.rowIndex === props.rowIndex && store.activeCell.cellIndex === props.index);

const value = computed<TLuminaCellValue>({
    get() {
        return props.cell.value;
    },
    set(v: TLuminaCellValue) {
        store.updateCell(props.rowIndex, props.index, { ...props.cell, value: v });
    },
});

const input = ref<HTMLInputElement | null>(null);
const cellClick = () => {
    store.selectCell(props.rowIndex, props.index);

    if (store.settings.autofocus) {
        nextTick(() => input.value?.focus());
    }
};

const cellValue = (c: string): string => {
    const col = c.toUpperCase().match(/[A-Z]+/g);
    const row = c.toUpperCase().match(/[\d]+/g);

    if (!col || !row) return "";

    const cellIndex = columnToIndex(col[0]);
    const rowIndex = parseInt(row[0]) - 1;

    return store.sheet.rows[rowIndex].cells[cellIndex].value;
};

const ERROR = "#ERROR";

const computedValue = computed(() => {
    const v = props.cell.value;

    if (isFormula(v)) {
        const base = v.toUpperCase();
        const cells = base.match(/[A-Z]+[\d]+/g);

        if (!cells) return ERROR;

        let expr = base.substring(1);
        for (let i = 0; i < cells.length; i++) {
            expr = expr.replace(cells[i], cellValue(cells[i]));
        }

        try {
            return Parser.evaluate(expr);
        } catch (e) {
            return ERROR;
        }
    }

    return v;
});
</script>
