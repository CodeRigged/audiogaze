import mongoose from 'mongoose';
import trialModel from '../models/TrialModel';

const Trial = mongoose.model('Trial', trialModel);

class TrialService {
  add(service) {
    const newTrial = new Trial(service);
    newTrial.save((err, addedTrial) => {
      err
        ? console.error(err)
        : console.log(`Successfully added new trial : ${addedTrial}`);
    });
  }
  getById(id) {
    return Trial.findById(id, (err, trial) => {
      err && error(err);
    });
  }
  getAll() {
    return Trial.find((err, trials) => {
      err && error(err);
    });
  }
  /**
   * @param {{name: string, tracks: Array}} trial
   */
  parseInput(trial) {
    const {name, tracks} = trial;
    const parsedTracks = tracks.map(({imagePath, timeRange, audios}, index) => {
      const track = {
        number: index,
        imagePath,
        timeRange: convertTimesToMilliseconds(timeRange),
      };

      const validAudios = audios.reduce((output, curVal) => {
        const {audioPath, channels, timeRange} = curVal;
        output.timeRange = convertTimesToMilliseconds(timeRange);
        if (audioPath && channels) {
          curVal.channels = channels.map(({id}) => id);
          curVal.number = output.length;
          output.push(curVal);
        }
        return output;
      }, []);

      if (validAudios.length > 0) {
        return {...track, audios: validAudios};
      } else {
        return track;
      }
    });

    const duration = parsedTracks[parsedTracks.length - 1].timeRange.to;
    const parsedTrial = {
      name,
      duration,
      timestamp: Date.now(),
      tracks: parsedTracks,
    };
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
export default new TrialService();
