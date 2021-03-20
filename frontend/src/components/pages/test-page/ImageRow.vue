<template>
  <v-row align="baseline" justify="center">
    <v-col :cols="trialNumber">{{ `${index}.` }}</v-col>
    <v-col :cols="image">
      <v-file-input
        v-model="value.image"
        label="Add image"
        prepend-icon="mdi-image"
        accept=".png"
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
  data: () => ({isClosed: true}),
  components: {
    Range,
  },
  props: {
    removable: {type: Boolean, default: true},
    index: Number,
    value: Object,
  },
  watch: {
    'value.image'(file) {
      const reader = new FileReader();
      var res = null;
      reader.addEventListener('load', (e) => (res = e.target.result));
      reader.readAsDataURL(file);

      console.log(res);
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
