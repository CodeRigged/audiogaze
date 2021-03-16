import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);
const theme = {
  //   add your custom colors
  themes: {
    light: {
      background: "#f9f9f9",
      /*    primary,
      secondary,
      dark,
      light,
      progress, */
    },
  },
};

const options = {
  icons: {
    iconfont: "mdi", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme,
};
export default new Vuetify(options);
