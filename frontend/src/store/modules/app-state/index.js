/* eslint-disable no-unused-vars */
import Vue from 'vue';
import router from '@/router';

const log = console.log;

/**
 *  @description Default state of the app when page is first loaded.
 */
const defaultAppState = () => ({
  isFullScreen: false,
  loading: {
    isVisible: false,
    message: null,
  },
  errorOverlay: {
    isVisible: false,
    message: null,
  },
  infoSnackbar: {
    isVisible: false,
    message: null,
    timeout: 2000,
  },
});

const namespaced = true;
const addTrial = {
  namespaced,
  state: defaultAppState(),

  mutations: {
    isFullScreen(state, isFullScreen) {
      state.isFullScreen = isFullScreen;
    },
    setMessage(state, {key, message}) {
      state[key].message = message;
    },
    setVisibility(state, {key, isVisible}) {
      state[key].isVisible = isVisible;
    },
  },

  actions: {
    setInformation({commit}, message) {
      if (typeof message === 'string') {
        commit('setVisibility', {key: 'infoSnackbar', isVisible: true});
        commit('setMessage', {key: 'infoSnackbar', message});
      } else {
        commit('setVisibility', {key: 'infoSnackbar', isVisible: false});
        commit('setMessage', {key: 'infoSnackbar', message: null});
      }
    },
    setError({commit}, message) {
      if (typeof message === 'string') {
        commit('setVisibility', {key: 'errorOverlay', isVisible: true});
        commit('setMessage', {key: 'errorOverlay', message});
      } else {
        commit('setVisibility', {key: 'errorOverlay', isVisible: false});
        commit('setMessage', {key: 'errorOverlay', message: null});
      }
    },
    setLoading({commit}, message) {
      if (message) {
        commit('setVisibility', {key: 'loading', isVisible: true});
        commit('setMessage', {key: 'loading', message});
      } else {
        commit('setVisibility', {key: 'loading', isVisible: false});
        commit('setMessage', {key: 'loading', message: null});
      }
    },
    toggleFullScreen({commit}) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        commit('isFullScreen', true);
      } else {
        if (document.exitFullscreen) {
          commit('isFullScreen', false);
          document.exitFullscreen();
        }
      }
    },
  },

  getters: {
    errorOverlayVisbility(state) {
      return state.errorOverlay.isVisible;
    },
    errorOverlayMessage(state) {
      return state.errorOverlay.message;
    },
    infoSnackbarVisible(state) {
      return state.infoSnackbar.isVisible;
    },
    infoSnackbarMessage(state) {
      return state.infoSnackbar.message;
    },
    infoSnackbarTimeout(state) {
      return state.infoSnackbar.timeout;
    },
    loadingVisbility(state) {
      return state.loading.isVisible;
    },
    loadingMessage(state) {
      return state.loading.message;
    },
  },
};

export default addTrial;
