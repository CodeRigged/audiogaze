<template>
  <v-row align="baseline">
    <v-col cols="1">{{ `${index}.` }}</v-col>
    <v-col>
      <v-file-input
        v-model="value.file"
        label="Add audio file"
        prepend-icon="mdi-music"
      />
    </v-col>
    <v-col>
      <range v-model="value.range" label="Timerange" prepend-text="seconds" />
    </v-col>
    <v-col>
      <v-combobox
        v-model="value.channel"
        multiple
        label="Channel"
        :items="channelTypes"
      />
    </v-col>
    <v-col cols="1"> </v-col>
  </v-row>
</template>
<script>
import Range from '@/components/other/Range.vue';
export default {
  name: 'input-row',
  description: 'Input row',
  components: {
    Range,
  },
  props: {
    removable: {type: Boolean, default: true},
    index: Number,
    value: Object,
  },
  watch: {},
  methods: {},
  computed: {
    channelTypes() {
      return [
        'Left (0)',
        'Right (1)',
        'Center (2)',
        'Subwoofer (3)',
        'Surround Left (4)',
        'Surround Right (5)',
      ];
    },
  },
  mounted() {},
};
</script>