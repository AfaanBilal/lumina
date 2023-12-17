/**
 * Lumina
 *
 * @author      Afaan Bilal
 * @link        https://afaan.dev
 * @link        https://github.com/AfaanBilal/lumina
 * @license     MIT
 * @copyright   2023 Afaan Bilal
 */

import { createApp } from "vue";
import { createPinia } from "pinia";
import { PiniaUndo } from "pinia-undo";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

const pinia = createPinia();
pinia.use(PiniaUndo);

app.use(pinia);
app.use(Vue3ColorPicker);
app.mount("#app");
