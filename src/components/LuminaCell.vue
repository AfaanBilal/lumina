<template>
    <div
        class="flex text-sm items-center border p-0.5 animate-[fadeIn_.3s_ease-in-out]"
        :class="{
            'bg-slate-100': store.settings.stripes && rowIndex % 2 == 1,
            'border-2 border-blue-500': isSelected,
            'border-y-slate-400': store.settings.rowBand && store.activeCell.rowIndex === rowIndex && store.activeCell.cellIndex > cellIndex,
            'border-x-slate-400': store.settings.colBand && store.activeCell.cellIndex === cellIndex && store.activeCell.rowIndex > rowIndex,
        }"
        @click="cellClick">
        <div
            v-show="!isSelected" class="w-full overflow-clip"
            :class="{
                'font-bold': props.cell.style?.bold,
                'italic': props.cell.style?.italic,
                'underline': props.cell.style?.underline,
            }">
            {{ computedValue }}
        </div>
        <div v-if="isSelected">
            <input
                ref="input"
                v-model="value"
                type="text"
                class="w-full h-5 outline-none"
                :class="{
                    'font-bold': props.cell.style?.bold,
                    'italic': props.cell.style?.italic,
                    'underline': props.cell.style?.underline,
                }"
                @keyup.enter="store.selectCellDown()">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { Parser } from "expr-eval";
import { useStore } from "../store/store";
import type { HashMap, ILuminaCell, TLuminaCellValue } from "../App.d";
import { isFormula, columnToIndex, isNumeric, toNumber } from "../utils/helpers";

const props = defineProps<{ rowIndex: number; cellIndex: number; cell: ILuminaCell; }>();

const store = useStore();

const isSelected = computed(() => store.activeCell.rowIndex === props.rowIndex && store.activeCell.cellIndex === props.cellIndex);

const value = computed<TLuminaCellValue>({
    get() {
        return props.cell.value;
    },
    set(v: TLuminaCellValue) {
        store.setCellValue({ rowIndex: props.rowIndex, cellIndex: props.cellIndex }, v);
    },
});

const input = ref<HTMLInputElement | null>(null);
const cellClick = () => {
    store.selectCell({ rowIndex: props.rowIndex, cellIndex: props.cellIndex });

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
        const cells = v.toUpperCase().match(/[A-Z]+[\d]+/g);

        let values: HashMap<number> = {};
        if (cells) {
            for (let i = 0; i < cells.length; i++) {
                const v = cellValue(cells[i]);

                if (!isNumeric(v)) return ERROR;

                values[cells[i].toLowerCase()] = toNumber(v);
            }
        }

        try {
            return Parser.parse(v.substring(1).toLowerCase()).evaluate(values);
        } catch (e) {
            return ERROR;
        }
    }

    return v;
});
</script>
