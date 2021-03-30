import {Router} from 'express';
import TrialController from '../controllers/TrialController';

const TrialRouter = Router();

TrialRouter.route('/')
  .get(TrialController.getTrials)
  .post(TrialController.addTrial);
TrialRouter.route('/:id').get(TrialController.getTrialById);

export default TrialRouter;
