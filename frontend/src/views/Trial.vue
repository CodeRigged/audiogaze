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
        <v-btn text @click="retake">Retake</v-btn>
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
    currentStartTime: 0,
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
    ...mapActions(['toggleFullScreen', 'connectEyetracker']),
    async retake() {
      const status = await this.connectEyetracker(this.$route.params.id);
      if (status === 200) {
        this.runTrials();
      } else {
        console.log('No connection to eyetracker possible');
      }
    },
    // async play() {
    // TODO

    //   const audioElement = new Audio(
    //     require(process.env.VUE_APP_PATH_TO_AUDIO_FOLDER +
    //       `One Down Dog - Wes Hutchinson.mp3`),
    //   );

    //   const audioCtx = new AudioContext();

    //   const audioSrc = audioCtx.createMediaElementSource(audioElement);

    //   const volumeNodeL = new GainNode(audioCtx);
    //   const volumeNodeR = new GainNode(audioCtx);

    //   volumeNodeL.gain.value = 0;
    //   volumeNodeR.gain.value = 2;

    //   const splitterNode = audioCtx.createChannelSplitter(2);
    //   const mergerNode = audioCtx.createChannelMerger(2);

    //   audioSrc.connect(splitterNode);

    //   splitterNode.connect(volumeNodeL, 0);
    //   splitterNode.connect(volumeNodeR, 1);

    //   volumeNodeL.connect(mergerNode, 0, 0); // connect INPUT channel 0
    //   volumeNodeR.connect(mergerNode, 0, 1); // connect INPUT channel 1

    //   mergerNode.connect(audioCtx.destination);

    //   audioElement.play();
    // },
    runTrials() {
      this.trialStarted = true;
      this.trialEnded = false;
      this.toggleFullScreen();
      this.nextTrial();
    },
    nextTrial() {
      const ttlTrial = this.trials.length;
      const {startAt, stopAt, src, audios, imagePath} = this.trials[
        this.currentTrial++
      ];
      this.currentStartTime = startAt;
      const interval = stopAt - startAt;
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
          console.log(this.data);
          const results = await this.$store.dispatch('sendResults', {
            id: this.$route.params.id,
            clientData: this.data,
          });

          console.log(this.data, results);

          this.data = [];
          this.toggleFullScreen();
        }, interval);
      }
    },
    runAudio() {
      const ttlAudios = this.audios.length;
      const {startAt, stopAt, audio, src /* channels */} = this.audios[
        this.currentAudio++
      ];
      setTimeout(() => {
        audio.play();
        console.log(`At ${new Date()}: ${src} has started playing`);
        this.data.push({
          type: 'audio',
          src,
          timestamp: Date.now(),
          started: true,
        });
      }, startAt - this.currentStartTime);
      setTimeout(() => {
        console.log(`At ${new Date()}: ${src} has stopped playing`);
        this.data.push({
          type: 'audio',
          src,
          timestamp: Date.now(),
          started: false,
        });
        audio.pause();
        if (this.currentAudio < ttlAudios) {
          this.runAudio();
        } else {
          this.currentAudio = 0;
        }
      }, startAt - this.currentStartTime + stopAt - startAt);
    },
    mapTrack(tracks) {
      return tracks.map(({imagePath, timeRange, audios}) => {
        const track = {};
        track.startAt = timeRange.from;
        track.stopAt = timeRange.to;
        track.imagePath = imagePath;
        track.src = require(process.env.VUE_APP_PATH_TO_IMAGES_FOLDER +
          imagePath);
        if (audios.length > 0) {
          track.audios = audios.map(({timeRange, audioPath, channels}) => {
            const audio = {};
            audio.startAt = timeRange.from;
            audio.stopAt = timeRange.to;
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
    const status = await this.connectEyetracker(this.$route.params.id);
    if (status === 200) {
      const trial = await this.$store.dispatch(
        'getTrial',
        this.$route.params.id,
      );
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
