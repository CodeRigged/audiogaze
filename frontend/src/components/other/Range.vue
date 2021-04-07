<template>
  <v-row align="baseline" dense class="range-container">
    <v-col cols="4">
      <v-text-field
        v-on="listeners"
        v-model.number="value.from"
        @keypress="handleInput"
        label="from"
      />
    </v-col>
    <v-col align-self="center" class="range-seperator" cols="1">
      <hr />
    </v-col>
    <v-col cols="4">
      <v-text-field
        v-on="listeners"
        v-model.number="value.to"
        @keypress="handleInput"
        label="to"
      />
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'range',
  description: 'Range component.',
  mixins: [],
  data() {
    return {
      focused: false,
    };
  },
  components: {},
  props: {
    value: {type: Object},
    label: String,
    prependText: String,
  },
  watch: {
    'value.from'(from) {
      if (from > this.value.to) {
        this.value.to = from;
      }
    },
    'value.to'(to) {
      if (to < this.value.from) {
        this.value.from = to;
      }
    },
  },
  methods: {
    handleInput(event) {
      event = event ? event : window.event;
      var charCode = event.which ? event.which : event.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57)
        // &&
        // charCode !== 46
      ) {
        event.preventDefault();
      } else {
        return true;
      }
    },
  },
  computed: {
    listeners() {
      return {
        focus: () => {
          this.focused = true;
        },
        blur: () => {
          this.focused = false;
        },
      };
    },
  },
};
</script>
