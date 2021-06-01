<template>
  <v-dialog max-width="60vw" v-model="dialog">
    <template v-slot:activator="{on, attrs}">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-title>Delete</v-list-item-title>
        <v-list-item-action>
          <v-icon small>mdi-delete</v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        Are you sure you want to delete this trial?
      </v-card-title>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn plain @click="dialog = false">
          No
        </v-btn>
        <v-btn
          text
          @click="
            removeTrial(trialId);
            dialog = false;
          "
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {mapActions} from 'vuex';
export default {
  name: 'delete-trial',
  data: () => ({dialog: false}),
  props: {
    trialId: String,
  },
  methods: {
    ...mapActions(['removeTrial']),
  },
};
</script>
