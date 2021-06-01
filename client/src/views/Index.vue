<template>
  <v-container fluid>
    <v-data-table
      class="elevation-1"
      :headers="trialHeaders"
      :items="trials"
      :items-per-page="15"
      :expanded.sync="expanded"
      item-key="_id"
      single-expand
      show-expand
    >
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
      <template v-slot:item.data-table-expand="{item}">
        <v-menu offset-y>
          <template v-slot:activator="{on, attrs}">
            <v-icon v-bind="attrs" v-on="on">mdi-chevron-down</v-icon>
          </template>
          <v-list dense>
            <v-list-item :to="`trial/${item._id}`">
              <v-list-item-title>Start Trial</v-list-item-title>
              <v-list-item-action>
                <v-icon small>mdi-play</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item :to="`preview/trial/${item._id}`">
              <v-list-item-title>View Trial</v-list-item-title>
              <v-list-item-action>
                <v-icon small>mdi-eye</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-list-item :to="`results/trial/${item._id}`">
              <v-list-item-title>View Results</v-list-item-title>
              <v-list-item-action>
                <v-icon small>mdi-database-import-outline</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-divider />
            <delete-trial :trial-id="item._id" />
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import {paths} from '@/config';
import {mapState} from 'vuex';
import DeleteTrial from '../components/pages/index/DeleteTrial.vue';
/**
 * @description The index page is an overview of all trials and their results, acquired from server.
 */
export default {
  name: 'index',
  title: 'Home',
  path: paths.index,
  data: () => ({expanded: []}),
  components: {
    DeleteTrial,
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
        {text: 'Actions', align: 'end', value: 'data-table-expand'},
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
