import mongoose from 'mongoose';

const required = true;

const timeRangeSchema = new mongoose.Schema({
  from: Number,
  to: Number,
});

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

const trackSchema = new mongoose.Schema({
  number: {
    type: Number,
    required,
  },
  image: {
    type: Buffer,
    contentType: String,
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
