<template>
  <div v-if="trials" class="fillHeight">
    <img
      class="fullscreen"
      v-if="trialStarted && isFullScreen && !trialEnded"
      :src="imgSrc"
      alt="No image found."
    />
    <v-card
      width="50vw"
      v-else-if="trialEnded && !isFullScreen"
      rounded
      class="absolute-center"
    >
      <v-card-title> Thanks for taking the trial!</v-card-title>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn to="/" plain>Return to overview</v-btn>
        <v-spacer />
        <v-btn text @click="runTrials">Retake</v-btn>
      </v-card-actions>
    </v-card>
    <div class="absolute-center" v-else-if="!trialStarted">
      <v-btn @click="runTrials">Start Trial</v-btn>
    </div>
  </div>
</template>
<script>
import {paths} from '@/utils/Enums';
import {mapActions, mapState} from 'vuex';
export default {
  name: 'trial',
  title: 'Trial',
  path: paths.runTrial,
  data: () => ({
    trials: [],
    audios: [],
    currentTrial: 0,
    currentAudio: 0,
    imgSrc: null,
    audioSrc: null,
    trialStarted: false,
    trialEnded: false,
  }),
  computed: {
    ...mapState(['isFullScreen', 'activeTrial']),
  },
  methods: {
    ...mapActions(['toggleFullScreen']),
    runTrials() {
      this.trialEnded = false;
      this.trialStarted = true;
      this.toggleFullScreen();
      this.nextTrial();
    },
    nextTrial() {
      const ttlTrial = this.trials.length;
      const {interval, src, audios} = this.trials[this.currentTrial++];
      this.imgSrc = src;
      console.log('Displaying: ' + this.imgSrc);
      if (audios) {
        this.audios = audios;
        this.runAudio();
      }
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          this.trialEnded = true;
        }
      });
      if (this.currentTrial < ttlTrial && !this.trialEnded) {
        setTimeout(this.nextTrial, interval);
      } else {
        setTimeout(() => {
          this.trialEnded = true;
          this.toggleFullScreen();
        }, interval);
      }
    },
    runAudio() {
      const ttlAudios = this.audios.length;
      const {interval, audio, src /* channels */} = this.audios[
        this.currentAudio++
      ];
      audio.play();

      setTimeout(() => {
        audio.pause();
        if (this.currentAudio < ttlAudios) {
          this.runAudio();
        } else {
          this.currentAudio = 0;
        }
        console.log(`At ${new Date()}: ${src} has stopped playing`);
      }, interval);
    },
  },
  async mounted() {
    await this.$store.dispatch('getTrial', this.$route.params.id);
    const {tracks} = this.activeTrial;
    console.log(tracks);
    this.trials = tracks.map(({imagePath, timeRange, audios}) => {
      const track = {};
      track.interval = timeRange.to - timeRange.from;
      track.src = require(process.env.VUE_APP_PATH_TO_IMAGES_FOLDER +
        imagePath);
      if (audios.length > 0) {
        track.audios = audios.map(({timeRange, audioPath, channels}) => {
          const audio = {};
          audio.interval = timeRange.to - timeRange.from;
          audio.src = audioPath;
          audio.audio = new Audio(
            require(process.env.VUE_APP_PATH_TO_AUDIO_FOLDER + audioPath),
          );

          audio.channels = channels;
          return audio;
        });
      }
      return track;
    });
  },
};
</script>
<style lang="scss" scoped>
.fullscreen {
  height: 100%;
  width: 100%;
  display: block;
}
.fillHeight {
  height: 100%;
}
</style>
