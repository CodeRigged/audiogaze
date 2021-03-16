<template>
  <v-row class="flex-grow-0 ma-0 pa-0">
    <v-col>
      <v-breadcrumbs large :items="items"></v-breadcrumbs>
    </v-col>
  </v-row>
</template>

<script>
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
    refreshPage() {
      this.$store.dispatch('document/loadData', this.$route.params.cid);
    },
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
      console.log(meta);
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
