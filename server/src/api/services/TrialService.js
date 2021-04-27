import mongoose from 'mongoose';
import trialModel from '../models/TrialModel';

const Trial = mongoose.model('Trial', trialModel);

/**
 * @description Service which handles all related actions made to trials database
 */
class TrialService {
  /**
   * @description Adds new trial to trial model
   *
   * @param {{name:string,duration:number,timestamp: number,tracks: trackModel}} service
   * @returns boolean
   */
  add(service) {
    return new Promise((resolve, reject) => {
      const newTrial = new Trial(service);
      newTrial.save((err, addedTrial) => {
        if (err) {
          console.error(err);
          reject(false);
        } else {
          console.log(`Successfully added new trial : ${addedTrial}`);
          resolve(true);
        }
      });
    });
  }
  /**
   * @description Adds new trial to trial model
   *
   * @param {{name:string,duration:number,timestamp: number,tracks: trackModel}} service
   * @returns boolean
   */
  remove(id) {
    return new Promise((resolve, reject) => {
      Trial.findByIdAndDelete(id, (err) => {
        if (err) {
          console.error(err);
          reject(false);
        } else {
          console.log(`Successfully remove trial with id: ${id}`);
          resolve(true);
        }
      });
    });
  }
  /**
   * @description Synchronizes data collected by eyetracker with (trial) results received from client
   * and updates trial with corresponding id
   *
   * @param {string} id
   * @param {{type: 'img'|'audio', src: string, timestamp: number, channels: string|undefined, started: boolean}[]} clientData - data collected by eyetracker
   * @param {{data:{REC:{_attributes:object}}, timestamp:number}[]} eyetrackerData - data received from client
   * @returns boolean
   */
  update(id, clientData, eyetrackerData) {
    // initialize results array
    var results = [];
    try {
      /**
       * Check startTime of when trial started (client-side).
       * Start time is equals to the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
       *
       * @type {number} startTime
       */
      const startTime = clientData[0].timestamp;
      // loop through clientData array
      for (let index = 0; index < clientData.length; index++) {
        /**
         * object from clientData
         */
        const {
          type,
          src: imgSrc,
          timestamp: imgStartTime,
          started,
        } = clientData[index++];

        if (started && type === 'img') {
          /**
           * Finds the index of entry in eyetrackerData where the timestamp is above the timestamp of clientData entry
           * (when the image started displaying client-side).
           */
          let dataRecordStartIndex = eyetrackerData.findIndex(
            (data) => data.timestamp > imgStartTime,
          );

          /**
           * Finds the entry in clientData where started is equals false (when image stopped displaying client-side)
           * and the image - src is equal to current object from for-loop.
           *
           * Returns timestamp.
           */

          let imgEndTime = clientData.find(
            (item, itemIndex) =>
              imgSrc === item.src &&
              !item.started &&
              item.type === 'img' &&
              itemIndex > index,
          ).timestamp;
          /**
           * Finds the index of entry in eyetrackerData where the timestamp is above the timestamp of clientData entry found above
           * (when the image started displaying client-side).
           */
          let dataRecordEndIndex = eyetrackerData.findIndex(
            (data) => data.timestamp > imgEndTime,
          );
          // loop through eyetrackerData array from given start- to end-index
          for (
            dataRecordStartIndex;
            dataRecordStartIndex < dataRecordEndIndex;
            dataRecordStartIndex++
          ) {
            /**
             * object from eyetrackerData
             */
            const {data, timestamp: eyetrackerTime} = eyetrackerData[
              dataRecordStartIndex
            ];
            // if data has REC attribute, not always the case
            if (data.REC) {
              const eyetrackerAttributes = data.REC._attributes;
              // subtract the start time of when the trial started from  timestamp of the current eyetracker entry
              const timestamp =
                eyetrackerTime /* + dataRecordStartTime - imgStartTime */ -
                startTime;
              // push to results array
              results.push({
                imgSrc,
                timestamp,
                ...eyetrackerAttributes,
              });
            }
          }
        }
      }
      // loop through clientData array a second time
      for (let index = 0; index < clientData.length; index++) {
        const {
          type,
          src: audioSrc,
          channels,
          timestamp: audioStartTime,
          started,
        } = clientData[index];
        if (started && type === 'audio') {
          /**
           * Finds the entry in clientData where started is equals false (when audio started playing client-side)
           * and the audio - src is equal to current object from for-loop.
           *
           * Returns timestamp.
           */
          let audioEndTime = clientData.find(
            (item, itemIndex) =>
              audioSrc === item.src &&
              !item.started &&
              item.type === 'audio' &&
              itemIndex > index,
          );

          // loop through results array to add audioSrc tag
          results = results.map((value) => {
            // skip if value already has an audio src
            if (value.audioSrc) {
              return value;
            }
            const timestamp = value.timestamp;
            if (
              audioStartTime - startTime <= timestamp &&
              timestamp <= audioEndTime.timestamp - startTime
            ) {
              // if audio played during the time where an image was shown, adds corresponding audio - src and channels
              value.audioSrc = audioSrc;
              value.channels = channels.join(', ');
            } else {
              // if audio wasn't played in time frame, set tag to null
              value.audioSrc = null;
              value.channels = null;
            }
            return value;
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, reject) => {
      Trial.findByIdAndUpdate(
        id,
        {
          $push: {
            results: {
              data: results,
            },
          },
        },
        {new: true},
        (err, updatedTrial) => {
          if (err) {
            console.error(err);
            reject(false);
          } else {
            console.log(`Successfully updated trial ${id}: ${updatedTrial}`);
            resolve(true);
          }
        },
      );
    });
  }
  /**
   * @description Find and return trial matching id
   *
   * @param {string} id
   * @returns trial
   */
  getById(id) {
    return Trial.findById(id, (err, trial) => {
      err && error(err);
    });
  }
  /**
   * @description Find and return all trials
   *
   * @returns All trials
   */
  getAll() {
    return Trial.find((err, trials) => {
      err && error(err);
    });
  }
  /**
   * @description Parses trial send by client to suit trial model.
   *
   * @param {{
   *  name: string,
   *  tracks: { imagePath:string, timeRange: {from:number, to:number},
   *  audios: { audioPath:string, channels: {id: number}, timeRange: {from: number, to: number}}[]
   * }[],
   *  channelLimit: number,
   *  timeUnit: 'ms'|'s'
   * }} trial
   *
   * @returns Parsed trial
   */
  parseInput(trial) {
    const {name, tracks, timeUnit, channelLimit} = trial;
    const parsedTracks = tracks.map(({imagePath, timeRange, audios}, index) => {
      const track = {
        number: index,
        imagePath,
        timeRange: convertTimesToMilliseconds(timeRange, timeUnit),
      };
      const validAudios = audios.reduce((output, curVal) => {
        const {audioPath, channels, timeRange} = curVal;
        if (audioPath && channels) {
          curVal.timeRange = convertTimesToMilliseconds(timeRange, timeUnit);
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
      channelLimit,
      tracks: parsedTracks,
    };
    return parsedTrial;
  }
}
/**
 * @description Helper function which converts timeRange to ms
 *
 * @param {{from: number, to: number}} timeRange
 * @param {'ms'|'s'} timeUnit
 * @returns converted timeRange
 */
function convertTimesToMilliseconds(timeRange, timeUnit) {
  switch (timeUnit) {
    case 'ms':
      return timeRange;
    case 's':
      timeRange.from *= 1000;
      timeRange.to *= 1000;
      return timeRange;
    default:
      return new Error();
  }
}
export default new TrialService();
