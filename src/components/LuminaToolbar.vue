<template>
    <div class="flex flex-col gap-1 p-1 text-xs print:hidden">
        <div class="flex rounded border-y">
            <Dropdown ref="fileDropdown">
                <template #trigger>
                    <div class="flex items-center gap-1 px-2 py-1 cursor-pointer select-none border-x hover:bg-slate-100">
                        <IconFile :size="18" /> File
                    </div>
                </template>

                <div class="flex flex-col font-serif text-sm min-w-[7rem] print:hidden">
                    <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100" @click="open">
                        <IconFile :size="18" /> Open
                        <input ref="input" type="file" class="hidden" @change="onFileSelected">
                    </div>
                    <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100" @click="save">
                        <IconDeviceFloppy :size="18" /> Save
                    </div>
                    <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100"
                        @click="print">
                        <IconPrinter :size="18" /> Print
                    </div>
                </div>
            </Dropdown>

            <Dropdown>
                <template #trigger>
                    <div class="flex items-center gap-1 px-2 py-1 border-r cursor-pointer select-none hover:bg-slate-100">
                        <IconSettings :size="18" /> Settings
                    </div>
                </template>

                <div class="flex flex-col font-serif text-sm min-w-[7rem] print:hidden">
                    <div class="flex items-center gap-2 px-2 py-1 border-b">
                        <input id="autofocus" v-model="autofocus" type="checkbox">
                        <label for="autofocus" class="cursor-pointer select-none hover:font-medium">Auto focus input</label>
                    </div>
                    <div class="flex items-center gap-2 px-2 py-1 border-b">
                        <input id="stripes" v-model="stripes" type="checkbox">
                        <label for="stripes" class="cursor-pointer select-none hover:font-medium">Stripes</label>
                    </div>
                    <div class="flex items-center gap-2 px-2 py-1 border-b">
                        <input id="rowBand" v-model="rowBand" type="checkbox">
                        <label for="rowBand" class="cursor-pointer select-none hover:font-medium">Row band</label>
                    </div>
                    <div class="flex items-center gap-2 px-2 py-1 border-b">
                        <input id="colBand" v-model="colBand" type="checkbox">
                        <label for="colBand" class="cursor-pointer select-none hover:font-medium">Column band</label>
                    </div>
                </div>
            </Dropdown>

            <Dropdown ref="helpDropdown" class="ml-auto">
                <template #trigger>
                    <div class="flex items-center gap-1 px-2 py-1 border-r cursor-pointer select-none hover:bg-slate-100">
                        <IconHelp :size="18" /> Help
                    </div>
                </template>

                <div class="flex flex-col font-serif print:hidden w-80">
                    <div class="flex items-center justify-between gap-2 p-1 border-b">
                        <div class="px-1">Start Formula</div>
                        <div class="w-40 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">=</div>
                    </div>
                    <div class="flex items-center justify-between gap-2 p-1 border-b">
                        <div class="px-1">Cell Reference</div>
                        <div class="w-40 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">A1</div>
                    </div>
                    <div class="flex items-center justify-between gap-2 p-1 border-b">
                        <div class="px-1">Range Reference</div>
                        <div class="w-40 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">A1:D4</div>
                    </div>
                    <div class="flex items-center justify-between gap-2 p-1 border-b">
                        <div class="px-1">Sum</div>
                        <div class="w-40 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">
                            =SUM(A1, B1:B5, 3)
                        </div>
                    </div>
                    <div class="flex items-center justify-between gap-2 p-1 border-b">
                        <div class="px-1">Average</div>
                        <div class="w-40 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">
                            =AVG(A1:B2)
                        </div>
                    </div>
                    <div class="flex items-center justify-between gap-2 p-1 border-b">
                        <div class="px-1">Square</div>
                        <div class="w-40 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">
                            =SQUARE(A1)
                        </div>
                    </div>
                    <div class="flex justify-between p-2 cursor-pointer hover:bg-slate-100" @click="showReference">
                        <div>Operator and function reference</div>
                        <div>&rarr;</div>
                    </div>
                </div>
            </Dropdown>
        </div>
        <div class="flex gap-2">
            <div class="flex">
                <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.bold }" title="Bold" @click="toggleBold">
                    <IconBold :size="18" />
                </div>
                <div class="flex items-center justify-center w-6 border-r cursor-pointer border-y hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.italic }" title="Italic"
                    @click="setItalic">
                    <IconItalic :size="18" />
                </div>
                <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.underline }" title="Underline"
                    @click="toggleUnderline">
                    <IconUnderline :size="18" />
                </div>
                <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.strikethrough }" title="Strikethrough"
                    @click="toggleStrikethrough">
                    <IconStrikethrough :size="18" />
                </div>
            </div>
            <div class="flex">
                <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'left' }"
                    title="Text align left" @click="setTextAlign('left')">
                    <IconAlignLeft :size="18" />
                </div>
                <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'center' }"
                    title="Text align center" @click="setTextAlign('center')">
                    <IconAlignCenter :size="18" />
                </div>
                <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.textAlignment === 'right' }"
                    title="Text align right" @click="setTextAlign('right')">
                    <IconAlignRight :size="18" />
                </div>
            </div>
            <div class="flex">
                <div class="flex items-center justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.verticalAlignment === 'top' }"
                    title="Vertical align top" @click="setVerticalAlign('top')">
                    <IconLayoutAlignTop :size="18" />
                </div>
                <div class="flex items-center justify-center w-6 cursor-pointer border-y hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.verticalAlignment === 'middle' }"
                    title="Vertical align middle" @click="setVerticalAlign('middle')">
                    <IconLayoutAlignCenter :size="18" />
                </div>
                <div class="flex items-center justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-200"
                    :class="{ 'bg-slate-800 text-white': store.ActiveCell.style?.verticalAlignment === 'bottom' }"
                    title="Vertical align bottom" @click="setVerticalAlign('bottom')">
                    <IconLayoutAlignBottom :size="18" />
                </div>
            </div>
            <div class="flex items-center justify-center">
                <div class="flex items-center self-stretch justify-center w-6 border rounded-l cursor-pointer hover:bg-slate-100"
                    title="Decrease font size"
                    @click="store.updateStyle({ fontSize: (store.ActiveCell.style?.fontSize || 11) - 1 })">
                    <IconMinus :size="18" />
                </div>
                <input type="number" min="8" max="200" :value="store.ActiveCell.style?.fontSize || 11"
                    class="outline-none text-center p-0.5 w-6 border-y [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    title="Font size" @change="setFontSize">
                <div class="flex items-center self-stretch justify-center w-6 border rounded-r cursor-pointer hover:bg-slate-100"
                    title="Increase font size"
                    @click="store.updateStyle({ fontSize: (store.ActiveCell.style?.fontSize || 11) + 1 })">
                    <IconPlus :size="18" />
                </div>
            </div>
            <div class="flex">
                <div class="flex items-center gap-1 px-1 border rounded-l hover:bg-slate-100" title="Background color">
                    <IconBucketDroplet :size="18" />
                    <color-picker v-model:pure-color="backgroundColor" shape="circle" :round-history="true"
                        @pure-color-change="setBackgroundColor" />
                </div>
                <div class="flex items-center gap-1 px-1 border border-l-0 rounded-r hover:bg-slate-100" title="Text color">
                    <IconTextColor :size="18" />
                    <color-picker v-model:pure-color="textColor" shape="circle" :round-history="true"
                        @pure-color-change="setTextColor" />
                </div>
            </div>
        </div>
        <div class="flex border rounded">
            <div class="p-1 border-r">
                <IconMathFunction :size="18" />
            </div>
            <input v-model="activeCellValue" type="text" class="flex-1 p-1 outline-none">
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
    IconBold, IconItalic, IconUnderline,
    IconAlignLeft, IconAlignCenter, IconAlignRight, IconStrikethrough,
    IconLayoutAlignTop, IconLayoutAlignCenter, IconLayoutAlignBottom,
    IconDeviceFloppy, IconFile, IconSettings, IconPrinter,
    IconMinus, IconPlus, IconBucketDroplet, IconTextColor, IconHelp,
} from "@tabler/icons-vue";
import { useStore } from "../store/store";
import { download } from "../utils/helpers";
import Dropdown from "v-dropdown";
import { IconMathFunction } from "@tabler/icons-vue";

