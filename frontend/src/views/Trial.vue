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
    currentTrial: 0,
    imgSrc: null,
    audios: [],
    currentAudio: 0,
    audioSrc: null,
    trialStarted: false,
    trialEnded: false,
    data: [],
  }),
  computed: {
    ...mapState(['isFullScreen']),
  },
  methods: {
    ...mapActions(['toggleFullScreen']),
    runTrials() {
      this.trialStarted = true;
      this.trialEnded = false;
      this.toggleFullScreen();
      this.nextTrial();
    },
    nextTrial() {
      const ttlTrial = this.trials.length;
      const {interval, src, audios, imagePath} = this.trials[
        this.currentTrial++
      ];

      this.imgSrc = src;

      this.data.push({
        type: 'img',
        src: imagePath,
        timestamp: Date.now(),
        started: true,
      });

      console.log(`Displaying ${imagePath} at ${new Date()}.`);

      setTimeout(() => {
        this.data.push({
          type: 'img',
          src: imagePath,
          timestamp: Date.now(),
          started: false,
        });
      }, interval);

      if (audios) {
        this.audios = audios;
        this.runAudio();
      }

      if (this.currentTrial < ttlTrial && !this.trialEnded) {
        setTimeout(this.nextTrial, interval);
      } else {
        setTimeout(async () => {
          this.trialEnded = true;
          this.currentTrial = 0;

          this.trials.forEach(({audios}) => {
            if (audios) {
              audios.forEach(({audio}) => {
                audio.currentTime = 0;
              });
            }
          });

          const results = await this.$store.dispatch('sendResults', {
            id: this.$route.params.id,
            clientData: this.data,
          });

          console.log(results);

          this.data = [];
          this.toggleFullScreen();
        }, interval);
      }
    },
    runAudio() {
      const ttlAudios = this.audios.length;
      const {interval, audio, src /* channels */} = this.audios[
        this.currentAudio++
      ];
      console.log(`At ${new Date()}: ${src} has started playing`);
      this.data.push({
        type: 'audio',
        src,
        timestamp: Date.now(),
        started: true,
      });

      setTimeout(() => {
        this.data.push({
          type: 'audio',
          src,
          timestamp: Date.now(),
          started: false,
        });
      }, interval);

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
    mapTrack(tracks) {
      return tracks.map(({imagePath, timeRange, audios}) => {
        const track = {};
        track.interval = timeRange.to - timeRange.from;
        track.imagePath = imagePath;
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
  },
  async mounted() {
    const status = await this.$store.dispatch(
      'connectEyetracker',
      this.$route.params.id,
    );
    if (status === 200) {
      const trial = await this.$store.dispatch(
        'getTrial',
        this.$route.params.id,
      );
      console.log(trial);
      const {tracks} = trial;
      this.trials = this.mapTrack(tracks);
    }
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
