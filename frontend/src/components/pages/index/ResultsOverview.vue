<template>
  <v-data-table hide-default-footer :headers="resultsHeaders" :items="results">
    <template v-slot:item.index="{index}">{{ index + 1 }}</template
    ><template v-slot:item.index="{index}">{{ index + 1 }}</template>
    <template v-slot:item.actions="{}">
      <v-menu offset-y bottom>
        <template #activator="{on,attrs}">
          <v-btn text v-on="on" v-bind="attrs">Export</v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="({title, onClick}, index) in downloadOptions"
            :key="index"
            @click="onClick"
          >
            <v-list-item-title v-text="title" />
            <v-list-item-icon>
              <v-icon>mdi-download</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <!-- <template v-slot:expanded-item="{headers, item}">
      <td class="pa-1" :colspan="headers.length + 1">
        <v-card flat>
          <v-card-text> </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn small>
              Export
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </td>
    </template> -->
  </v-data-table>
  <!-- <v-row class="caption">
    <v-col>ID</v-col>
    <v-col>Taken at</v-col>
    <v-col cols="2">Action</v-col>
  </v-row>
  <div v-for="result in item.results" :key="result._id">
    <v-row>
      <v-col>{{ result._id }}</v-col>
      <v-col>{{ result.createdAt }}</v-col>
      <v-col cols="2">
        <v-btn>Export</v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider> -->
</template>
<script>
export default {
  name: 'results-overview',
  data: () => ({}),
  props: {results: Array},
  methods: {
    exportData(id) {
      console.log(id);
    },
    exportToCSV() {
      console.log('CSV');
    },
    exportToJSON() {
      console.log('JSON');
    },
  },
  computed: {
    downloadOptions() {
      return [
        {title: 'To CSV', onClick: this.exportToCSV},
        {title: 'To JSON', onClick: this.exportToJSON},
      ];
    },
    resultsHeaders() {
      return [
        {text: 'Index', align: 'start', value: 'index', width: 100},
        {text: 'Taken at', align: 'center', value: 'createdAt'},
        {text: 'Total Entries', align: 'center', value: 'data.length'},
        {text: 'Actions', align: 'center', value: 'actions', width: 100},
      ];
    },
  },
  watch: {},
};
</script>
