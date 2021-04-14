<template>
  <v-app>
    <info-snackbar />
    <error-overlay />
    <breadcrumb v-if="!isFullScreen" />
    <v-main class="background">
      <loading-filter v-if="isLoading" />
      <router-view v-show="!isLoading" />
    </v-main>
    <app-footer v-if="!isFullScreen" />
  </v-app>
</template>

<script>
import Breadcrumb from '@/components/navigation/Breadcrumb.vue';
import ErrorOverlay from '@/components/other/ErrorOverlay.vue';
import LoadingFilter from '@/components/other/LoadingFilter.vue';
import {mapState} from 'vuex';
import Footer from './components/navigation/Footer.vue';
import InfoSnackbar from './components/other/InfoSnackbar.vue';

export default {
  components: {
    AppFooter: Footer,
    ErrorOverlay,
    Breadcrumb,
    LoadingFilter,
    InfoSnackbar,
  },
  name: 'app',
  methods: {},
  computed: {...mapState('appState', ['isLoading', 'isFullScreen'])},
  watch: {},
  created() {
    this.$store.dispatch('setup');
  },
};
</script>
<style lang="scss">
@import './styles/app.scss';
</style>
