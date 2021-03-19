import TrialService from '../services/TrialService';

const trialService = new TrialService();

/** @type {import('express').RequestHandler} */
const addTrial = async (req, res) => {
  // TODO: finish addTrial function
  const trial = req.body.trial;
  await trialService.add(trial);
  res.json(trial);
};
/** @type {import('express').RequestHandler} */
const getTrials = async (req, res) => {
  // TODO: finish getAllTrials function
  res.json(await trialService.getAll());
};

export default {addTrial, getTrials};
