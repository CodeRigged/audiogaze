import {ServerErrorCodes, SuccessfulCodes} from 'more-http-status-codes';
import {xml2js} from 'xml-js';
import EyetrackerService from '../services/EyetrackerService';

/**
 * @description Check if eyetracker service is connected. If it already is connected, 200 (Ok) is sent.
 *
 * If not, attempt to connect to service. If connection fails, 503 (Service unavailable) is sent.
 *
 * On successful connection, 200 (Ok) is sent and eyetracker service starts listening to data stream.
 * @type {import("express").RequestHandler}
 */
const connectEyetracker = async (req, res) => {
  if (EyetrackerService.connected) {
    res.sendStatus(SuccessfulCodes.OK);
  } else {
    EyetrackerService.connect()
      .then((success) => {
        // response if connection is successful
        res.sendStatus(SuccessfulCodes.OK);
        // eyetracker starts collecting incoming data stream
        EyetrackerService.listenToDataStream();
      })
      .catch((e) => {
        // response if an error occurs
        res.sendStatus(ServerErrorCodes.SERVICE_UNAVAILABLE);
      });
  }
};

/**
 * @description Check if eyetracker service is connected. If it already is disconnected, 200 (Ok) is sent.
 *
 * If not, attempt to disconnect service. Send 200 (Ok) if disconnection is successful.
 * If disconnection fails, 500 (Internal Server Error) is sent.
 * @type {import("express").RequestHandler}
 */
const disconnectEyetracker = async (req, res) => {
  if (!EyetrackerService.connected) {
    res.sendStatus(SuccessfulCodes.OK);
  } else {
    EyetrackerService.disconnect()
      .then((success) => {
        // response if disconnection is successful
        res.sendStatus(SuccessfulCodes.OK);
      })
      .catch((e) => {
        // response if an error occurs
        res.sendStatus(ServerErrorCodes.INTERNAL_SERVER_ERROR);
      });
  }
};

/**
 * @description Check if eyetracker service is connected.
 *
 * If it is, the eyetracker data is mapped to JSON-format and the eyetracker service disables the incoming data stream.
 * The mapped data is then added to request and the next function is called.
 *
 * Else, if the eyetracker is disconnected, 503 (Service unavailable) is sent.
 *
 * @disclaimer Function should be used as middleware.
 *
 * @type {import("express").RequestHandler}
 */
const loadData = async (req, res, next) => {
  if (EyetrackerService.connected) {
    // collected data is mapped to JSON and added to request
    req.eyetrackerData = EyetrackerService.data.map((element) => {
      element.data = xml2js(element.data, {compact: true});
      return element;
    });
    // continue
    next();
    // eyetracker stops collecting incoming data stream
    await EyetrackerService.disconnect();
  } else {
    // response if service is disconnected
    res.sendStatus(ServerErrorCodes.SERVICE_UNAVAILABLE);
  }
};

/**
 * Function which sends collected data from eyetracker
 *
 * @disclaimer For testing purposes
 * @type {import("express").RequestHandler}
 */
const sendData = async (req, res) => {
  try {
    // collected eyetracker data is sent to client
    res.json(req.eyetrackerData);
  } catch (error) {
    // response if an error occurs
    res.sendStatus(ServerErrorCodes.SERVICE_UNAVAILABLE);
  }
};

export default {connectEyetracker, disconnectEyetracker, loadData, sendData};
