import Vue from 'vue';
import router from '@/router';

const defaultTrialState = () => ({
  name: null,
});

const namespaced = true;
const addTrial = {
  namespaced,
  state: defaultTrialState(),

  mutations: {
    resetState(state) {
      Object.assign(state, defaultTrialState());
    },
    updateName(state, name) {
      state.name = name;
    },
  },

  actions: {
    async addTrial({state, dispatch}) {
      const trial = state;
      await Vue.axios
        .post('/trials', {trial}, {message: 'Adding Trial'})
        .then((res) => {
          dispatch('updateTrials', res.data, {root: true});
          dispatch('resetTrial');
        })
        .catch((e) => {
          console.log(e);
        });
    },
    resetTrial({commit}) {
      commit('resetState');
      router.push('/');
    },
  },

  getters: {},
};

export default addTrial;
