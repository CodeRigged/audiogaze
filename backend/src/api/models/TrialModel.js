import mongoose from 'mongoose';

const required = true;

const trialSchema = new mongoose.Schema({
  name: {
    type: String,
    required,
  },
});

export default trialSchema;
