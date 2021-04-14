import {mapActions, mapState} from 'vuex';

const duplicateMixin = {
  computed: {
    icons() {
      return {
        add: 'plus',
        remove: 'delete',
        edit: 'pencil',
      };
    },
  },
};
export {duplicateMixin};

const appStateMixin = {
  methods: {
    ...mapActions('app-state', ['setError']),
  },
  computed: {
    ...mapState('app-state', [
      'errorResponse',
      'showError',
      'isLoading',
      'hideOverlay',
    ]),
  },
};
export {appStateMixin};
