import {xml2js, xml2json} from 'xml-js';
import EyetrackerService from '../services/EyetrackerService';

/** @type {import("express").RequestHandler} */
const connectEyetracker = async (req, res) => {
  if (EyetrackerService.connected) {
    res.sendStatus(200);
  } else {
    const connected = EyetrackerService.connect();

    connected
      .then((success) => {
        res.sendStatus(200);
        EyetrackerService.listenToDataStream();
      })
      .catch((e) => {
        res.sendStatus(503);
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
    res.sendStatus(503);
  }
};

/** @type {import("express").RequestHandler} */
const sendData = async (req, res) => {
  res.json(req.eyetrackerData);
};

export default {connectEyetracker, loadData, sendData};
