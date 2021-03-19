<template>
  <v-data-table
    :headers="trialHeaders"
    :items="trials"
    single-expand
    :expanded.sync="expanded"
    item-key="name"
    show-expand
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Trials</v-toolbar-title>
        <v-spacer />
        <v-btn :to="path">New trial</v-btn>
      </v-toolbar>
    </template>
    <template v-slot:expanded-item="{headers, item}">
      <td :colspan="headers.length">More info about {{ item.name }}</td>
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
    ...mapState({path: (state) => state.paths.addTrial}),
    trialHeaders() {
      return [
        {
          text: 'Name',
          align: 'start',
          value: 'name',
        },
        {text: '', value: 'data-table-expand'},
      ];
    },
    trials() {
      return this.$store.state.trials;
    },
  },
  created() {
    this.$store.dispatch('loadTrials');
  },
};
</script>
