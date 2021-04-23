<template>
  <v-container fluid>
    <v-data-table
      :headers="trialHeaders"
      :items="trials"
      :items-per-page="15"
      :expanded.sync="expanded"
      item-key="_id"
      single-expand
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
              <results-overview :results="item.results" />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn disabled small>
                Export all results
                <v-icon>mdi-download</v-icon>
              </v-btn>
              <v-spacer />
              <v-btn :to="`preview/trial/${item._id}`" small>
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
  </v-container>
</template>
<script>
import {paths} from '@/config';
import {mapState} from 'vuex';
import ResultsOverview from '@/components/pages/index/ResultsOverview.vue';
/**
 * @description The index page is an overview of all trials and their results, acquired from server.
 */
export default {
  name: 'index',
  title: 'Home',
  path: paths.index,
  data: () => ({expanded: []}),
  components: {
    ResultsOverview,
  },
  computed: {
    ...mapState({
      addTrial: (state) => state.paths.addTrial,
    }),
    /**
     * @description Headers of trials table
     */
    trialHeaders() {
      return [
        {text: 'Index', value: 'index', width: 100},
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Trial duration (in ms)',
          value: 'duration',
        },
        {
          text: 'Channel Limit',
          value: 'channelLimit',
        },
        {
          text: 'Created at',
          value: 'createdAt',
        },
        {
          text: 'Updated at',
          value: 'updatedAt',
        },
        {text: 'Results', align: 'end', value: 'data-table-expand'},
      ];
    },
    /**
     * Trials found in store
     */
    trials() {
      return this.$store.state.trials;
    },
  },
  async mounted() {
    // load trials (saved in store)
    await this.$store.dispatch('loadTrials');
  },
};
</script>
