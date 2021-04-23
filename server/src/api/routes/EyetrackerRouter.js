import {Router} from 'express';
import EyetrackerController from '../controllers/EyetrackerController';

/**
 * Gazepoint eyetracker router.
 */
const GazepointRoute = Router();
/**
 * {URI}/eyetracker/connect methods
 *
 * @get Starts connection with eyetracker.
 */
GazepointRoute.route('/connect').get(EyetrackerController.connectEyetracker);
/**
 * {URI}/eyetracker/data methods
 *
 * @get Gets data collected by eyetracker.
 */
GazepointRoute.route('/data').get(
  EyetrackerController.loadData,
  EyetrackerController.sendData,
);

export default GazepointRoute;
