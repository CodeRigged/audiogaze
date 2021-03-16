<template>
  <v-container fill-height fluid>
    <v-row no-gutters align="center" justify="center">
      <slot />
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'absolute-center',
};
</script>