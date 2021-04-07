<template>
  <v-container fluid>
    <v-card class="pa-2">
      <v-card-title>
        <v-row>
          <v-col cols="8">
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
    ...mapMutations('addTrial', ['updateName', 'updateTimeUnit']),
    ...mapActions('addTrial', ['addTrial', 'resetTrial']),
  },
  computed: {
    time() {
      return [
        {symbol: 's', timeUnit: 'seconds'},
        {symbol: 'ms', timeUnit: 'milliseconds'},
      ];
    },
    ...mapState('addTrial', ['name', 'timeUnit']),
    trial: {
      get() {
        return this.name;
      },
      set(name) {
        this.updateName(name);
      },
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
