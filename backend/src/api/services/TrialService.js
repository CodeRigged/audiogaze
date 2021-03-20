import mongoose from 'mongoose';
import trialModel from '../models/TrialModel';

const Trial = mongoose.model('Trial', trialModel);

export default class TrialService {
  add(service) {
    const newTrial = new Trial(service);
    newTrial.save((err, addedTrial) => {
      err
        ? console.error(err)
        : console.log(`Successfully added new trial : ${addedTrial}`);
    });
  }
  getAll() {
    return Trial.find((err, trials) => {
      err && error(err);
    });
  }
  parseInput(trial) {
    //TODO
    const {name, tracks} = trial;
    const parsedTracks = tracks.map(({image, timeRange, audios}, index) => {
      return {number: index};
    });
    const parsedTrial = {name};
    return parsedTrial;
  }
}
