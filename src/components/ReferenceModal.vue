<template>
    <div v-if="store.settings.referenceVisible"
        class="fixed flex flex-col bg-white border-2 rounded-lg shadow-2xl border-slate-300 bottom-4 right-4 w-80">
        <div class="flex justify-between p-2">
            <div class="">Reference</div>
            <div class="p-1 rounded cursor-pointer hover:bg-slate-200"
                @click="store.updateSettings('referenceVisible', false);">
                <IconX :size="16" />
            </div>
        </div>
        <div class="flex flex-col gap-2 p-2 border-t">
            <div>Operators</div>
            <div class="flex flex-wrap gap-1 text-xs">
                <span v-for="o in operators" :key="o" class="px-1 py-0.5 text-gray-200 rounded bg-zinc-900">{{ o }}</span>
            </div>
            <div>Functions</div>
            <div class="flex flex-wrap gap-1 text-xs">
                <span v-for="f in functions" :key="f" class="px-1 py-0.5 text-gray-200 rounded bg-zinc-900">{{ f }}</span>
            </div>
            <div>Constants</div>
            <div class="flex flex-wrap gap-1 text-xs">
                <span v-for="c in constants" :key="c" class="px-1 py-0.5 text-gray-200 rounded bg-zinc-900">{{ c }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconX } from "@tabler/icons-vue";
import { useStore } from "../store/store";

const store = useStore();

const operators = ["-x", "+x", "x!", "abs x", "acos x", "acosh x", "asin x", "asinh x", "atan x", "atanh x", "cbrt x", "ceil x", "cos x", "cosh x", "exp x", "expm1 x", "floor x", "length x", "ln x", "log x", "log10 x", "log2 x", "log1p x", "not x", "round x", "sign x", "sin x", "sinh x", "sqrt x", "tan x", "tanh x", "trunc x"];
const functions = ["sum", "avg", "square", "random", "min", "max", "hypot", "pow", "atan2", "roundTo", "map", "fold", "filter", "indexOf", "join", "if"];
const constants = ["pi", "e", "true", "false"];
</script>
