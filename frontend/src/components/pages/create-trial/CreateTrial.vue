<template>
  <v-container>
    <image-headers />
    <div
      :key="`Track-${trackIndex}`"
      v-for="(track, trackIndex) in tracksArray"
    >
      <image-row
        v-model="tracksArray[trackIndex]"
        :index="trackIndex + 1"
        @add="addTrack(track)"
        @remove="removeTrack(trackIndex)"
        @open="switchViewOfAudioRow(trackIndex)"
        :removable="tracksArray.length === 1"
      />
      <div v-if="showAudiosIndex === trackIndex" class="background">
        <audio-row
          :key="`Audio-${audioIndex}`"
          v-for="(audio, audioIndex) in tracksArray[trackIndex].audios"
          v-model="tracksArray[trackIndex].audios[audioIndex]"
          :index="`${trackIndex + 1}.${audioIndex + 1}`"
          @add="addAudio({trackIndex, audio})"
          @remove="removeAudio({trackIndex, audioIndex})"
          :removable="tracksArray[trackIndex].audios.length === 1"
        />
      </div>
    </div>
  </v-container>
</template>
<script>
import {mapActions, mapMutations, mapState} from 'vuex';
import AudioRow from './AudioRow.vue';
import ImageHeaders from './ImageHeaders.vue';
import ImageRow from './ImageRow.vue';
// import InputRow from './InputRow.vue';

export default {
  name: 'create-trial-page',
  description: 'description',
  mixins: [],
  data: () => ({showAudiosIndex: null}),
  components: {
    // InputRow,
    ImageRow,
    ImageHeaders,
    AudioRow,
  },
  props: {},
  watch: {},
  methods: {
    switchViewOfAudioRow(trackIndex) {
      if (
        this.showAudiosIndex !== null &&
        trackIndex === this.showAudiosIndex
      ) {
        this.showAudiosIndex = null;
      } else {
        this.showAudiosIndex = trackIndex;
      }
    },
    ...mapMutations('addTrial', ['updateTracks']),
    ...mapActions('addTrial', [
      'addTrack',
      'removeTrack',
      'addAudio',
      'removeAudio',
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
