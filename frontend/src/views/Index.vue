<template>
  <v-data-table
    :headers="trialHeaders"
    :items="trials"
    single-expand
    :items-per-page="15"
    :expanded.sync="expanded"
    item-key="name"
    show-expand
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Trials</v-toolbar-title>
        <v-spacer />
        <v-btn :to="addTrial">
          New trial
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.index="{index}">{{ index + 1 }}</template>
    <template v-slot:expanded-item="{headers, item}">
      <td class="pa-1" :colspan="headers.length + 1">
        <v-card flat>
          <v-card-text>
            <v-row class="caption">
              <v-col>ID</v-col>
              <v-col>Timestamp</v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn small>
              Export data
              <v-icon>mdi-download</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn small>
              View Trial
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn small :to="`trial/${item._id}`">
              Start Trial
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </td>
    </template>
  </v-data-table>
</template>
<script>
import {paths} from '@/utils/Enums';
import {mapState} from 'vuex';
export default {
  name: 'index',
  title: 'Home',
  path: paths.index,
  data: () => ({expanded: [], singleExpand: false}),
  description: 'Overview page',
  computed: {
    ...mapState({
      addTrial: (state) => state.paths.addTrial,
    }),
    trialHeaders() {
      return [
        {text: 'Index', align: 'start', value: 'index', width: 100},
        {
          text: 'Name',
          align: 'start',
          value: 'name',
        },
        {
          text: 'Trial duration (in ms)',
          align: 'start',
          value: 'duration',
        },
        {
          text: 'Created at',
          align: 'start',
          value: 'createdAt',
        },
        {text: '', value: 'data-table-expand'},
      ];
    },
    trials() {
      return this.$store.state.trials;
    },
  },
  async created() {
    await this.$store.dispatch('loadTrials');
  },
};
</script>
