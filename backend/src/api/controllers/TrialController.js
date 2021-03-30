import TrialService from '../services/TrialService';

const trialService = new TrialService();

/** @type {import('express').RequestHandler} */
const addTrial = async (req, res) => {
  // TODO: finish addTrial function
  const trial = trialService.parseInput(req.body.trial);
  try {
    await trialService.add(trial);
    res.json(await trialService.getAll());
  } catch (e) {
    res.sendStatus(500);
  }
};
/** @type {import('express').RequestHandler} */
const getTrials = async (req, res) => {
  // TODO: finish getAllTrials function
  res.json(await trialService.getAll());
};

export default {addTrial, getTrials};
