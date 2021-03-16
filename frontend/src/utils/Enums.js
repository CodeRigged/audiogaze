const {
  // Paths
  BASE_URL: index,
  VUE_APP_PATH_NEW_TEST: newTest,
  // CONFIG
  VUE_APP_API_BASE_URL: apiBaseURL,
} = process.env;

const PATHS = Object.freeze({
  index,
  newTest
});

const CONFIG = Object.freeze({
  apiBaseURL,
});
export {PATHS, CONFIG};