const store = useStore();

const activeCellValue = computed({ get() { return store.ActiveCell.value; }, set(v: string) { store.setActiveCellValue(v); } });

const autofocus = computed<boolean>({ get() { return store.settings.autofocus; }, set(v: boolean) { store.updateSettings("autofocus", v); } });
const stripes = computed<boolean>({ get() { return store.settings.stripes; }, set(v: boolean) { store.updateSettings("stripes", v); } });
const rowBand = computed<boolean>({ get() { return store.settings.rowBand; }, set(v: boolean) { store.updateSettings("rowBand", v); } });
const colBand = computed<boolean>({ get() { return store.settings.colBand; }, set(v: boolean) { store.updateSettings("colBand", v); } });
const referenceVisible = computed<boolean>({ get() { return store.settings.referenceVisible; }, set(v: boolean) { store.updateSettings("referenceVisible", v); } });

const setFontSize = (e: Event) => store.updateStyle({ fontSize: parseInt((e.target as HTMLInputElement).value) });
const setTextAlign = (alignment: "left" | "center" | "right") => store.updateStyle({ textAlignment: alignment });
const setVerticalAlign = (alignment: "top" | "middle" | "bottom") => store.updateStyle({ verticalAlignment: alignment });
const toggleBold = () => store.updateStyle({ bold: !store.ActiveCell.style?.bold });
const toggleStrikethrough = () => store.updateStyle({ strikethrough: !store.ActiveCell.style?.strikethrough });
const setItalic = () => store.updateStyle({ italic: !store.ActiveCell.style?.italic });
const toggleUnderline = () => store.updateStyle({ underline: !store.ActiveCell.style?.underline });

const backgroundColor = computed({ get() { return store.ActiveCell.style?.backgroundColor || "rgb(255,255,255)"; }, set() {} });
const textColor = computed({ get() { return store.ActiveCell.style?.textColor || "rgb(0,0,0)"; }, set() {} });
const setBackgroundColor = (color: string) => store.updateStyle({ backgroundColor: color });
const setTextColor = (color: string) => store.updateStyle({ textColor: color });

const fileDropdown = ref();
const input = ref<HTMLInputElement>();

const open = () => { input.value!.click(); fileDropdown.value!.close(); };
const save = () => { download(store.sheet.id + ".lumina", JSON.stringify(store.sheet)); fileDropdown.value!.close(); };
const print = () => { window.print(); fileDropdown.value!.close(); };

const onFileSelected = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files?.length) return;

    store.loadFromFile(files[0]);
};

const helpDropdown = ref();
const showReference = () => { referenceVisible.value = true; helpDropdown.value.close(); };
</script>
