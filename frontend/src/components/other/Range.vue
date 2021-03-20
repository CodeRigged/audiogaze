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
    <v-col>
      <v-select
        label="in"
        :items="time"
        v-model="value.timeUnit"
        item-text="timeUnit"
        item-value="symbol"
      >
        <template v-slot:item="{item}">
          {{ item.timeUnit }}
        </template>
        <template v-slot:selection="{item}">
          {{ item.symbol }}
        </template>
      </v-select>
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
      timeUnit: null,
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
    timeUnit(as) {
      console.log(as);
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
    time() {
      return [
        {symbol: 's', timeUnit: 'seconds'},
        {symbol: 'ms', timeUnit: 'milliseconds'},
      ];
    },
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
