<template>
  <v-breadcrumbs v-if="!isFullScreen" large :items="items"></v-breadcrumbs>
</template>

<script>
import {mapState} from 'vuex';
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
    ...mapState(['isFullScreen']),
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
