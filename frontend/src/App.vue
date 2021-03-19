<template>
  <v-app>
    <!-- <error-overlay /> -->
    <breadcrumb />
    <v-main class="background">
      <!-- <absolute-center v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate />
      </absolute-center> -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Breadcrumb from '@/components/navigation/Breadcrumb.vue';
// import ErrorOverlay from '@/components/other/ErrorOverlay.vue';
// import AbsoluteCenter from '@/components/other/AbsoluteCenter.vue';

export default {
  components: {
    // ErrorOverlay,
    Breadcrumb,
    // AbsoluteCenter,
  },
  name: 'app',
  methods: {},
  watch: {},
};
</script>
<style lang="scss">
@import './styles/app.scss';
</style>
