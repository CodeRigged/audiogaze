<template>
  <v-snackbar color="success" top v-model="snackbar" :timeout="snackbarTimeout">
    {{ infoSnackbarMessage }}
    <template v-slot:action="{attrs}">
      <v-icon v-bind="attrs" @click="setInformation">
        mdi-close
      </v-icon>
    </template>
  </v-snackbar>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex';
export default {
  name: 'info-snackbar',
  props: {},
  methods: {
    ...mapActions('appState', ['setInformation']),
  },
  computed: {
    ...mapState('appState', {
      timeout: (state) => state.infoSnackbar.timeout,
    }),
    ...mapGetters('appState', [
      'infoSnackbarVisible',
      'infoSnackbarMessage',
      'snackbarTimeout',
    ]),
    snackbar: {
      get() {
        return this.infoSnackbarVisible;
      },
      set() {
        this.setInformation();
      },
    },
  },
};
</script>
