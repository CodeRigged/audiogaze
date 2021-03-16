<template>
  <v-card class="pa-2">
    <v-card-title>
      <app-headline title="New Test" />
    </v-card-title>
    <v-card-text>
      <testpage />
    </v-card-text>
  </v-card>
</template>
<script>
import {PATHS} from '@/utils/Enums';
import Testpage from '@/components/pages/test-page/Testpage.vue';

export default {
  components: {
    Testpage,
  },
  name: 'new-test',
  title: 'New Test',
  path: PATHS.newTest,
  description: 'Test page',
};
</script>
