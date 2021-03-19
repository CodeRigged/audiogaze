const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_ADD_TRIAL: addTrial,
  // CONFIG
  VUE_APP_API_BASE_URL: apiBaseURL,
} = process.env;

const paths = Object.freeze({
  index,
  addTrial,
});

const CONFIG = Object.freeze({
  apiBaseURL,
});
export {paths, CONFIG};
