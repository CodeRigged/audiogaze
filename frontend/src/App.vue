<template>
  <v-app>
    <!-- <error-overlay /> -->
    <breadcrumb />
    <v-main class="background">
      <loading-filter v-if="isLoading" />
      <v-container fluid>
        <router-view v-show="!isLoading" />
      </v-container>
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import Breadcrumb from '@/components/navigation/Breadcrumb.vue';
// import ErrorOverlay from '@/components/other/ErrorOverlay.vue';
import LoadingFilter from '@/components/other/LoadingFilter.vue';
import {mapState} from 'vuex';
import Footer from './components/navigation/Footer.vue';

export default {
  components: {
    AppFooter: Footer,
    // ErrorOverlay,
    Breadcrumb,
    LoadingFilter,
    // AbsoluteCenter,
  },
  name: 'app',
  methods: {},
  computed: {...mapState(['isLoading'])},
  watch: {},
  created() {
    this.$store.dispatch('setup');
  },
};
</script>
<style lang="scss">
@import './styles/app.scss';
</style>
