import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./stores/index.js";
import "./plugins/axios.js";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import "./assets/styles/style.css";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "freeupTheme",
    themes: {
      freeupTheme: {
        dark: false,
        colors: {
          background: "#ffffff",
          surface: "#ffffff",
          primary: "#ffd600",
        },
      },
    },
  },
});

const app = createApp(App);

app.use(store);
app.use(router);
app.use(vuetify);

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});

app.mount("#app");
