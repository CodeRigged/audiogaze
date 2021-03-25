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
  /**
   * @param {{name: string, tracks: Array}} trial - An object parameter with string and number properties
   */
  parseInput(trial) {
    //TODO
    const {name, tracks} = trial;
    const parsedTracks = tracks.map(({image, timeRange, audios}, index) => {
      return {
        number: index,
        // image: new Buffer(),
        timeRange: convertTimesToMilliseconds(timeRange),
      };
    });

    const duration = parsedTracks[parsedTracks.length - 1].timeRange.to;
    const parsedTrial = {name, duration, tracks: parsedTracks};
    return parsedTrial;
  }
}

function convertTimesToMilliseconds(timeRange) {
  const timeUnit = timeRange.timeUnit;
  delete timeRange.timeUnit;
  switch (timeUnit) {
    case 'ms':
      return timeRange;
    case 's':
      const {from, to} = timeRange;
      return {from: from * 1000, to: to * 1000};
    default:
      return new Error();
  }
}
