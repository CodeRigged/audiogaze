<template>
  <v-parallax :height="screenHeight" :src="image">
    <absolute-center class="title">Test starting in 3...</absolute-center>
    <div class="bottom-right">
      <v-icon
        v-if="!isFullScreen"
        size="70"
        color="white"
        @click="toggleFullScreen"
      >
        mdi-fullscreen
      </v-icon>
    </div>
  </v-parallax>
</template>
<script>
import Test from '@/assets/images/background-test.jpg';
import {paths} from '@/utils/Enums';
import {mapActions, mapState} from 'vuex';
import AbsoluteCenter from '@/components/other/AbsoluteCenter.vue';
export default {
  components: {AbsoluteCenter},
  name: 'trial',
  title: 'Trial',
  path: paths.runTrial,
  data: () => ({}),
  computed: {
    ...mapState(['isFullScreen']),
    image() {
      return Test;
    },
    screenHeight() {
      return screen.height;
    },
  },
  methods: {...mapActions(['toggleFullScreen'])},
};
</script>
<style lang="scss" scoped>
.bottom-right {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
