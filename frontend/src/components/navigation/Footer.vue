<template>
  <v-footer app fixed color="primary lighten-1" padless>
    <v-card flat tile width="100%" class="background">
      <v-divider></v-divider>

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
export default {
  name: 'app-footer',
  description: 'Footer of the app',
  mixins: [],
  data: () => ({}),
  components: {},
  props: {},
  watch: {},
  methods: {},
  computed: {
    version() {
      return 'v.' + process.env.PACKAGE_VERSION;
    },
    link() {
      return 'https://github.com/CodeRigged/gazepoint-with-audio';
    },
  },
  mounted() {},
};
</script>
