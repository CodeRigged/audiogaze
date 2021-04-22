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
  },
  mutations: {
    updateState(state, input) {
      const {key, data} = input;
      state[key] = data;
    },
  },
  actions: {
    setup({dispatch, commit}) {
      dispatch('setInterceptors');
      document.addEventListener('fullscreenchange', (e) => {
        if (!(document.webkitIsFullScreen || document.mozFullScreen || false)) {
          commit('appState/isFullScreen', false);
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
            `
            display: inline-block;
            padding: 2px;
            border: 1px solid #77aaff;
            background-color:rgba(202, 198, 198, 0.1);
            border-radius: 5px; 
            font-size:12px; 
            color:#37f76a; 
            font-weight:800
            `,
          );
          console.log(
            `%c${message}`,
            `
            display: inline-block;
            padding: 2px;
            border-bottom: 2px dashed #77aaff;
            font-size:12px; 
            color:rgb(255, 222, 36);
            font-weight:800
          `,
          );

          if (message) {
            dispatch('appState/setLoading', message);
          } else {
            dispatch('appState/setLoading', null);
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        },
      );
      response.use(
        (res) => {
          dispatch('appState/setLoading');
          return res;
        },
        (err) => {
          if (!err.response.data.preventRedirect) {
            router.push('/');
          }
          dispatch('appState/setLoading');
          return Promise.reject(err);
        },
      );
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
          dispatch('appState/setError', `Couldn't load trials.`);
        });
    },
    async connectEyetracker({dispatch}) {
      const res = await Vue.axios
        .get(`/eyetracker/connect`, {
          message: 'Connecting to Gazepoint Eyetracker',
        })
        .catch((e) => {
          dispatch(
            'appState/setError',
            `Couldn't establish connection  with eyetracker.`,
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
          dispatch('appState/setError', `Couldn't find trial with given id.`);
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
            'appState/setError',
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
