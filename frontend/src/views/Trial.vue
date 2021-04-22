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
/**
 * @description The trial page is the page, where trials are taken and processed.
 */
export default {
  name: 'trial',
  title: 'Trial',
  path: paths.runTrial,
  data: () => ({
    // HTMLAudioElement which all audio-tracks run on
    audio: new Audio(),
    // default channel-limit is two (Stereo)
    channelLimit: 2,
    // trial-specific helper variables
    trials: [],
    currentTrial: 0,
    imgSrc: null,
    // audio-specific helper variables
    audios: [],
    currentAudio: 0,
    audioSrc: null,
    // helper-booleans
    trialStarted: false,
    trialEnded: false,
    // array which collects all data => sent to server at end of trial
    data: [],
  }),
  computed: {
    ...mapState('appState', ['isFullScreen']),
  },
  methods: {
    ...mapActions('appState', ['toggleFullScreen']),
    ...mapActions(['connectEyetracker']),
    async retake() {
      const status = await this.connectEyetracker(this.$route.params.id);
      if (status === 200) {
        this.runTrials();
      } else {
        console.log('No connection to eyetracker possible');
      }
    },
    /**
     * @description Method which is called when 'Start Trial'-button is clicked on
     */
    runTrials() {
      this.trialStarted = true;
      this.trialEnded = false;
      // call toggleFullScreen from vuex-store
      this.toggleFullScreen();
      // call nextTrial method => this is where all the magic happens
      this.nextTrial();
    },
    /**
     * @description Method which defines the process of one trial
     */
    nextTrial() {
      const ttlTrial = this.trials.length;
      /**
       * Deconstruct variables from trial at index {this.currentTrial}
       * @type {{startAt: number, stopAt: number, src: image-module, audios: Array, imagePath: string}}
       */
      const {startAt, stopAt, src, audios, imagePath} = this.trials[
        this.currentTrial++
      ];
      // interval = how long image is shown to user
      const interval = stopAt - startAt;
      this.imgSrc = src;
      // push sample with necessary data to data-array (sent to server at end of trial)
      this.data.push({
        type: 'img',
        src: imagePath,
        timestamp: Date.now(),
        started: true,
      });
      // log for client-feedback, check browser console
      console.log(`At ${new Date()}: ${imagePath} is beeing displayed.`);
      // setTimeout for when next data-sample is pushed to data-array (so server knows when image stopped displaying)
      setTimeout(() => {
        // log for client-feedback, check browser console
        console.log(`At ${new Date()}: ${imagePath} has stopped displaying`);
        this.data.push({
          type: 'img',
          src: imagePath,
          timestamp: Date.now(),
          started: false,
        });
      }, interval);
      // if current trial also includes audio-tracks, call the runAudio-method
      if (audios) {
        this.audios = audios;
        this.runAudio();
      }
      // as long as all trials haven't finished processing, continue with nextTrial
      if (this.currentTrial < ttlTrial && !this.trialEnded) {
        setTimeout(this.nextTrial, interval);
      } else {
        // once trials have finished, reset all data, toggle fullscreen to windowed-mode and send data to server
        setTimeout(async () => {
          this.trialEnded = true;
          this.currentTrial = 0;
          // remove src attribute from audio, so user doesn't accidently continue any unfinished audio-tracks
          this.audio.removeAttribute('src');

          await this.$store.dispatch('sendResults', {
            id: this.$route.params.id,
            clientData: this.data,
          });

          this.data = [];
          this.toggleFullScreen();
        }, interval);
      }
    },
    /**
     * @description Method which defines the process of audio-playback
     */
    runAudio() {
      const ttlAudios = this.audios.length;
      /**
       * @type {{audio: HTMLAudioElement, channels:Array}}
       */
      const {startAt, stopAt, audio, src, channels} = this.audios[
        this.currentAudio++
      ];
      // interval = how long audio is played
      const interval = stopAt - startAt;
      this.audio.setAttribute('src', audio);

      /**
       * Create audio context
       * @type {AudioContext}
       */
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // audio-source
      const audioSrc = audioCtx.createMediaElementSource(this.audio);

      // create splitter node and connect it to audio-source
      const splitterNode = audioCtx.createChannelSplitter(this.channelLimit);

      audioSrc.connect(splitterNode);

      // create merger node
      const mergerNode = audioCtx.createChannelMerger(this.channelLimit);

      // loop through channelLimit
      for (let index = 0; index < this.channelLimit; index++) {
        // create new node for every channel
        const node = new GainNode(audioCtx);
        // check if channel is included in the channels array, if not => set volume of node to 0 (user won't hear any sound from that channel)
        channels.includes(index)
          ? (node.gain.value = 2)
          : (node.gain.value = 0);

        splitterNode.connect(node, index); // connect node to output channel {index}
        node.connect(mergerNode, 0, index); // connect INPUT channel 0 with output channel {index}
      }
      // finally connect the audio context to its destination
      mergerNode.connect(audioCtx.destination);
      // play audio
      this.audio.play();
      // log for client-feedback, check browser console
      console.log(`At ${new Date()}: ${src} has started playing`);
      // push sample with necessary data to data-array
      this.data.push({
        type: 'audio',
        src,
        channels,
        timestamp: Date.now(),
        started: true,
      });

      setTimeout(() => {
        // log for client-feedback, check browser console
        console.log(`At ${new Date()}: ${src} has stopped playing`);
        // push sample with necessary data to data-array
        this.data.push({
          type: 'audio',
          src,
          timestamp: Date.now(),
          started: false,
        });
        // stop audio
        this.audio.pause();
        // as long as all audio-tracks haven't finished processing, continue with runAudio
        if (this.currentAudio < ttlAudios) {
          this.runAudio();
        } else {
          // reset to 0 for next trial
          this.currentAudio = 0;
        }
      }, interval);
    },
    /**
     * @description Method maps tracks array to required format for the trial to work.
     *
     * @param {{
     *  imagePath: string,
     *  timeRange: { from: number, to: number },
     *  audios: { audioPath: string, channels: { id: number }, timeRange: { from: number, to: number }}[]
     * }[]} tracks
     */
    mapTrack(tracks) {
      return tracks.map(({imagePath, timeRange, audios}) => {
        const track = {};
        track.startAt = timeRange.from;
        track.stopAt = timeRange.to;
        track.imagePath = imagePath;
        // loads image-module with path (/to/image/files/folder) set in .env file
        track.src = require(process.env.VUE_APP_PATH_TO_IMAGES_FOLDER +
          imagePath);
        if (audios.length > 0) {
          track.audios = audios.map(({timeRange, audioPath, channels}) => {
            const audio = {};
            audio.startAt = timeRange.from;
            audio.stopAt = timeRange.to;
            audio.src = audioPath;
            // loads audio-module with path (/to/audio/files/folder) set in .env file
            audio.audio = require(process.env.VUE_APP_PATH_TO_AUDIO_FOLDER +
              audioPath);
            audio.channels = channels;
            return audio;
          });
        }
        return track;
      });
    },
  },
  async mounted() {
    // attempt to connect to eyetracker
    const status = await this.connectEyetracker(this.$route.params.id);
    // if status is equals 200 (Ok), connection was successful or eyetracker is already connected
    if (status === 200) {
      // get trial corresponding the id in url-parameters
      const trial = await this.$store.dispatch(
        'getTrial',
        this.$route.params.id,
      );
      // if trial is found, set channelLimit and call mapTracks method
      if (trial) {
        const {channelLimit, tracks} = trial;
        this.channelLimit = channelLimit;
        this.trials = this.mapTrack(tracks);
      }
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
