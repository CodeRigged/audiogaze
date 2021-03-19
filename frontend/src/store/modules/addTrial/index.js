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
    async addTrial({state, commit, dispatch}) {
      const trial = state;
      await Vue.axios
        .post('/trials', {trial})
        .then((res) => {
          dispatch('updateTrials', res.data, {root: true});
          commit('resetState');
          router.push('/');
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  getters: {},
};

export default addTrial;
