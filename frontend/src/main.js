import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {vuetify} from '@/plugins';
import store from '@/store';

// get all global components
const components = require.context(
  '@/components/global-components/',
  true,
  /.*.(vue|js)$/,
);

// register all global components
components.keys().forEach((x) => {
  const component = components(x).default;
  Vue.component(component.name, component);
});

// mount Vue
new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
