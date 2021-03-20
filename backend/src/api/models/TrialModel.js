import mongoose from 'mongoose';
import trackSchema from './TrackModel';

const required = true;

const trialSchema = new mongoose.Schema({
  name: {
    type: String,
    required,
  },

  tracks: {
    type: [trackSchema],
    required,
  },
  results: {
    type: Array,
  },
});

export default trialSchema;
