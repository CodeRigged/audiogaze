<template>
  <v-container>
    <input-row
      :key="index"
      v-for="(row, index) in rows"
      v-model="rows[index]"
      :index="index + 1"
      @add="onAdd(row)"
      @remove="onRemove(index)"
      :removable="rows.length === 1"
    />
  </v-container>
</template>
<script>
import InputRow from './InputRow.vue';

export default {
  name: 'create-trial-page',
  description: 'description',
  mixins: [],
  data: () => ({
    rows: [
      {
        file: null,
        range: {from: 0, to: null},
        channel: null,
      },
    ],
  }),
  components: {
    InputRow,
  },
  props: {},
  watch: {},
  methods: {
    onAdd(row) {
      const {to} = row.range;
      const newRow = {
        file: null,
        range: {from: 0, to: null},
        channel: null,
      };
      newRow.range.from = to;
      this.rows.push(newRow);
    },
    onRemove(index) {
      this.rows.splice(index, 1);
    },
  },
  computed: {},
  mounted() {},
};
</script>
