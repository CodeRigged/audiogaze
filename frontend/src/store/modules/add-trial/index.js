/* eslint-disable no-unused-vars */
import Vue from 'vue';
import router from '@/router';

const log = console.log;

/*  Default state of a track sequence. 
    A track sequence doesn't require any audio. */
const defaultTrackState = () => ({
  imagePath: null,
  timeRange: {
    from: 0,
    to: null,
  },
  audios: [],
});

/* default state of an audio sequence */
const defaultAudioState = () => ({
  audioPath: null,
  channels: null,
  timeRange: {
    from: 0,
    to: null,
  },
});

/* default state of a trial */
const defaultTrialState = () => ({
  name: null,
  timeUnit: null,
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
    updateTimeUnit(state, timeUnit) {
      state.timeUnit = timeUnit;
    },
    addTrack(state) {
      const track = state.tracks[state.tracks.length - 1];
      const {to} = track.timeRange;
      const newRow = defaultTrackState();
      newRow.timeRange.from = to;
      newRow.timeRange.to = to;
      state.tracks.push(newRow);
    },
    updateTracks(state, tracks) {
      state.tracks = tracks;
    },
    removeTrack(state, trackIndex) {
      state.tracks.splice(trackIndex, 1);
    },
    updateTimeRanges(state, {trackIndex, audioIndex, timeRange, updateAudio}) {
      const audiosLength = state.tracks[trackIndex].audios.length;
      if (!updateAudio) {
        const previous = trackIndex - 1;
        const next = trackIndex + 1;
        if (
          audiosLength > 0 &&
          state.tracks[trackIndex].audios[audiosLength - 1].timeRange.to >=
            timeRange.to
        ) {
          state.tracks[trackIndex].audios[audiosLength - 1].timeRange.to =
            timeRange.to;
        }
        if (previous >= 0) {
          state.tracks[previous].timeRange.to = timeRange.from;
        }
        if (next <= state.tracks.length - 1) {
          state.tracks[next].timeRange.from = timeRange.to;
        }
      } else {
        const previous = audioIndex - 1;
        const next = audioIndex + 1;
        if (
          next === audiosLength &&
          state.tracks[trackIndex].timeRange.to < timeRange.to
        ) {
          state.tracks[trackIndex].timeRange.to = timeRange.to;
        }
        if (
          previous >= 0 &&
          state.tracks[trackIndex].audios[previous].timeRange.to >
            timeRange.from
        ) {
          state.tracks[trackIndex].audios[previous].timeRange.to =
            timeRange.from;
        }
        if (
          next <= audiosLength - 1 &&
          state.tracks[trackIndex].audios[next].timeRange.from < timeRange.to
        ) {
          state.tracks[trackIndex].audios[next].timeRange.from = timeRange.to;
        }
      }
    },
    addAudio(state, trackIndex) {
      const newRow = defaultAudioState();
      const audios = state.tracks[trackIndex].audios;
      const audio = audios[audios.length - 1];
      if (audio) {
        const to = audio.timeRange.to;
        newRow.timeRange.from = to;
        newRow.timeRange.to = to;
      }
      state.tracks[trackIndex].audios.push(newRow);
    },
    removeAudio(state, {trackIndex, audioIndex}) {
      state.tracks[trackIndex].audios.splice(audioIndex, 1);
    },
  },

  actions: {
    /**
     * @param {{state: {tracks:Array}}} - An object parameter with string and number properties
     */
    async addTrial({state, dispatch}) {
      await Vue.axios
        .post(
          '/trials',
          {trial: state},
          {
            message: 'Saving Trial',
          },
        )
        .then((res) => {
          dispatch('updateTrials', res.data, {root: true});
          dispatch('appState/setInformation', `Successfully added new trial.`, {
            root: true,
          });
          dispatch('resetTrial');
        })
        .catch((e) => {
          dispatch(
            'appState/setErrorVisibility',
            `Couldn't add trial. Please check if you have correctly input all fields.`,
            {
              root: true,
            },
          );
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
