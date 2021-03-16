<template>
  <v-container fill-height fluid>
    <v-row no-gutters align="center" justify="center">
      <div>
        <v-row align="center" justify="center">
          <v-btn @click="getData">Click me</v-btn>
        </v-row>
        <v-row>
          <div class="pt-2 text-center">{{ message }}</div>
        </v-row>
      </div>
    </v-row>
  </v-container>
</template>
<script>
import config from "@/config";
export default {
  name: "Home",
  path: config.home,
  data: () => ({ message: "" }),
  methods: {
    async getData() {
      await this.axios
        .get("/")
        .then((res) => {
          this.message = res.data;
        })
        .catch(() => {
          this.message = "Turn on server for message to display correctly";
        });
    },
  },
};
</script>