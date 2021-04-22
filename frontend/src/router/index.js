import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// get all views
const components = require.context('@/views', true, /.*.(vue)$/);

// map views to fit with router routeConfig
const routes = components.keys().map((x) => {
  const component = components(x).default;
  const {name, path, title} = component;
  return {name, path, component, meta: {title}};
});

// initialize router (used in router-view)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
