<template>
  <v-row align="baseline" justify="center">
    <v-col :cols="trialNumber">{{ `${index + 1}.` }}</v-col>
    <v-col :cols="image">
      <v-file-input
        v-model="file"
        label="Add image"
        prepend-icon="mdi-image"
        accept=".png, .jpeg, .jpg"
      />
    </v-col>
    <v-col :cols="timeRange">
      <range
        v-model="value.timeRange"
        @timerange-updated="$emit('timerange-change', value.timeRange)"
        label="Timerange"
        prepend-text="seconds"
      />
    </v-col>
    <v-col :cols="actions">
      <v-icon dense @click="$emit('add')">mdi-plus</v-icon>
      <v-icon
        dense
        :disabled="removable"
        class="ml-2"
        @click="
          file = null;
          $emit('remove');
        "
      >
        mdi-delete
      </v-icon>
      <v-icon class="ml-4" :disabled="includesAudio" @click="$emit('open')">
        {{ !includesAudio ? 'mdi-music-note-plus' : '' }}
      </v-icon>
    </v-col>
  </v-row>
</template>
<script>
import Range from '@/components/other/Range.vue';
import {mapState} from 'vuex';
/**
 * @description This is the trial-input row, used in the process of trial-creation.
 */
export default {
  name: 'input-row',
  description: 'Input row',
  data: () => ({file: null}),
  components: {
    Range,
  },
  props: {
    removable: {type: Boolean, default: true},
    includesAudio: {type: Boolean, default: true},
    index: Number,
    value: Object,
  },
  watch: {
    file(file) {
      this.value.imagePath = file?.name;
    },
  },
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
