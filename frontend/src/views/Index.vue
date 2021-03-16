<template>
  <absolute-center>
    <v-btn label="New Test" to="/test">New Test</v-btn>
  </absolute-center>
</template>
<script>
import {mapState} from 'vuex';
import AbsoluteCenter from '@/components/other/AbsoluteCenter.vue';
export default {
  name: 'index',
  title: 'Home',
  path: '/',
  description: 'Overview page',
  components: {AbsoluteCenter},
  computed: {
    ...mapState({path: (state) => state.paths.newTest}),
  },
};
</script>
