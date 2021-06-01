import mongoose from 'mongoose';

const required = true;

/**
 * Schema of single data record from eyetracker.
 */
const singleRecord = new mongoose.Schema({
  group: {
    type: Number,
    required,
  },
  FPOGD: {
    type: String,
    required,
  },
  FPOGID: {
    type: String,
    required,
  },
  FPOGS: {
    type: String,
    required,
  },
  FPOGV: {
    type: String,
    required,
  },
  FPOGX: {
    type: String,
    required,
  },
  FPOGY: {
    type: String,
    required,
  },
  LPMM: {
    type: String,
    required,
  },
  LPMMV: {
    type: String,
    required,
  },
  LPOGV: {
    type: String,
    required,
  },
  LPOGX: {
    type: String,
    required,
  },
  LPOGY: {
    type: String,
    required,
  },
  RPMM: {
    type: String,
    required,
  },
  RPMMV: {
    type: String,
    required,
  },
  RPOGV: {
    type: String,
    required,
  },
  RPOGX: {
    type: String,
    required,
  },
  RPOGY: {
    type: String,
    required,
  },
  audioSrc: {
    type: String,
  },
  imgSrc: {
    type: String,
    required,
  },
  channels: {
    type: String,
    required,
  },
  timestamp: {
    type: Number,
    required,
  },
});
/**
 * Schema of all collected data from eyetracker.
 */
const recordsSchema = new mongoose.Schema(
  {
    participant: {
      type: String,
      required,
    },
    data: [{type: singleRecord, immutable: true}],
  },
  {
    timestamps: {takenAt: 'created_at'},
  },
);

export default recordsSchema;
