import TrialService from '../services/TrialService';

/** @type {import('express').RequestHandler} */
const addTrial = async (req, res) => {
  try {
    const trial = TrialService.parseInput(req.body.trial);
    await TrialService.add(trial);
    res.json(await TrialService.getAll());
  } catch (e) {
    res.sendStatus(500);
  }
};

/** @type {import('express').RequestHandler} */
const getTrialById = async (req, res) => {
  res.json(await TrialService.getById(req.params.id));
};

/** @type {import('express').RequestHandler} */
const getTrials = async (req, res) => {
  res.json(await TrialService.getAll());
};

export default {addTrial, getTrials, getTrialById};
