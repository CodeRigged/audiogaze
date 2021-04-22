import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

// read default colors set in .env-file
const {
  VUE_APP_DARK_COLOR: dark,
  VUE_APP_LIGHT_COLOR: light,
  VUE_APP_PRIMARY_COLOR: primary = '#000',
  VUE_APP_SECONDARY_COLOR: secondary = '#000',
  VUE_APP_BACKGROUND_COLOR: background = '#f9f9f9',
} = process.env;

// initialize vuetify
const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  // set theme
  theme: {
    themes: {
      light: {
        primary,
        secondary,
        background,
        dark,
        light,
      },
    },
  },
});
export default vuetify;
