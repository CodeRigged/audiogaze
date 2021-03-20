<template>
  <v-row align="baseline" justify="center">
    <v-col :cols="audioNumber">{{ `${index}` }}</v-col>
    <v-col :cols="track">
      <v-file-input
        v-model="value.audioPath"
        label="Track"
        prepend-icon="mdi-image"
        accept=".mp3"
      />
    </v-col>
    <v-col :cols="timeRange">
      <range
        v-model="value.timeRange"
        label="Timerange"
        prepend-text="seconds"
      />
    </v-col>
    <v-col :cols="channel">
      <v-combobox
        v-model="value.channels"
        multiple
        label="Channel"
        :items="channelTypes"
      />
    </v-col>
    <v-col :cols="actions">
      <v-icon dense @click="$emit('add')">mdi-plus</v-icon>
      <v-icon dense :disabled="removable" class="ml-2" @click="$emit('remove')">
        mdi-delete
      </v-icon>
    </v-col>
  </v-row>
</template>
<script>
import {mapState} from 'vuex';
import Range from '@/components/other/Range.vue';
export default {
  name: 'audio-row',
  description: 'Input row',
  components: {
    Range,
  },
  props: {
    removable: {type: Boolean, default: true},
    index: String,
    value: Object,
  },
  watch: {},
  methods: {},
  computed: {
    ...mapState({
      audioNumber: (state) => state.colsWidth.audio.number,
      track: (state) => state.colsWidth.audio.track,
      timeRange: (state) => state.colsWidth.audio.timeRange,
      channel: (state) => state.colsWidth.audio.channel,
      actions: (state) => state.colsWidth.audio.actions,
    }),
    channelTypes() {
      return Array.from(new Array(8), (val, index) => `Channel ${index + 1}`);
    },
  },
  mounted() {},
};
</script>
