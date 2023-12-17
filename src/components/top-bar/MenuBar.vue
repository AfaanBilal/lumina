<template>
    <div class="flex border-y">
        <Dropdown ref="fileDropdown">
            <template #trigger>
                <div class="flex items-center gap-1 px-2 py-1 border-r cursor-pointer select-none hover:bg-slate-100">
                    <IconFile :size="18" /> File
                </div>
            </template>

            <div class="flex flex-col text-sm min-w-[7rem] print:hidden">
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100" @click="open">
                    <IconFile :size="18" /> Open
                    <input ref="input" type="file" class="hidden" @change="onFileSelected">
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100" @click="save">
                    <IconDeviceFloppy :size="18" /> Save
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100" @click="print">
                    <IconPrinter :size="18" /> Print
                </div>
            </div>
        </Dropdown>

        <Dropdown ref="insertDropdown">
            <template #trigger>
                <div class="flex items-center gap-1 px-2 py-1 border-r cursor-pointer select-none hover:bg-slate-100">
                    <IconTablePlus :size="18" /> Insert
                </div>
            </template>

            <div class="flex flex-col text-sm min-w-[7rem] print:hidden">
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100"
                    @click="store.addRow(store.activeCellCoordinates.rowIndex); insertDropdown.close();">
                    <IconRowInsertTop :size="18" /> Insert row above
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100"
                    @click="store.addRow(store.activeCellCoordinates.rowIndex + 1); insertDropdown.close();">
                    <IconRowInsertBottom :size="18" /> Insert row below
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100"
                    @click="store.addColumn(store.activeCellCoordinates.cellIndex); insertDropdown.close();">
                    <IconColumnInsertLeft :size="18" /> Insert column left
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100"
                    @click="store.addColumn(store.activeCellCoordinates.cellIndex + 1); insertDropdown.close();">
                    <IconColumnInsertRight :size="18" /> Insert column right
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100"
                    @click="store.addSheet(); insertDropdown.close();">
                    <IconTablePlus :size="18" /> Insert sheet
                </div>
            </div>
        </Dropdown>

        <Dropdown>
            <template #trigger>
                <div class="flex items-center gap-1 px-2 py-1 border-r cursor-pointer select-none hover:bg-slate-100">
                    <IconEye :size="18" /> View
                </div>
            </template>

            <div class="flex flex-col text-sm print:hidden">
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input id="style-bar" v-model="settings.showStyleBar" type="checkbox" class="accent-slate-600">
                    <label for="style-bar" class="cursor-pointer select-none hover:font-medium">Style bar</label>
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input id="formula-bar" v-model="settings.showFormulaBar" type="checkbox" class="accent-slate-600">
                    <label for="formula-bar" class="cursor-pointer select-none hover:font-medium">Formula bar</label>
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input id="gridlines" v-model="settings.showGridlines" type="checkbox" class="accent-slate-600">
                    <label for="gridlines" class="cursor-pointer select-none hover:font-medium">Gridlines</label>
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input id="stripes" v-model="settings.showStripes" type="checkbox" class="accent-slate-600">
                    <label for="stripes" class="cursor-pointer select-none hover:font-medium">Stripes</label>
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input id="row-band" v-model="settings.showRowBand" type="checkbox" class="accent-slate-600">
                    <label for="row-band" class="cursor-pointer select-none hover:font-medium">Row band</label>
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input id="column-band" v-model="settings.showColumnBand" type="checkbox" class="accent-slate-600">
                    <label for="column-band" class="cursor-pointer select-none hover:font-medium">Column band</label>
                </div>
                <div class="flex items-center gap-2 px-2 py-1 border-b cursor-pointer hover:bg-slate-100"
                    @click="fullscreen">
                    <IconMaximize :size="18" /> Fullscreen
                </div>
            </div>
        </Dropdown>

        <Dropdown>
            <template #trigger>
                <div class="flex items-center gap-1 px-2 py-1 border-r cursor-pointer select-none hover:bg-slate-100">
                    <IconSettings :size="18" /> Settings
                </div>
            </template>

            <div class="flex flex-col text-sm print:hidden">
                <div class="flex items-center gap-2 px-2 py-1 border-b">
                    <input id="autofocus" v-model="settings.autofocus" type="checkbox" class="accent-slate-600">
                    <label for="autofocus" class="cursor-pointer select-none hover:font-medium">Auto focus input</label>
                </div>
            </div>
        </Dropdown>

        <div class="flex items-center gap-1 px-2 py-1 ml-auto border-l" title="Zoom">
            <IconZoomIn :size="18" />
            <select v-model="settings.zoom" class="w-full outline-none cursor-pointer">
                <option v-for="z in zoomList" :key="z" :value="z">{{ z }}</option>
            </select>
        </div>

        <Dropdown ref="helpDropdown">
            <template #trigger>
                <div class="flex items-center gap-1 px-2 py-1 border-l cursor-pointer select-none hover:bg-slate-100">
                    <IconHelp :size="18" /> Help
                </div>
            </template>

            <div class="flex flex-col text-sm print:hidden w-80">
                <div class="flex items-center justify-between gap-2 p-1 border-b">
                    <div class="px-1">Start formula</div>
                    <div class="w-16 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">=</div>
                </div>
                <div class="flex items-center justify-between gap-2 p-1 border-b">
                    <div class="px-1">Cell reference</div>
                    <div class="w-16 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">A1</div>
                </div>
                <div class="flex items-center justify-between gap-2 p-1 border-b">
                    <div class="px-1">Range reference</div>
                    <div class="w-16 px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">A1:D4</div>
                </div>
                <div class="flex items-center justify-between gap-2 p-1 border-b">
                    <div class="px-1">Operator call</div>
                    <div class="px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">=cos pi</div>
                </div>
                <div class="flex items-center justify-between gap-2 p-1 border-b">
                    <div class="px-1">Function call</div>
                    <div class="px-2 py-0.5 text-center border rounded bg-slate-700 text-slate-300">=SUM(A1:D4)</div>
                </div>
                <div class="flex justify-between p-2 cursor-pointer bg-slate-900 text-slate-200 hover:bg-slate-600"
                    @click="showReference">
                    <div>Operators, functions and constants</div>
                    <div>&rarr;</div>
                </div>
            </div>
        </Dropdown>
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

