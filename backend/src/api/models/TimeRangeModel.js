import mongoose from 'mongoose';

const required = true;

const timeRangeSchema = new mongoose.Schema({
  from: {type: Number, required},
  to: {type: Number, required},
});

export default timeRangeSchema;
