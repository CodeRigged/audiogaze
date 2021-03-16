<template>
  <v-overlay opacity="0.5">
    <v-card width="750" class="pa-2" light>
      <v-card-title>
        <v-spacer />
        <app-button
          color="black"
          @button-pressed="setErrorVisibility(false)"
          icon
          svg="close"
        />
      </v-card-title>
      <v-card-text class="title error--text">{{}}</v-card-text>
    </v-card>
  </v-overlay>
</template>
<script>
export default {
  name: 'error-overlay',
  description:
    'This is the overlay which appears when an api call returns an error.',
};
</script>
