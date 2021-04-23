<template>
  <v-container fluid>
    <v-card class="pa-2">
      <v-card-title>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="trial" label="Trial name" clearable />
          </v-col>
          <v-col>
            <v-select
              v-model="precision"
              :items="time"
              label="Timerange precision"
              item-text="timeUnit"
              item-value="symbol"
            />
          </v-col>
          <v-col>
            <v-select
              v-model="limit"
              :error-messages="channelErrorMessage"
              :items="channels"
              label="Channel limit"
            />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <create-trial />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn @click="resetTrial" plain>Cancel</v-btn>
        <v-btn @click="addTrial">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import {paths} from '@/config';
import CreateTrial from '@/components/pages/create-trial/CreateTrial';
import {mapActions, mapMutations, mapState} from 'vuex';
/**
 * @description The create-trial page is the page, where trials are created.
 */
export default {
  components: {
    CreateTrial,
  },
  name: 'new-test',
  title: 'New trial',
  path: paths.addTrial,
  methods: {
    ...mapMutations('addTrial', [
      'updateName',
      'updateTimeUnit',
      'updateChannelLimit',
    ]),
    ...mapActions('addTrial', ['addTrial', 'resetTrial']),
  },
  computed: {
    ...mapState('addTrial', ['name', 'timeUnit', 'channelLimit']),
    // maximum allowed channels is 8
    channels() {
      return Array.from(new Array(8), (val, index) => index + 1);
    },
    // message displayed if limit exceed dected limit
    channelErrorMessage() {
      return this.detectedLimit < this.limit
        ? `Browser detected a limit of ${this.detectedLimit} channels for current device`
        : '';
    },
    // check how many channels can be accessed from current browser / audio-device
    detectedLimit() {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      return audioCtx.destination.maxChannelCount;
    },
    // options of time-precision
    time() {
      return [
        {symbol: 's', timeUnit: 'seconds'},
        {symbol: 'ms', timeUnit: 'milliseconds'},
      ];
    },
    // getter and setter for trial-channelLimit (vuex-store)
    limit: {
      get() {
        return this.channelLimit;
      },
      set(limit) {
        this.updateChannelLimit(limit);
      },
    },
    // getter and setter for trial-name (vuex-store)
    trial: {
      get() {
        return this.name;
      },
      set(name) {
        this.updateName(name);
      },
    },
    // getter and setter for trial-timeUnit (vuex-store)
    precision: {
      get() {
        return this.timeUnit;
      },
      set(timeUnit) {
        this.updateTimeUnit(timeUnit);
      },
    },
  },
};
</script>
