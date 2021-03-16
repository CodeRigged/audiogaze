<template>
  <v-row align="baseline" dense class="range-container">
    <div v-if="label" class="range-label" :class="{'primary--text': focused}">
      {{ label }}
    </div>
    <v-col cols="4">
      <v-text-field
        v-on="listeners"
        v-model="value.from"
        @input="handleInput"
        label="from"
      />
    </v-col>
    <v-col align-self="center" class="range-seperator" cols="1">
      <hr />
    </v-col>
    <v-col cols="4">
      <v-text-field v-on="listeners" v-model="value.to" label="to" />
    </v-col>
    <v-col>{{ prependText }}</v-col>
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
    range: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
  methods: {
    handleInput(newVal) {
      if (parseInt(newVal) > parseInt(this.to)) {
        this.to = newVal;
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
