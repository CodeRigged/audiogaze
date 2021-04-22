<template>
  <v-data-table hide-default-footer :headers="resultsHeaders" :items="results">
    <template v-slot:item.index="{index}">{{ index + 1 }}</template>
    <template v-slot:item.actions="{item}">
      <v-menu offset-y bottom>
        <template #activator="{on,attrs}">
          <v-btn text v-on="on" v-bind="attrs">Export</v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="({title, onClick}, index) in downloadOptions"
            :key="index"
            @click="onClick(item._id)"
          >
            <v-list-item-title v-text="title" />
            <v-list-item-icon>
              <v-icon>mdi-download</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>
<script>
/**
 * @description Component which is used on index-page.
 *
 * Displays results from trial.
 */
export default {
  name: 'results-overview',
  data: () => ({}),
  props: {results: Array},
  methods: {
    convertToCSV(json) {
      const replacer = (key, value) => (value === null ? 'No value' : value); // specify how you want to handle null values here
      const header = Object.keys(json[0]);
      const csv = [
        header.map((key) => key.toUpperCase()).join(';'), // header row first
        ...json.map((row) =>
          header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(';'),
        ),
      ].join('\r\n');
      return csv;
    },
    exportToCSV(id) {
      const json = this.results.find((item) => item._id === id).data;
      const csv = this.convertToCSV(json);
      const data = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      const fileName = `${id}.csv`;
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(data, fileName);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(data);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    exportToJSON(id) {
      const data = new Blob(
        [JSON.stringify(this.results.find((item) => item._id === id).data)],
        {
          type: 'data:application/json',
        },
      );
      const fileName = `${id}.json`;
      if (window.navigator.msSaveOrOpenBlob) {
        // ie11
        window.navigator.msSaveOrOpenBlob(data, fileName);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          const url = URL.createObjectURL(data);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
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
