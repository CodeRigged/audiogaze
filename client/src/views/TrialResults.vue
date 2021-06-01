<template>
  <v-container fluid>
    <results-overview :results="results" />
  </v-container>
</template>
<script>
import {mapActions} from 'vuex';
import {paths} from '@/config';
import ResultsOverview from '@/components/pages/trial-results/ResultsOverview.vue';
/**
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
    async loadResults() {
      this.results = await this.getTrialResults(this.$route.params.id);
    },
  },
  mounted() {
    this.loadResults();
  },
};
</script>
