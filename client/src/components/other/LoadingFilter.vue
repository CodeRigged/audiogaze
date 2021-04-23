<template>
  <div class="absolute-center">
    <div>
      {{ loadingMessage ? loadingMessage : 'Loading, please wait' }}...
      <v-progress-circular :size="20" color="primary" width="3" indeterminate />
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
/**
 * @description This is the loading filter which appears when an api call has been made.
 */
export default {
  name: 'loading-template',
  computed: {...mapGetters('appState', ['loadingMessage'])},
};
</script>
