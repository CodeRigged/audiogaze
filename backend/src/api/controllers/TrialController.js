import TrialService from '../services/TrialService';
import {
  ClientErrorCodes,
  ServerErrorCodes,
  SuccessfulCodes,
} from 'more-http-status-codes';

/** @type {import('express').RequestHandler} */
const addTrial = async (req, res) => {
  try {
    const trial = TrialService.parseInput(req.body.trial);
    const added = await TrialService.add(trial);
    added &&
      res.status(SuccessfulCodes.CREATED).json(await TrialService.getAll());
  } catch (e) {
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

/** @type {import('express').RequestHandler} */
const getTrialById = async (req, res) => {
  try {
    const trial = await TrialService.getById(req.params.id);
    if (trial) {
      res.status(SuccessfulCodes.OK).json(trial);
    } else {
      res.sendStatus(ClientErrorCodes.NOT_FOUND);
    }
  } catch (e) {
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

/** @type {import('express').RequestHandler} */
const getTrials = async (req, res) => {
  try {
    res.json(await TrialService.getAll());
  } catch (error) {
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

/** @type {import('express').RequestHandler} */
const syncData = async (req, res) => {
  try {
    const id = req.params.id;
    /**  @type {Array} */
    const clientData = req.body;
    // clientData.sort((x, y) => x.timestamp - y.timestamp);
    /**  @type {Array} */
    const eyetrackerData = req.eyetrackerData;
    var results = [];

    const startTime = clientData[0].timestamp;
    for (let index = 0; index < clientData.length; index++) {
      const {type, src: imgSrc, timestamp: imgStartTime, started} = clientData[
        index++
      ];
      if (started && type === 'img') {
        let dataRecordStartIndex = eyetrackerData.findIndex(
          (data) => data.timestamp > imgStartTime,
        );

        let endItem = clientData.find(
          (item) => imgSrc === item.src && !item.started && item.type === 'img',
        );

        let dataRecordEndIndex = eyetrackerData.findIndex(
          (data) => data.timestamp > endItem.timestamp,
        );

        /*       const dataRecordStartTime =
          eyetrackerData[dataRecordStartIndex].timestamp; */

        for (
          dataRecordStartIndex;
          dataRecordStartIndex < dataRecordEndIndex;
          dataRecordStartIndex++
        ) {
          const {data, timestamp: eyetrackerTime} = eyetrackerData[
            dataRecordStartIndex
          ];
          const eyetrackerAttributes = data.REC._attributes;
          const timestamp =
            eyetrackerTime /* + dataRecordStartTime - imgStartTime */ -
            startTime;

          results.push({
            imgSrc,
            timestamp,
            ...eyetrackerAttributes,
          });
        }
      }
    }
    for (let index = 0; index < clientData.length; index++) {
      const {
        type,
        src: audioSrc,
        timestamp: audioStartTime,
        started,
      } = clientData[index];
      if (started && type === 'audio') {
        let audioEndTime = clientData.find(
          (item) =>
            audioSrc === item.src && !item.started && item.type === 'audio',
        ).timestamp;

        let audioEndIndex = clientData.findIndex(
          (item) =>
            audioSrc === item.src && !item.started && item.type === 'audio',
        );
        index = audioEndIndex + 1;

        results = results.map((value) => {
          if (value.audioSrc) {
            return value;
          }
          const timestamp = value.timestamp;
          if (
            audioStartTime - startTime <= timestamp &&
            timestamp <= audioEndTime - startTime
          ) {
            value.audioSrc = audioSrc;
          } else {
            value.audioSrc = null;
          }
          // console.log(value);
          return value;
        });
      }
    }
    TrialService.update(id, results)
      .then((success) => {
        res.status(SuccessfulCodes.OK).send('Data successfully synchronized.');
      })
      .catch((e) => {
        res.sendStatus(ServerErrorCodes.INTERNAL_SERVER_ERROR);
      });
  } catch (e) {
    console.log(e);
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

export default {addTrial, getTrials, getTrialById, syncData};
