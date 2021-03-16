import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { vuetify } from "./plugins";
// register global components
const components = require.context("@/components/global", true, /.*.(vue)$/);
components.keys().forEach((x) => {
  const component = components(x).default;
  Vue.component(`app-${component.name}`, component);
});

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
