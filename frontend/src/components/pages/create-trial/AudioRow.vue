<template>
  <v-row class="pl-3" align="baseline" justify="center">
    <v-col class="text-center caption" :cols="audioNumber">{{
      `Audio ${index + 1}`
    }}</v-col>
    <v-col :cols="track">
      <v-file-input
        v-model="file"
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
        item-value="id"
        item-text="text"
      />
    </v-col>
    <v-col :cols="actions">
      <v-icon dense @click="$emit('add')">mdi-music-note-plus</v-icon>
      <v-icon dense :disabled="removable" class="ml-2" @click="$emit('remove')">
        mdi-trash-can
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
  data: () => ({file: null}),
  props: {
    removable: {type: Boolean, default: true},
    index: Number,
    value: Object,
  },
  watch: {
    file(track) {
      this.value.audioPath = track?.name;
    },
  },
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
      return Array.from(new Array(8), (val, index) => ({
        id: index + 1,
        text: `Channel ${index + 1}`,
      }));
    },
  },
  mounted() {},
};
</script>
