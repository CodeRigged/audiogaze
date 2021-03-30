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
      <v-icon dense :disabled="removable" class="ml-2" @click="$emit('remove')">
        mdi-delete
      </v-icon>
      <v-icon
        class="ml-4"
        @click="
          $emit('open');
          isClosed = !isClosed;
        "
      >
        {{ isClosed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
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
  data: () => ({file: null, isClosed: true}),
  components: {
    Range,
  },
  props: {
    removable: {type: Boolean, default: true},
    index: Number,
    value: Object,
  },
  watch: {
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
