<template>
  <div class="absolute-center">
    <div>
      {{ loadingMessage ? loadingMessage : 'Loading, please wait...' }}
      <v-progress-circular :size="20" color="primary" width="3" indeterminate />
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
export default {
  name: 'loading-template',
  data: () => ({}),
  props: {},
  methods: {},
  computed: {...mapState(['loadingMessage'])},
  watch: {},
};
</script>
