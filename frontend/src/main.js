import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./stores/index.js";
import "@/plugins/axios"; // set up axios global instance
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
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
          "primary-darken-1": "#f7c500",
          secondary: "#fff8e1",
          error: "#b00020",
          info: "#2196f3",
          success: "#4caf50",
          warning: "#fb8c00",
        },
      },
    },
  },
});
const app = createApp(App);
app.use(store);
app.use(router);
app.use(vuetify);
app.mount("#app");