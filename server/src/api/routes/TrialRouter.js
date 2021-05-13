import {Router} from 'express';
import EyetrackerController from '../controllers/EyetrackerController';
import TrialController from '../controllers/TrialController';
/**
 * Trial router.
 */
const TrialRouter = Router();
/**
 * {URI}/trials methods
 *
 * @get Get all trials.
 * @post Adds new trial.
 */
TrialRouter.route('/')
  .get(TrialController.getTrials)
  .post(TrialController.addTrial);
/**
 * {URI}/trials/:id methods
 *
 * @get Get trial matching id parameter.
 * @put Updates trial matching id paramter (synchronization of data from client and eyetracker).
 * @delete Deletes trial matching id parameter
 */
TrialRouter.route('/:id')
  .get(TrialController.getTrialById)
  .put(EyetrackerController.loadData, TrialController.syncData)
  .delete(TrialController.removeTrial);
/**
 * {URI}/trials/:id/results methods
 *
 * @get Get results matching trial id parameter.
 */
TrialRouter.route('/:id/results').get(TrialController.getTrialResults);

export default TrialRouter;
