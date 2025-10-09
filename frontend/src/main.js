import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./stores/index.js";

import "vuetify/styles"; // Vuetify CSS
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css"; // mdi icons

const vuetify = createVuetify({
  components,
  directives,

});

import "./plugins/axios";

import "@/assets/style.css"; 

const app = createApp(App);
app.use(store);
app.use(router);
app.use(vuetify);
app.mount("#app");
