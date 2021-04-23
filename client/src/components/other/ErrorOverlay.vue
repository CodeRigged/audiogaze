<template>
  <v-overlay v-if="errorOverlayVisbility" opacity="0.5">
    <v-card width="500" class="pa-2" light>
      <v-card-title>
        Something went wrong!
        <v-spacer />
        <v-icon color="black" @click="setError">
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text>{{ errorOverlayMessage }}</v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn @click="setError" plain small>Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
/**
 * @description This is the overlay which appears when an api call returns an error.
 */
export default {
  name: 'error-overlay',
  methods: {...mapActions('appState', ['setError'])},
  computed: {
    ...mapGetters('appState', ['errorOverlayVisbility', 'errorOverlayMessage']),
  },
};
</script>
