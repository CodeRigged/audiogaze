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
      <v-btn @click="resetTrial" plain>Cancel</v-btn>
      <v-btn @click="addTrial">Confirm</v-btn>
    </v-card-actions>
  </v-card>
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
    ...mapMutations('addTrial', ['updateName']),
    ...mapActions('addTrial', ['addTrial', 'resetTrial']),
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
