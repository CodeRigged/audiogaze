<template>
  <v-row class="caption">
    <v-col :cols="trialNumber">Trial number</v-col>
    <v-col :cols="image">Image</v-col>
    <v-col :cols="timeRange">Timerange</v-col>
    <v-col :cols="actions">Actions</v-col>
  </v-row>
</template>

<script>
import {mapState} from 'vuex';
/**
 * @description Headers of trial-creation process.
 */
export default {
  name: 'image-headers',
  computed: {
    ...mapState({
      trialNumber: (state) => state.colsWidth.trial.number,
      image: (state) => state.colsWidth.trial.image,
      timeRange: (state) => state.colsWidth.trial.timeRange,
      actions: (state) => state.colsWidth.trial.actions,
    }),
  },
};
</script>
