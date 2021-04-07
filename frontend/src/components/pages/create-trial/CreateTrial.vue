<template>
  <v-container>
    <image-headers />
    <div
      :key="`Track-${trackIndex}`"
      v-for="(track, trackIndex) in tracksArray"
      class="mb-5"
    >
      <image-row
        v-model="tracksArray[trackIndex]"
        :index="trackIndex"
        @add="addTrack(track)"
        @open="switchViewOfAudioRow(trackIndex, track.audios.length === 0)"
        @remove="removeTrack(trackIndex)"
        @timerange-change="
          (timeRange) => updateTimeRanges({trackIndex, timeRange})
        "
        :includesAudio="track.audios.length > 0"
        :removable="tracksArray.length === 1"
      />

      <div v-if="track.audios.length > 0">
        <audio-row
          class="background"
          :key="`Audio-${audioIndex}`"
          v-for="(audio, audioIndex) in track.audios"
          v-model="track.audios[audioIndex]"
          :index="audioIndex"
          @add="addAudio(trackIndex, audio)"
          @remove="removeAudio({trackIndex, audioIndex})"
        />
      </div>
    </div>
  </v-container>
</template>
<script>
import {/* mapActions, */ mapMutations, mapState} from 'vuex';
import AudioRow from './AudioRow.vue';
import ImageHeaders from './ImageHeaders.vue';
import ImageRow from './ImageRow.vue';

export default {
  name: 'create-trial-page',
  description: 'description',
  mixins: [],
  data: () => ({showAudiosIndex: null}),
  components: {
    ImageRow,
    ImageHeaders,
    AudioRow,
  },
  props: {},
  watch: {
    tracksArray: {
      handler(tracks) {
        this.updateTracks(tracks);
      },
      deep: true,
    },
  },
  methods: {
    switchViewOfAudioRow(trackIndex, addAudio) {
      if (addAudio) {
        this.addAudio(trackIndex);
      }
      if (
        this.showAudiosIndex !== null &&
        trackIndex === this.showAudiosIndex
      ) {
        this.showAudiosIndex = null;
      } else {
        this.showAudiosIndex = trackIndex;
      }
    },
    ...mapMutations('addTrial', [
      'addTrack',
      'updateTracks',
      'removeTrack',
      'addAudio',
      'removeAudio',
      'updateTimeRanges',
    ]),
  },
  computed: {
    ...mapState('addTrial', ['tracks']),
    tracksArray: {
      get() {
        return this.tracks;
      },
      set(tracks) {
        this.updateTracks(tracks);
      },
    },
  },
  mounted() {},
};
</script>
