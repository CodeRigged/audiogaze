import {Router} from 'express';
import EyetrackerController from '../controllers/EyetrackerController';

const GazepointRoute = Router();

GazepointRoute.route('/connect').get(EyetrackerController.connectEyetracker);
GazepointRoute.route('/data').get(
  EyetrackerController.loadData,
  EyetrackerController.sendData,
);

export default GazepointRoute;
