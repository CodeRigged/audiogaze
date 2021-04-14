/* eslint-disable no-unused-vars */
import Vue from 'vue';
import router from '@/router';

const log = console.log;

/**
 *  @description Default state of the app when page is first loaded.
 */
const defaultAppState = () => ({
  isFullScreen: false,
  isLoading: false,
  loadingMessage: null,
  showErrorOverlay: false,
  errorMessage: null,
});

const namespaced = true;
const addTrial = {
  namespaced,
  state: defaultAppState(),

  mutations: {
    loading(state, isLoading) {
      state.isLoading = isLoading;
    },
    errorOverlay(state, isError) {
      state.showErrorOverlay = isError;
    },
    isFullScreen(state, isFullScreen) {
      state.isFullScreen = isFullScreen;
    },
    setLoadingMessage(state, message) {
      state.loadingMessage = message;
    },
    setErrorMessage(state, message) {
      state.errorMessage = message;
    },
  },

  actions: {
    setErrorVisibility({commit}, message) {
      if (typeof message === 'string') {
        commit('errorOverlay', true);
        commit('setErrorMessage', message);
      } else {
        commit('errorOverlay', false);
        commit('setErrorMessage', null);
      }
    },
    setLoadingComplete({commit}) {
      commit('loading', false);
      commit('setLoadingMessage', null);
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

  getters: {},
};

export default addTrial;
