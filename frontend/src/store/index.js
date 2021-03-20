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
    setLoadingMessage(state, message) {
      state.loadingMessage = message;
    },
  },
  actions: {
    setup({commit, dispatch}) {
      const {request, response} = Vue.axios.interceptors;
      request.use(
        (config) => {
          const {method, baseURL, url, message} = config;
          console.log(
            `%cMade ${method} request to ${baseURL + url}`,
            'background-color:#848484; font-size:14px; color:#9EFF8A; font-weight:800',
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
    updateTrials({commit}, data) {
      commit('updateState', {key: 'trials', data});
    },
  },
  modules,
  getters: {},
});
