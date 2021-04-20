import express from 'express';
import GazepointRoute from './routes/EyetrackerRouter';
import TrialRouter from './routes/TrialRouter';

// the api of our application
const api = express();

// defines routes of api
api.use('/eyetracker', GazepointRoute);
api.use('/trials', TrialRouter);

export default api;
