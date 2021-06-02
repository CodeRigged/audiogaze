<template>
  <v-card width="400">
    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field dense v-model="value.name" label="Participant *" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field dense v-model.number="value.age" label="Age *" />
        </v-col>
        <v-col>
          <v-select
            dense
            v-model="value.gender"
            :items="genderOptions"
            label="Gender *"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-select
            dense
            v-model="value.handedness"
            :items="handednessOptions"
            label="Handedness *"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea rows="1" v-model="value.comment" label="Comment *" />
        </v-col>
      </v-row>
      <small>
        * optional fields
      </small>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn small @click="$emit('start-trial')">
        Start Trial
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'participant-information',
  data: () => ({}),
  props: {value: Object},
  methods: {},
  computed: {
    genderOptions() {
      return ['Male', 'Female', 'Diverse'];
    },
    handednessOptions() {
      return ['Right', 'Left', 'Mixed', 'Ambidexterity', 'Other'];
    },
  },
  watch: {},
};
</script>
