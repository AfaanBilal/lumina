<template>
    <div class="flex rounded border-y">
        <Dropdown ref="fileDropdown">
            <template #trigger>
                <div class="flex items-center gap-1 px-2 py-1 cursor-pointer select-none border-x hover:bg-slate-100">
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

        <Dropdown>
            <template #trigger>
                <div class="flex items-center gap-1 px-2 py-1 border-r cursor-pointer select-none hover:bg-slate-100">
                    <IconSettings :size="18" /> Settings
                </div>
            </template>

            <div class="flex flex-col text-sm min-w-[7rem] print:hidden">
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

            <div class="flex flex-col print:hidden w-80">
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
import { IconDeviceFloppy, IconFile, IconSettings, IconPrinter, IconHelp } from "@tabler/icons-vue";
import { useStore } from "../../store/store";
import { download } from "../../utils/helpers";
import Dropdown from "v-dropdown";

const store = useStore();

const autofocus = computed<boolean>({ get() { return store.settings.autofocus; }, set(v: boolean) { store.updateSettings("autofocus", v); } });
const stripes = computed<boolean>({ get() { return store.settings.stripes; }, set(v: boolean) { store.updateSettings("stripes", v); } });
const rowBand = computed<boolean>({ get() { return store.settings.rowBand; }, set(v: boolean) { store.updateSettings("rowBand", v); } });
const colBand = computed<boolean>({ get() { return store.settings.colBand; }, set(v: boolean) { store.updateSettings("colBand", v); } });
const referenceVisible = computed<boolean>({ get() { return store.settings.referenceVisible; }, set(v: boolean) { store.updateSettings("referenceVisible", v); } });

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
