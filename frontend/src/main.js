import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {vuetify} from '@/plugins';

// register global components
const components = require.context(
  '@/components/global-components/',
  true,
  /.*.(vue|js)$/,
);

components.keys().forEach((x) => {
  const component = components(x).default;
  Vue.component(component.name, component);
});

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
