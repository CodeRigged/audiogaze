import TrialService from '../services/TrialService';
import {ClientErrorCodes, SuccessfulCodes} from 'more-http-status-codes';

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
    /**  @type {Array} */
    const clientData = req.body;
    clientData.sort((x, y) => y.timestamp - x.timestamp);
    /**  @type {Array} */
    const eyetrackerData = req.eyetrackerData;

    const results = [];

    for (let index = 0; index < clientData.length; index++) {
      const {type, src, timestamp: startTime, started} = clientData[index];
      if (started && type === 'img') {
        const endItem = clientData.find(
          (item) => item.src === src && !item.started,
        );

        console.log();

        var startIndex =
          eyetrackerData.findIndex((data) => data.timestamp > startTime) - 1;
        const endIndex =
          eyetrackerData.findIndex(
            (data) => data.timestamp > endItem.timestamp,
          ) - 1;

        for (startIndex; startIndex < endIndex; startIndex++) {
          const {data, timestamp: eyetrackerTime} = eyetrackerData[startIndex];
          const eyetrackerAttributes = data.REC._attributes;
          results.push({
            src,
            timestamp: endItem.timestamp - eyetrackerTime,
            ...eyetrackerAttributes,
          });
        }
      }
    }
    res.send(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

export default {addTrial, getTrials, getTrialById, syncData};
