import {Router} from 'express';
import EyetrackerController from '../controllers/EyetrackerController';
import TrialController from '../controllers/TrialController';

const TrialRouter = Router();

TrialRouter.route('/')
  .get(TrialController.getTrials)
  .post(TrialController.addTrial);
TrialRouter.route('/:id')
  .get(TrialController.getTrialById)
  .put(EyetrackerController.loadData, TrialController.syncData);

export default TrialRouter;
