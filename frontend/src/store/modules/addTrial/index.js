import Vue from 'vue';
import router from '@/router';

const defaultAudioState = () => ({
  audioPath: null,
  channels: null,
  timeRange: {
    from: 0,
    to: null,
    timeUnit: null,
  },
});

const defaultTrackState = () => ({
  image: null,
  timeRange: {
    from: 0,
    to: null,
    timeUnit: null,
  },
  audios: [defaultAudioState()],
});

const defaultTrialState = () => ({
  name: null,
  tracks: [defaultTrackState()],
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
    updateTracks(state, tracks) {
      state.tracks = tracks;
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
    addTrack({state}, track) {
      const {to} = track.timeRange;
      const newRow = defaultTrackState();
      newRow.timeRange.from = to;
      state.tracks.push(newRow);
    },
    removeTrack({state}, trackIndex) {
      state.tracks.splice(trackIndex, 1);
    },
    addAudio({state}, {trackIndex, audio}) {
      console.log(audio);
      state.tracks[trackIndex].audios.push(defaultAudioState());
    },
    removeAudio({state}, {trackIndex, audioIndex}) {
      state.tracks[trackIndex].audios.splice(audioIndex, 1);
    },
    resetTrial({commit}) {
      commit('resetState');
      router.push('/');
    },
  },

  getters: {},
};

export default addTrial;
