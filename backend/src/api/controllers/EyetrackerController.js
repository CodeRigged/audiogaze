import EyetrackerService from '../services/EyetrackerService';

/** @type {import("express").RequestHandler} */
const connectToServer = async (req, res) => {
  // TODO: finish connectToServer function
  const service = new EyetrackerService();

  const connected = service.connectToEyeTracker();
  // service.listenToDataStream();
  // console.log(success);
  connected
    .then((success) => {
      res.sendStatus(200);
    })
    .catch((e) => {
      res.sendStatus(502);
    });
  service.listenToDataStream();
};

export default {connectToServer};
