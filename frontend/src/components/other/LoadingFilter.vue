<template>
  <absolute-center>
    <absolute-center>
      {{ loadingMessage ? loadingMessage : 'Loading, please wait...' }}
    </absolute-center>
    <absolute-center>
      <v-progress-circular :size="20" color="primary" width="3" indeterminate />
    </absolute-center>
  </absolute-center>
</template>
<script>
import {mapState} from 'vuex';
import AbsoluteCenter from './AbsoluteCenter.vue';
export default {
  components: {AbsoluteCenter},
  name: 'loading-template',
  data: () => ({}),
  props: {},
  methods: {},
  computed: {...mapState(['loadingMessage'])},
  watch: {},
};
</script>
