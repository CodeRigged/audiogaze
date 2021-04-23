import mongoose from 'mongoose';
import audioSchema from './AudioModel';
import timeRangeSchema from './TimeRangeModel';

const required = true;

/**
 * Track schema.
 */
const trackSchema = new mongoose.Schema({
  number: {
    type: Number,
    required,
  },
  imagePath: {
    type: String,
    required,
  },
  timeRange: {
    type: timeRangeSchema,
    required,
  },
  audios: {
    type: [audioSchema],
  },
});

export default trackSchema;
