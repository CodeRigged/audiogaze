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
    'value.timeRange': {
      handler(timeRange) {
        this.$emit('timerange-change', timeRange);
      },
      deep: true,
    },
    file(file) {
      this.value.imagePath = file?.name;
    },
  },
  methods: {},
  computed: {
    ...mapState({
      trialNumber: (state) => state.colsWidth.trial.number,
      image: (state) => state.colsWidth.trial.image,
      timeRange: (state) => state.colsWidth.trial.timeRange,
      actions: (state) => state.colsWidth.trial.actions,
    }),
  },
  mounted() {},
};
</script>
