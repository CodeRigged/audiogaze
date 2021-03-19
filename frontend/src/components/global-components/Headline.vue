<template>
  <div class="headline pa-1">{{ title }}</div>
</template>

<script>
export default {
  name: 'app-headline',
  props: {title: {type: String, default: 'Missing Title'}},
};
</script>
