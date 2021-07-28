<template>
  <v-menu offset-y bottom>
    <template #activator="{on,attrs}">
      <v-btn small text v-on="on" v-bind="attrs">Export</v-btn>
    </template>
    <v-list dense>
      <v-list-item
        v-for="({title, onClick}, index) in downloadOptions"
        :key="index"
        @click="onClick(itemToDownload)"
      >
        <v-list-item-title v-text="title" />
        <v-list-item-icon>
          <v-icon>mdi-download</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'download-menu',
  props: ['fileName', 'itemToDownload'],
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
    exportToCSV(json) {
      const csv = this.convertToCSV(json);
      const data = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      const fileName = `${this.fileName}.csv`;

      this.download(fileName, data);
    },
    /**
     * @description Export to JSON
     */
    exportToJSON(json) {
      const data = new Blob([JSON.stringify(json)], {
        type: 'data:application/json',
      });
      const fileName = `${this.fileName}.json`;

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
  },
  watch: {},
};
</script>
