<template>
  <v-breadcrumbs large :items="items"></v-breadcrumbs>
</template>

<script>
/**
 * @description This is the breadcrumb displayed at the top of the applicaiton.
 *
 * Its used to navigate the application.
 */
export default {
  name: 'breadcrumb',
  data: () => ({
    items: [
      {
        text: 'Home',
        to: '/',
      },
    ],
  }),
  methods: {
    addBreadcrumb(text, to) {
      this.items.push({text, to});
    },
    removeLastBreacrumb() {
      this.isHome && this.items.pop();
    },
  },
  computed: {
    isHome() {
      return this.items.length > 1;
    },
  },
  watch: {
    $route(to) {
      const {name, meta, path} = to;
      name !== 'index'
        ? this.addBreadcrumb(meta.title, path)
        : this.removeLastBreacrumb();
    },
  },
  beforeMount() {
    const {name, meta, path} = this.$route;
    name !== 'index' && this.addBreadcrumb(meta.title, path);
  },
};
</script>
