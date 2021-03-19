import {Router} from 'express';
import TrialController from '../controllers/TrialController';

const TrialRouter = Router();

TrialRouter.route('/')
  .get(TrialController.getTrials)
  .post(TrialController.addTrial);

export default TrialRouter;
