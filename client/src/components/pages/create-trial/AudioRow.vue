<template>
  <v-row class="pl-3" align="baseline" justify="center">
    <v-divider vertical />
    <v-col class="text-center caption" :cols="audioNumber"
      >{{ `Audio ${index + 1}` }}
    </v-col>
    <v-col :cols="track">
      <v-file-input
        v-model="file"
        label="Track"
        prepend-icon="mdi-image"
        accept=".mp3, .wav"
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
      <v-icon
        dense
        class="ml-2"
        @click="
          file = null;
          $emit('remove');
        "
      >
        mdi-trash-can
      </v-icon>
    </v-col>
  </v-row>
</template>
<script>
import {mapState} from 'vuex';
import Range from '@/components/other/Range.vue';
/**
 * @description This is the audio-input row, used in the process of trial-creation.
 */
export default {
  name: 'audio-row',
  description: 'Input row',
  components: {
    Range,
  },
  data: () => ({file: null}),
  props: {
    index: Number,
    value: Object,
  },
  watch: {
    file(track) {
      this.value.audioPath = track?.name;
    },
  },
  computed: {
    ...mapState({
      channelLimit: (state) => state.addTrial.channelLimit,
      audioNumber: (state) => state.colsWidth.audio.number,
      track: (state) => state.colsWidth.audio.track,
      timeRange: (state) => state.colsWidth.audio.timeRange,
      channel: (state) => state.colsWidth.audio.channel,
      actions: (state) => state.colsWidth.audio.actions,
    }),
    channelTypes() {
      return Array.from(new Array(this.channelLimit), (val, index) => ({
        id: index,
        text: `Channel ${index}`,
      }));
    },
  },
};
</script>
