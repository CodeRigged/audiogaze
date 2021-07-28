<template>
  <v-container fluid>
    <v-card>
      <results-overview :results="results" />
      <v-card-actions>
        <v-btn @click="loadResults" class="float-right" text>
          Load more...
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn class="float-right" to="/" plain>Return to overview</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import {mapActions} from 'vuex';
import {paths} from '@/config';
import ResultsOverview from '@/components/pages/trial-results/ResultsOverview.vue';
/**
 *  DEPRECATED/NOT USED => Move to /src/views if you are thinking about using this component
 *
 * @description The index page is an overview of all trials and their results, acquired from server.
 */
export default {
  name: 'trial-results',
  title: 'Results',
  path: paths.trialResults,
  data: () => ({results: []}),
  components: {
    ResultsOverview,
  },
  methods: {
    ...mapActions(['getTrialResults']),
    async loadResults(limit = 5) {
      this.results.push(
        ...(await this.getTrialResults({
          id: this.$route.params.id,
          skip: this.results.length,
          limit,
        })),
      );
    },
  },
  mounted() {
    this.loadResults();
  },
};
</script>
