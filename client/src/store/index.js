import {paths} from '@/config';
import Vue from 'vue';
import router from '@/router';
import Vuex from 'vuex';
import modules from './modules/all-modules';
Vue.use(Vuex);

/**
 * @description Vuex-store, where all the important data is saved
 *
 * See {@link https://vuex.vuejs.org/ vuex}...
 */
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
    /**
     * @description Method is called in App-component
     */
    setup({dispatch, commit}) {
      // set interceptors
      dispatch('setInterceptors');
      // adds an event-listener which reacts to screen-mode changes
      document.addEventListener('fullscreenchange', () => {
        if (!(document.webkitIsFullScreen || document.mozFullScreen || false)) {
          commit('appState/isFullScreen', false);
        }
      });
    },
    /**
     * @description Method sets interceptors of axios http-client
     */
    setInterceptors({dispatch}) {
      const {request, response} = Vue.axios.interceptors;
      request.use(
        (config) => {
          const {method, baseURL, url, message} = config;
          // basic log-messages
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
          /**
           * when a request is made set the state of app to "loading"
           * => a loading spinner will appear on the center of the screen,
           * with a default message (if not specified with request)
           */
          if (message) {
            dispatch('appState/setLoading', message);
          } else {
            dispatch('appState/setLoading');
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        },
      );
      response.use(
        (res) => {
          // stops loading spinner
          dispatch('appState/setLoading');
          return res;
        },
        (err) => {
          // if server sends 'preventRedirect'-tag, the page will be not redirect to home page on-error
          if (!err.response.data.preventRedirect) {
            router.push('/');
          }
          // stops loading spinner
          dispatch('appState/setLoading');
          return Promise.reject(err);
        },
      );
    },
    /**
     * @description Methods which tells server to attempt a connection with eyetracker
     */
    async connectEyetracker({dispatch}) {
      const res = await Vue.axios
        .get(`/eyetracker/connect`, {
          message: 'Connecting to Gazepoint Eyetracker',
        })
        .catch(() => {
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
    /**
     * @description Methods which gets all trials from server
     */
    async loadTrials({dispatch}) {
      await Vue.axios
        .get('/trials', {
          message: 'Loading Trials',
        })
        .then((res) => {
          dispatch('updateTrials', res.data);
        })
        .catch(() => {
          dispatch('appState/setLoading');
          dispatch('appState/setError', `Couldn't load trials.`);
        });
    },
    /**
     * @description Methods which gets single trial (matching input id) from server
     */
    async getTrial({dispatch}, id) {
      const res = await Vue.axios
        .get(`/trials/${id}`, {
          message: 'Preparing trial',
        })
        .catch(() => {
          dispatch('appState/setError', `Couldn't find trial with id ${id}`);
        });
      if (res) {
        const data = res.data;
        return data;
      }
    },
    /**
     * @description Methods which gets single trial (matching input id) from server
     */
    async removeTrial({dispatch}, id) {
      await Vue.axios
        .delete(`/trials/${id}`, {
          message: 'Deleting trial',
        })
        .then((res) => {
          const {status, data} = res;
          if (status === 200) {
            dispatch(
              'appState/setInformation',
              `Successfully remove trial with id ${id}`,
            );
            dispatch('updateTrials', data);
          }
        })
        .catch(() => {
          dispatch('appState/setError', `Couldn't delete trial with id ${id}`);
        });
    },
    /**
     * @description Methods which sends results from a trial to server
     */
    async sendResults({dispatch}, {clientData, id}) {
      const res = await Vue.axios
        .put(`trials/${id}`, clientData, {
          message: 'Trial is ending',
        })
        .catch(() => {
          dispatch(
            'appState/setError',
            `Something went wrong with the synchronization process.`,
          );
        });
      if (res) {
        return res;
      }
    },
    /**
     * @description Update state of trials-array
     */
    updateTrials({commit}, data) {
      commit('updateState', {key: 'trials', data});
    },
  },
  // register modules
  modules,
});
