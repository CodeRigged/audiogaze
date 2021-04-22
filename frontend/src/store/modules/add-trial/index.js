/* eslint-disable no-unused-vars */
import Vue from 'vue';
import router from '@/router';

const log = console.log;
/**
 *  @description Default state of a track sequence.
 *  A track sequence doesn't require any audio.
 */
const defaultTrackState = () => ({
  imagePath: null,
  timeRange: {
    from: 0,
    to: null,
  },
  audios: [],
});

/**
 *  @description Default state of an audio sequence.
 */
const defaultAudioState = () => ({
  audioPath: null,
  channels: null,
  timeRange: {
    from: 0,
    to: null,
  },
});

/**
 *  @description Default state of a trial.
 */
const defaultTrialState = () => ({
  name: null,
  timeUnit: null,
  channelLimit: null,
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
    updateChannelLimit(state, limit) {
      state.channelLimit = limit;
    },

    /**
     * @description Method which adds a track to tracks-array.
     *
     * Additionally, sets the time-range of next track.
     */
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
    /**
     * @description Method which updates all time-ranges simultaneously.
     */
    removeTrack(state, trackIndex) {
      state.tracks.splice(trackIndex, 1);
    },
    /**
     * @description Method which updates all time-ranges simultaneously.
     */
    updateTimeRanges(state, {trackIndex, audioIndex, timeRange, updateAudio}) {
      const audiosLength = state.tracks[trackIndex].audios.length;
      if (!updateAudio) {
        // update time-ranges of tracks
        const previous = trackIndex - 1;
        const next = trackIndex + 1;
        if (
          audiosLength > 0 &&
          state.tracks[trackIndex].audios[audiosLength - 1].timeRange.to >=
            timeRange.to
        ) {
          // update if track contains audio, and if audio isn't within given time-range of track
          state.tracks[trackIndex].audios[audiosLength - 1].timeRange.to =
            timeRange.to;
        }
        if (previous >= 0) {
          // update previous element
          state.tracks[previous].timeRange.to = timeRange.from;
        }
        if (next <= state.tracks.length - 1) {
          // update next element
          state.tracks[next].timeRange.from = timeRange.to;
        }
      } else {
        // update time-ranges of audio
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
          // update previous element, if time-range from the previous element is superior to the from-range from updated element
          state.tracks[trackIndex].audios[previous].timeRange.to =
            timeRange.from;
        }
        if (
          next <= audiosLength - 1 &&
          state.tracks[trackIndex].audios[next].timeRange.from < timeRange.to
        ) {
          // update next element, if time-range from from the next element is inferior to the to-range from updated element
          state.tracks[trackIndex].audios[next].timeRange.from = timeRange.to;
        }
      }
    },
    /**
     * @description Method which adds an audio corresponding to track at {trackIndex}.
     *
     * Additionally, sets the time-range if certain conditions are met.
     */
    addAudio(state, trackIndex) {
      const newRow = defaultAudioState();
      const audios = state.tracks[trackIndex].audios;
      const audio = audios[audios.length - 1];
      if (audios.length === 0) {
        // set the time-range of the first element of the audios array to the time-range start from the track
        const from = state.tracks[trackIndex].timeRange.from;
        newRow.timeRange.from = from;
      } else {
        // else set the time-range of the next element of the audios array to the time-range end from the previous element
        const to = audio.timeRange.to;
        newRow.timeRange.from = to;
        newRow.timeRange.to = to;
      }
      state.tracks[trackIndex].audios.push(newRow);
    },
    /**
     * @description Method which removes an audio corresponding to track at {trackIndex} with {audioIndex}.
     */
    removeAudio(state, {trackIndex, audioIndex}) {
      state.tracks[trackIndex].audios.splice(audioIndex, 1);
    },
  },

  actions: {
    /**
     * @description Methods which sends a new trial to server with current state of module.
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
            'appState/setError',
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
};

export default addTrial;
