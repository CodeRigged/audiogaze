import EyetrackerService from '../services/EyetrackerService';

/** @type {import("express").RequestHandler} */
const connectEyetracker = async (req, res) => {
  if (EyetrackerService.connected) {
    res.sendStatus(200);
  } else {
    const connected = await EyetrackerService.connect();

    connected
      .then((success) => {
        res.sendStatus(200);
      })
      .catch((e) => {
        res.sendStatus(503);
      });

    EyetrackerService.listenToDataStream();
  }
};

/** @type {import("express").RequestHandler} */
const getData = async (req, res) => {
  if (EyetrackerService.connected) {
    await res.send(EyetrackerService.data);
    EyetrackerService.disableDataStream();
  } else {
    res.sendStatus(503);
  }
};

export default {connectEyetracker, getData};
