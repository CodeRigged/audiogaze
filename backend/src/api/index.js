import express from 'express';
import GazepointRoute from './routes/EyetrackerRouter';
import TrialRouter from './routes/TrialRouter';

const api = express();

/* defines routes */
api.use('/gazepoint', GazepointRoute);
api.use('/trials', TrialRouter);

export default api;
