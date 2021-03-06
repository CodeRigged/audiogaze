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
        <v-btn small to="/" plain>Return to overview</v-btn>
        <v-spacer />
        <v-btn small text @click="takeTrial">Retake</v-btn>
        <download-menu :file-name="fileName" :itemToDownload="results" />
      </v-card-actions>
    </v-card>
    <div class="absolute-center" v-else-if="!trialStarted">
      <participant-information v-model="participant" @start-trial="takeTrial" />
    </div>
  </div>
</template>
<script>
import {paths} from '@/config';
import {mapActions, mapState} from 'vuex';
import ParticipantInformation from '../components/pages/trial/ParticipantInformation.vue';
import DownloadMenu from '../components/other/DownloadMenu.vue';
/**
 * @description The trial page is the page, where trials are taken and processed.
 */
export default {
  name: 'trial',
  title: 'Trial',
  path: paths.runTrial,
  components: {ParticipantInformation, DownloadMenu},
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
    // participants information (e.G. 'participant-1' or 'Max Müller')
    participant: {
      name: null,
      age: null,
      gender: null,
      handedness: null,
      comment: null,
    },
    results: [],
  }),
  computed: {
    ...mapState('appState', ['isFullScreen']),
    fileName() {
      const {name, age, gender, handedness, comment} = this.participant;
      return `${name ? name : 'No name'}|${age ? age : 'No age'}|${
        gender ? gender : 'No gender'
      }|${handedness ? handedness : 'No handedness'}|${
        comment ? comment : 'No comment'
      }|`;
    },
  },
  methods: {
    ...mapActions('appState', ['toggleFullScreen']),
    ...mapActions(['connectEyetracker']),
    async takeTrial() {
      // attempt to connect to eyetracker
      const status = await this.connectEyetracker(this.$route.params.id);
      // if status is equals 200 (Ok), connection was successful or eyetracker is already connected
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

          this.results = await this.$store.dispatch('sendResults', {
            id: this.$route.params.id,
            participant: this.participant,
            clientData: this.data,
          });

          this.data = [];
          this.toggleFullScreen();
        }, interval + 500);
      }
    },
    /**
     * @description Method which defines the process of audio-playback
     */
    runAudio() {
      const ttlAudios = this.audios.length;
      /**
       * @type {{startAt:number, stopAt:number, audio:string, src:string, channels:Array}}
       */
      const {startAt, stopAt, audio, src, channels} = this.audios[
        this.currentAudio++
      ];

      var nextStart = 0;
      if (this.audios[this.currentAudio]) {
        nextStart += this.audios[this.currentAudio].startAt - stopAt;
      }

      // interval = how long audio is played
      const interval = stopAt - startAt;

      this.audio.setAttribute('src', audio);

      /**
       * Create audio context and set channel count to channel limitmm
       * @type {AudioContext}
       */
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.destination.channelCount = this.channelLimit;

      // create splitter node and connect it to audio-source
      const splitterNode = audioCtx.createChannelSplitter(this.channelLimit);
      // audio-source
      const audioSrc = audioCtx.createMediaElementSource(this.audio);
      audioSrc.connect(splitterNode);
      // create merger node
      const mergerNode = audioCtx.createChannelMerger(this.channelLimit);
      // loop through channelLimit
      for (let index = 0; index < this.channelLimit; index++) {
        // create new node for every channel
        const node = audioCtx.createGain();
        // connect node to splitterNode from output {index} to input channel 0
        splitterNode.connect(node, index, 0);
        // check if channel is included in the channels array, if it is connect it mergerNode to splitterNode
        channels.includes(index) && splitterNode.connect(mergerNode, 0, index);
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

      // pause current audio
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
        // stop audio and disconnect mergerNode (prevents channels from overlapping)
        this.audio.pause();
        this.audio = new Audio();
        mergerNode.disconnect(audioCtx.destination);
      }, interval);

      // start next audio
      setTimeout(() => {
        // as long as all audio-tracks haven't finished processing, continue with runAudio
        if (this.currentAudio < ttlAudios) {
          this.runAudio();
        } else {
          // reset to 0 for next trial
          this.currentAudio = 0;
        }
      }, interval + nextStart);
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
    // get trial corresponding the id in url-parameters
    const trial = await this.$store.dispatch('getTrial', this.$route.params.id);
    // if trial is found, set channelLimit and call mapTracks method
    if (trial) {
      const {channelLimit, tracks} = trial;
      this.channelLimit = channelLimit;
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
