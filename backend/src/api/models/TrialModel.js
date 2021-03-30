import {Timestamp} from 'bson';
import mongoose from 'mongoose';
import trackSchema from './TrackModel';

const required = true;

const trialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required,
    },
    duration: {type: Number, required},
    tracks: {
      type: [trackSchema],
      required,
    },
    results: {
      type: Array,
    },
  },
  {
    timestamps: {
      createAt: 'created_at',
    },
  },
);

export default trialSchema;
