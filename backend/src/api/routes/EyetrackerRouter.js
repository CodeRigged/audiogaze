import net from 'net';
import {Router} from 'express';
import EyetrackerController from '../controllers/EyetrackerController';

const GazepointRoute = Router();

const client = new net.Socket();
client.setEncoding('utf-8');

GazepointRoute.route('/start').get(EyetrackerController.connectToServer);

export default GazepointRoute;