import { computed, ref } from "vue";
import {
    IconDeviceFloppy, IconFile, IconSettings, IconEye, IconPrinter,
    IconTablePlus, IconRowInsertTop, IconRowInsertBottom, IconColumnInsertLeft, IconColumnInsertRight, IconMaximize,
    IconZoomIn, IconHelp,
} from "@tabler/icons-vue";
import Dropdown from "v-dropdown";
import { useStore } from "../../store/store";
import { download } from "../../utils/helpers";
import { Settings } from "../../App.d";

const store = useStore();

const settings = computed<Settings>({ get() { return store.file.settings; }, set(s: Settings) { console.log(s); store.updateSettings(s); } });

const fileDropdown = ref();
const input = ref<HTMLInputElement>();

const open = () => { input.value!.click(); fileDropdown.value!.close(); };
const save = () => { download(store.file.name + ".lumina", JSON.stringify(store.file)); fileDropdown.value!.close(); };
const print = () => { window.print(); fileDropdown.value!.close(); };

const onFileSelected = (e: Event) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files?.length) return;

    store.loadFromFile(files[0]);
};

const insertDropdown = ref();

const fullscreen = () => document.body.requestFullscreen();

const helpDropdown = ref();
const showReference = () => { settings.value.referenceVisible = true; helpDropdown.value.close(); };

const zoomList = ["50%", "75%", "90%", "100%", "125%", "150%", "200%", "300%", "400%", "500%"];
</script>
