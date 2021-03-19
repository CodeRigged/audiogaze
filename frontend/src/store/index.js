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
  },
  mutations: {
    updateState(state, input) {
      const {key, data} = input;
      state[key] = data;
    },
  },
  actions: {
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
