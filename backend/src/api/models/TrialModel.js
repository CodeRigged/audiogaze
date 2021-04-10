import mongoose from 'mongoose';
import recordsSchema from './RecordModel';
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
      type: [recordsSchema],
    },
  },
  {
    timestamps: {
      createAt: 'created_at',
    },
  },
);

export default trialSchema;
