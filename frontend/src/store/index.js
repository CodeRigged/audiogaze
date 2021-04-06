/* eslint-disable no-unused-vars */
import {paths} from '@/utils/Enums';
import Vue from 'vue';
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
  },
  mutations: {
    updateState(state, input) {
      const {key, data} = input;
      state[key] = data;
    },
    loading(state, isLoading) {
      state.isLoading = isLoading;
    },
    isFullScreen(state, isFullScreen) {
      state.isFullScreen = isFullScreen;
    },
    setLoadingMessage(state, message) {
      state.loadingMessage = message;
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
          dispatch('resetMessage');

          return res;
        },
        (err) => {
          dispatch('resetMessage');

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
    resetMessage({commit}) {
      commit('loading', false);
      commit('setLoadingMessage', null);
    },
    async loadTrials({commit}) {
      await Vue.axios
        .get('/trials')
        .then((res) => {
          commit('updateState', {key: 'trials', data: res.data});
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async connectEyetracker() {
      const res = await Vue.axios.get(`/eyetracker/connect`, {
        message: 'Connecting to Gazepoint Eyetracker..',
      });
      const status = res.status;
      return status;
    },
    async getTrial({commit}, id) {
      const res = await Vue.axios.get(`/trials/${id}`, {
        message: 'Preparing trial...',
      });
      const data = res.data;
      return data;
    },
    updateTrials({commit}, data) {
      commit('updateState', {key: 'trials', data});
    },
  },
  modules,
  getters: {},
});
