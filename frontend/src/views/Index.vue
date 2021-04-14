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
import {paths} from '@/utils/Enums';
import {mapState} from 'vuex';
import ResultsOverview from '@/components/pages/index/ResultsOverview.vue';
export default {
  name: 'index',
  title: 'Home',
  path: paths.index,
  data: () => ({expanded: [], singleExpand: false}),
  components: {
    ResultsOverview,
  },
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
        {
          text: 'Updated at',
          align: 'start',
          value: 'updatedAt',
        },
        {text: '', value: 'data-table-expand'},
      ];
    },
    trials() {
      return this.$store.state.trials;
    },
  },
  async mounted() {
    await this.$store.dispatch('loadTrials');
  },
};
</script>
