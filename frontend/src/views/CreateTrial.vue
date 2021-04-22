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
              :persistent-hint="detectedLimit < limit"
              :hint="channelHintMessage"
              v-model="limit"
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
import {paths} from '@/utils/Enums';
import CreateTrial from '@/components/pages/create-trial/CreateTrial';
import {mapActions, mapMutations, mapState} from 'vuex';

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
    time() {
      return [
        {symbol: 's', timeUnit: 'seconds'},
        {symbol: 'ms', timeUnit: 'milliseconds'},
      ];
    },
    ...mapState('addTrial', ['name', 'timeUnit', 'channelLimit']),
    trial: {
      get() {
        return this.name;
      },
      set(name) {
        this.updateName(name);
      },
    },
    detectedLimit() {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      return audioCtx.destination.maxChannelCount;
    },
    channelHintMessage() {
      return `Browser detected a limit of ${this.detectedLimit}`;
    },
    limit: {
      get() {
        return this.channelLimit;
      },
      set(limit) {
        this.updateChannelLimit(limit);
      },
    },
    channels() {
      return Array.from(new Array(8), (val, index) => index + 1);
    },
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
