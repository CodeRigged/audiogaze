const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_ADD_TRIAL: addTrial,
  VUE_APP_PATH_RUN_TRIAL: runTrial,
  VUE_APP_PATH_PREVIEW_TRIAL: previewTrial,
  // CONFIG
  VUE_APP_API_BASE_URL: apiBaseURL,
} = process.env;

const paths = Object.freeze({
  index,
  addTrial,
  runTrial,
  previewTrial,
});

const CONFIG = Object.freeze({
  apiBaseURL,
});
export {paths, CONFIG};
