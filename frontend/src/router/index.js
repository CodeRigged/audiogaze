import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const components = require.context('@/views', true, /.*.(vue)$/);
const routes = components.keys().map((x) => {
  const component = components(x).default;
  const {name, path} = component;
  return {name, path, component};
});

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
