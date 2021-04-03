<template>
  <div class="fillHeight">
    <img
      class="fullscreen"
      v-if="trialStarted && !trialEnded"
      :src="imgSrc"
      alt="No image found."
    />
    <absolute-center v-else-if="trialEnded">
      Thanks for taking part of the trial
    </absolute-center>
    <absolute-center v-else>
      <v-btn @click="runTrials">Start Trial</v-btn>
    </absolute-center>
  </div>
</template>
<script>
import {paths} from '@/utils/Enums';
import {mapActions, mapState} from 'vuex';
import AbsoluteCenter from '@/components/other/AbsoluteCenter.vue';
export default {
  components: {AbsoluteCenter},
  name: 'trial',
  title: 'Trial',
  path: paths.runTrial,
  data: () => ({
    trials: null,
    currentTrial: 0,
    imgSrc: null,
    audioSrc: null,
    trialStarted: false,
    trialEnded: false,
  }),
  computed: {
    ...mapState(['isFullScreen', 'activeTrial']),
    test() {
      return {
        results: [],
        _id: '6067003d322a3c319445e457',
        name: 'TrialName',
        duration: 2000,
        tracks: [
          {
            _id: '6067003d322a3c319445e458',
            number: 0,
            imagePath: 'Anno1800_Wallpaper_1920_1080_Forest.jpg',
            timeRange: {_id: '6067003d322a3c319445e459', from: 0, to: 7500},
            audios: [
              {
                channels: [6, 5],
                _id: '6067003d322a3c319445e45a',
                audioPath: 'One Down Dog - Wes Hutchinson.mp3',
                timeRange: {_id: '6067003d322a3c319445e45b', from: 0, to: 5000},
                number: 0,
              },
            ],
          },
          {
            _id: '6067003d322a3c319445e45c',
            number: 1,
            imagePath: 'background-test.jpg',
            timeRange: {_id: '6067003d322a3c319445e45d', from: 7500, to: 15000},
            audios: [
              {
                channels: [6, 5],
                _id: '6067003d322a3c319445e45a',
                audioPath: 'Younger Hunger - Second Best.mp3',
                timeRange: {
                  _id: '6067003d322a3c319445e45b',
                  from: 9000,
                  to: 10000,
                },
                number: 0,
              },
            ],
          },
        ],
        createdAt: '2021-04-02T11:30:05.280Z',
        updatedAt: '2021-04-02T11:30:05.280Z',
        __v: 0,
      };
    },
  },
  methods: {
    ...mapActions(['toggleFullScreen']),
    runTrials() {
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
        this.runAudio(audios);
      }
      if (this.currentTrial < ttlTrial) {
        setTimeout(this.nextTrial, interval);
      } else {
        setTimeout(() => {
          this.trialEnded = true;
          this.toggleFullScreen();
          console.log('Trial has ended');
        }, interval);
      }
    },
    runAudio(audios) {
      const ttlAudios = audios.length;
      var currentAudio = 0;
      const {interval, audio, src /* channels */} = audios[currentAudio++];

      audio.play();

      if (this.currentTrial < ttlAudios) {
        setTimeout(this.nextTrial, interval);
      } else {
        setTimeout(() => {
          audio.pause();
          console.log(`${src} has stopped playing`);
        }, interval);
      }
    },
  },
  beforeMount() {
    const {tracks} = this.activeTrial;
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
