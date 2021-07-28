import TrialService from '../services/TrialService';
import {
  ClientErrorCodes,
  ServerErrorCodes,
  SuccessfulCodes,
} from 'more-http-status-codes';

/**
 * @description First the received request is parsed then the add function is called on the trial service.
 *
 * If trial is successfully added, 201 (Created) is sent with updated array of trials, else 400 (Bad Request).
 * Else if an error occurs 400 (Bad request) is sent, with a preventRedirect tag, which tells client to remain on page.
 *
 * @type {import('express').RequestHandler} */
const addTrial = async (req, res) => {
  try {
    // request body is parsed to fit trial schema
    const trial = TrialService.parseInput(req.body.trial);
    // parsed trial is added to database
    const added = await TrialService.add(trial);

    // response sent to client
    added
      ? res.status(SuccessfulCodes.CREATED).json(await TrialService.getAll())
      : res.status(ClientErrorCodes.NOT_FOUND).send({preventRedirect: true});
  } catch (e) {
    // response if an error occurs
    res.status(ClientErrorCodes.BAD_REQUEST).send({preventRedirect: true});
  }
};

/**
 * @description Calls the remove function on the trial service
 *
 * Removes trial corresponding with the id of input parameter.
 *
 * If an error occurs 400 (Bad request) is sent.
 *
 * @type {import('express').RequestHandler} */
const removeTrial = async (req, res) => {
  try {
    // remove trial corresponding to id request parameter
    const removed = TrialService.remove(req.params.id);

    // response sent to client
    removed
      ? res.status(SuccessfulCodes.OK).json(await TrialService.getAll())
      : res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  } catch (e) {
    // response if an error occurs
    res.status(ClientErrorCodes.BAD_REQUEST).send({preventRedirect: true});
  }
};

/**
 * @description Calls the getById function on the trial service and sends matching trial corresponding to input id to client.
 *
 * If no corresponding trial is found, 404 (Not found) is sent.
 * Else if an error occurs 400 (Bad request) is sent.
 *
 * @type {import('express').RequestHandler}
 */
const getTrialById = async (req, res) => {
  try {
    // find trial corresponding to id request parameter
    const trial = await TrialService.getById(req.params.id);

    // response sent to client
    trial
      ? res.status(SuccessfulCodes.OK).json(trial)
      : res.sendStatus(ClientErrorCodes.NOT_FOUND);
  } catch (e) {
    // response if an error occurs
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

/**
 * @description Calls the getResults function on the trial service and sends matching results corresponding to input id to client.
 *
 * If no results are found, 404 (Not found) is sent.
 * Else if an error occurs 400 (Bad request) is sent.
 *
 * @type {import('express').RequestHandler}
 */
const getTrialResults = async (req, res) => {
  try {
    const {limit, skip} = req.query;
    // find trial corresponding to id request parameter
    const results = await TrialService.getResults(req.params.id, skip, limit);
    const slicedResults = results.results.slice(skip, skip + limit);
    // response sent to client
    results
      ? res.status(SuccessfulCodes.OK).json(slicedResults)
      : res.sendStatus(ClientErrorCodes.NOT_FOUND);
  } catch (e) {
    // response if an error occurs
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};
/**
 * @description Calls the getAll function on the trial service and sends corresponding data to client.
 *
 * If an error occurs 400 (Bad request) is sent.
 *
 * @type {import('express').RequestHandler}
 */
const getTrials = async (req, res) => {
  try {
    res.json(await TrialService.getAll());
  } catch (error) {
    res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

/**
 * @description This function synchronizes data collected by eyetracker with (trial) results received from client.
 *
 * @type {import('express').RequestHandler}
 */
const syncData = async (req, res) => {
  try {
    const id = req.params.id;
    const {clientData, participant} = req.body;
    const eyetrackerData = req.eyetrackerData;
    // Calls the update function on the trial service to synchronize data and update results array
    TrialService.update(id, clientData, eyetrackerData, participant)
      .then((data) => {
        data
          ? res.status(SuccessfulCodes.OK).json(data)
          : res.sendStatus(ServerErrorCodes.INTERNAL_SERVER_ERROR);
      })
      .catch((e) => {
        console.log(e);
        // If an error occurs, 500 (Internal server error) is sent
        res.sendStatus(ServerErrorCodes.INTERNAL_SERVER_ERROR);
      });
  } catch (e) {
    console.log(e);
    // else 400 (Bad request) is sent
    // res.sendStatus(ClientErrorCodes.BAD_REQUEST);
  }
};

export default {
  addTrial,
  removeTrial,
  getTrials,
  getTrialById,
  syncData,
  getTrialResults,
};
