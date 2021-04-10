import {
  InformationalCodes,
  ServerErrorCodes,
  SuccessfulCodes,
} from 'more-http-status-codes';
import {xml2js} from 'xml-js';
import EyetrackerService from '../services/EyetrackerService';

/** @type {import("express").RequestHandler} */
const connectEyetracker = async (req, res) => {
  if (EyetrackerService.connected) {
    res.sendStatus(SuccessfulCodes.OK);
  } else {
    EyetrackerService.connect()
      .then((success) => {
        res.sendStatus(SuccessfulCodes.OK);
        EyetrackerService.listenToDataStream();
      })
      .catch((e) => {
        res.sendStatus(ServerErrorCodes.SERVICE_UNAVAILABLE);
      });
  }
};

/** @type {import("express").RequestHandler} */
const loadData = async (req, res, next) => {
  if (EyetrackerService.connected) {
    req.eyetrackerData = EyetrackerService.data.map((element) => {
      element.data = xml2js(element.data, {compact: true});
      return element;
    });
    next();
    EyetrackerService.disableDataStream();
  } else {
    res.sendStatus(ServerErrorCodes.SERVICE_UNAVAILABLE);
  }
};

/** @type {import("express").RequestHandler} */
const sendData = async (req, res) => {
  try {
    res.json(req.eyetrackerData);
  } catch (error) {
    res.sendStatus(ServerErrorCodes.SERVICE_UNAVAILABLE);
  }
};

export default {connectEyetracker, loadData, sendData};
