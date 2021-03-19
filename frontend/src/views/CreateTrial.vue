<template>
  <v-card class="pa-2">
    <v-card-title>
      <v-text-field v-model="trial" label="Trial name" clearable />
    </v-card-title>
    <v-card-text>
      <create-trial />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn plain>Cancel</v-btn>
      <v-btn @click="addTrial">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import {paths} from '@/utils/Enums';
import CreateTrial from '@/components/pages/test-page/CreateTrial.vue';
import {mapActions, mapMutations, mapState} from 'vuex';

export default {
  components: {
    CreateTrial,
  },
  name: 'new-test',
  title: 'New Test',
  path: paths.addTrial,
  description: 'Test page',
  methods: {
    ...mapMutations('addTrial', ['updateName']),
    ...mapActions('addTrial', ['addTrial']),
  },
  computed: {
    ...mapState('addTrial', ['name']),
    trial: {
      get() {
        return this.name;
      },
      set(name) {
        this.updateName(name);
      },
    },
  },
};
</script>
