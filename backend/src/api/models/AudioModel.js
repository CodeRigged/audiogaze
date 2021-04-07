import mongoose from 'mongoose';
import timeRangeSchema from './TimeRangeModel';

const required = true;

const audioSchema = new mongoose.Schema({
  number: {
    type: Number,
    required,
  },
  audioPath: {
    type: String,
    required,
  },
  timeRange: {
    type: timeRangeSchema,
    required,
  },
  channels: {
    type: [Number],
    required,
  },
});

export default audioSchema;
