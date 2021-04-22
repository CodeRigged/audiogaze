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
        :includesAudio="track.audios.length > 0"
        :removable="tracksArray.length === 1"
        @add="addTrack"
        @open="switchViewOfAudioRow(trackIndex, track.audios.length === 0)"
        @remove="removeTrack(trackIndex)"
        @timerange-change="
          (timeRange) =>
            updateTimeRanges({trackIndex, updateAudio: false, timeRange})
        "
      />

      <div v-if="track.audios.length > 0">
        <audio-row
          v-for="(audio, audioIndex) in track.audios"
          v-model="track.audios[audioIndex]"
          :index="audioIndex"
          :key="`Audio-${audioIndex}`"
          class="background"
          @add="addAudio(trackIndex, audio)"
          @remove="removeAudio({trackIndex, audioIndex})"
          @timerange-change="
            (timeRange) =>
              updateTimeRanges({
                audioIndex,
                trackIndex,
                timeRange,
                updateAudio: true,
              })
          "
        />
      </div>
    </div>
  </v-container>
</template>
<script>
import {mapMutations, mapState} from 'vuex';
import AudioRow from './AudioRow.vue';
import ImageHeaders from './ImageHeaders.vue';
import ImageRow from './ImageRow.vue';
/**
 * @description This is the main component of the trial-creation process.
 *
 * It includes the audio- and image-row (including the headers)
 */
export default {
  name: 'create-trial-page',
  description: 'description',
  data: () => ({showAudiosIndex: null}),
  components: {
    ImageRow,
    ImageHeaders,
    AudioRow,
  },
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
};
</script>
