<template>
  <v-container v-if="trial" fluid>
    <v-card>
      <v-card-title>You are viewing {{ trial.name }}</v-card-title>
      <v-card-subtitle class="caption">Id: {{ trial._id }}</v-card-subtitle>
      <v-card-text>
        The trial has a duration of {{ trial.duration }} ms.
        <br />
        <br />
        Images (in order):
        <div
          class="ma-3"
          v-for="{_id, imagePath, audios, timeRange, number} in trial.tracks"
          :key="_id"
        >
          <v-row>
            <v-col cols="1">{{ number + 1 }}. </v-col>
            <v-col>
              <img class="dimension pr-2" :src="loadImage(imagePath)" />
            </v-col>
            <v-col>
              <v-row>
                <v-col>Start: {{ timeRange.from }} ms</v-col>
                <v-col>End: {{ timeRange.to }} ms</v-col>
              </v-row>
              <div v-if="audios.length > 0">
                <div v-for="audio in audios" :key="audio._id">
                  <v-row>
                    <v-col cols="6">&bull; {{ audio.audioPath }}</v-col>
                    <v-col>Start: {{ audio.timeRange.from }} ms</v-col>
                    <v-col>End: {{ audio.timeRange.to }} ms</v-col>
                  </v-row>
                  <v-divider />
                  <v-row>
                    <v-col>
                      Plays on channel(s): {{ audio.channels.join(', ') }}
                    </v-col>
                  </v-row>
                </div>
              </div>
              <v-row v-else class="caption">
                <v-col>No audio tracks. </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider v-if="number !== trial.tracks.length - 1" />
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn to="/" plain>Return to overview</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import {paths} from '@/config';
/**
 * @description The preview page displays the trial, as a mean to verify if values are correct.
 */
export default {
  name: 'preview-trial',
  title: 'Trial Preview',
  path: paths.previewTrial,
  data: () => ({trial: null}),
  methods: {
    loadImage(imagePath) {
      // loads the image of your PC with corresponding path
      return require(process.env.VUE_APP_PATH_TO_IMAGES_FOLDER + imagePath);
    },
  },
  watch: {},
  async created() {
    // get trial from server
    this.trial = await this.$store.dispatch('getTrial', this.$route.params.id);
  },
};
</script>
<style lang="scss" scoped>
.dimension {
  height: 256px;
}
</style>
