<template>
  <v-footer app fixed color="primary lighten-1" padless>
    <v-card flat tile width="100%" class="background">
      <v-divider />
      <v-card-actions>
        <div class="caption">
          {{ version }}
        </div>
        <v-spacer />
        <v-btn x-small :ripple="false" plain :href="link">
          Github
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-footer>
</template>
<script>
/**
 * @description This is the footer displayed at the bottom of the application.
 *
 * Its used to display information and provide useful links.
 */
export default {
  name: 'app-footer',
  description: 'Footer of the app',
  computed: {
    version() {
      return 'v.' + process.env.PACKAGE_VERSION;
    },
    link() {
      return 'https://github.com/CodeRigged/gazepoint-with-audio';
    },
  },
};
</script>
