<template>
  <v-tooltip v-bind="tooltipProps">
    <template #activator="{ on }">
      <slot name="activator" :on="on" />
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>
<script>
/**
 * An example how a global component could look like,
 * though tooltips haven't been used in this application at present.
 */
export default {
  name: 'tooltip',
  props: {
    tooltipText: {type: String, default: 'Missing tooltip text'},
    pos: {type: String, default: 'bottom'},
  },
  computed: {
    tooltipProps() {
      const tooltipProps = {};
      tooltipProps[this.pos] = true;
      return tooltipProps;
    },
  },
};
</script>
