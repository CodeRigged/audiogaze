const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_ADD_TRIAL: addTrial,
  VUE_APP_PATH_RUN_TRIAL: runTrial,
  VUE_APP_PATH_PREVIEW_TRIAL: previewTrial,
  VUE_APP_PATH_TRIAL_RESULTS: trialResults,
  // Config
  VUE_APP_API_BASE_URL: apiEndpoint,
} = process.env;

/**
 * All paths of application
 */
const paths = Object.freeze({
  index,
  addTrial,
  runTrial,
  previewTrial,
  trialResults,
});
/**
 * All configuration-variables of application
 */
const config = Object.freeze({
  apiEndpoint,
});
export {paths, config};
