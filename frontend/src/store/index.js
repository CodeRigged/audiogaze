/* eslint-disable no-unused-vars */
import {paths} from '@/utils/Enums';
import Vue from 'vue';
import router from '@/router';
import Vuex from 'vuex';
import modules from './modules/all-modules';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    trials: [],
    paths,
    colsWidth: {
      trial: {number: 2, image: 4, timeRange: 4, actions: 2},
      audio: {number: 1, track: 3, timeRange: 4, channel: 2, actions: 2},
    },
    isFullScreen: false,
    isLoading: false,
    loadingMessage: null,
    showErrorOverlay: false,
    errorMessage: null,
  },
  mutations: {
    updateState(state, input) {
      const {key, data} = input;
      state[key] = data;
    },
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
    setup({dispatch, commit}) {
      dispatch('setInterceptors');
      document.addEventListener('fullscreenchange', (e) => {
        if (!(document.webkitIsFullScreen || document.mozFullScreen || false)) {
          commit('isFullScreen', false);
        }
      });
    },
    setInterceptors({commit, dispatch}) {
      const {request, response} = Vue.axios.interceptors;
      request.use(
        (config) => {
          const {method, baseURL, url, message} = config;
          console.log(
            `%cMade ${method} request to ${baseURL + url}`,
            'display: inline-block; padding: 4px ;background-color:#848484;border-radius: 0 40px 40px 0; font-size:14px; color:#9EFF8A; font-weight:800',
          );
          console.log(message);
          commit('loading', true);
          if (message) {
            commit('setLoadingMessage', message);
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        },
      );
      response.use(
        (res) => {
          dispatch('setLoadingComplete');

          return res;
        },
        (err) => {
          if (!err.response.data.preventRedirect) {
            router.push('/');
          }
          dispatch('setLoadingComplete');
          return Promise.reject(err);
        },
      );
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
    async loadTrials({commit, dispatch}) {
      await Vue.axios
        .get('/trials', {
          message: 'Loading Trials',
        })
        .then((res) => {
          commit('updateState', {key: 'trials', data: res.data});
        })
        .catch((e) => {
          dispatch('setErrorVisibility', `Couldn't load trials.`);
        });
    },
    async connectEyetracker({dispatch}) {
      const res = await Vue.axios
        .get(`/eyetracker/connect`, {
          message: 'Connecting to Gazepoint Eyetracker',
        })
        .catch((e) => {
          dispatch(
            'setErrorVisibility',
            `Couldn't establich connection  with eyetracker.`,
          );
        });
      if (res) {
        const status = res.status;
        return status;
      }
    },
    async getTrial({dispatch}, id) {
      const res = await Vue.axios
        .get(`/trials/${id}`, {
          message: 'Preparing trial',
        })
        .catch((e) => {
          dispatch('setErrorVisibility', `Couldn't find trial with given id.`);
        });
      if (res) {
        const data = res.data;
        return data;
      }
    },
    async sendResults({dispatch}, {clientData, id}) {
      const res = await Vue.axios
        .put(`trials/${id}`, clientData, {
          message: 'Trial is ending',
        })
        .catch((e) => {
          dispatch(
            'setErrorVisibility',
            `Something went wrong with the synchronization process.`,
          );
        });
      if (res) {
        return res;
      }
    },
    updateTrials({commit}, data) {
      commit('updateState', {key: 'trials', data});
    },
  },
  modules,
  getters: {},
});
