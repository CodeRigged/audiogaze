<template>
  <v-data-table :items-per-page="15" :headers="resultsHeaders" :items="results">
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
  props: {results: Array},
  methods: {
    /**
     * @descriptions Method which converts JSON-results to CSV-format
     *
     * Credit: https://stackoverflow.com/a/31536517
     */
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
    /**
     * @description Export to CSV
     */
    exportToCSV(id) {
      const json = this.results.find((item) => item._id === id).data;
      const csv = this.convertToCSV(json);
      const data = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      const fileName = `${id}.csv`;

      this.download(fileName, data);
    },
    /**
     * @description Export to JSON
     */
    exportToJSON(id) {
      const data = new Blob(
        [JSON.stringify(this.results.find((item) => item._id === id).data)],
        {
          type: 'data:application/json',
        },
      );
      const fileName = `${id}.json`;

      this.download(fileName, data);
    },
    /**
     * @description Method which downloads a file
     *
     * @param {string} fileName
     * @param {any} data
     */
    download(fileName, data) {
      if (window.navigator.msSaveOrOpenBlob) {
        // IE 10+
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
    /**
     * @description Download options
     */
    downloadOptions() {
      return [
        {title: 'To CSV', onClick: this.exportToCSV},
        {title: 'To JSON', onClick: this.exportToJSON},
      ];
    },
    /**
     * @description Headers of results table
     */
    resultsHeaders() {
      return [
        {text: 'Index', align: 'start', value: 'index', width: 100},
        {text: 'Taken at', align: 'center', value: 'createdAt'},
        {text: 'Participant', align: 'center', value: 'participant'},
        {text: 'Total Entries', align: 'center', value: 'data.length'},
        {text: 'Actions', align: 'center', value: 'actions', width: 100},
      ];
    },
  },
};
</script>
