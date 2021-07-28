import mongoose from 'mongoose';
import recordsSchema from './RecordModel';
import trackSchema from './TrackModel';

const required = true;

/**
 * Trial schema.
 */
const trialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required,
    },
    channelLimit: {
      type: Number,
      required,
    },
    duration: {type: Number, required},
    /* ****deprecated/not used****
      results: {
      type: [recordsSchema],
      select: false,
    }, */
    tracks: {
      type: [trackSchema],
      required,
    },
  },
  {
    timestamps: {
      createAt: 'created_at',
    },
  },
);

export default trialSchema;
