<template>
  <v-overlay v-if="showErrorOverlay" opacity="0.5">
    <v-card width="500" class="pa-2" light>
      <v-card-title>
        Something went wrong!
        <v-spacer />
        <v-icon color="black" @click="setErrorVisibility">
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text>{{ errorMessage }}</v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn @click="setErrorVisibility" plain small>Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
<script>
import {mapActions, mapState} from 'vuex';
export default {
  name: 'error-overlay',
  description:
    'This is the overlay which appears when an api call returns an error.',
  methods: {...mapActions('appState', ['setErrorVisibility'])},
  computed: {
    ...mapState('appState', ['showErrorOverlay', 'errorMessage']),
  },
};
</script>
