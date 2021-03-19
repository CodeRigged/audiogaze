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
    <v-col cols="3">
      <v-combobox
        v-model="value.channel"
        multiple
        label="Channel"
        :items="channelTypes"
      />
    </v-col>
    <v-col cols="2">
      <v-icon class="ml-2" @click="$emit('add')">mdi-plus</v-icon>
      <v-icon :disabled="removable" class="ml-2" @click="$emit('remove')">
        mdi-delete
      </v-icon>
    </v-col>
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
      return Array.from(new Array(8), (val, index) => `Channel ${index + 1}`);
    },
  },
  mounted() {},
};
</script>
