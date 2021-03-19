import express from 'express';
import middleware from './middleware/server.start';
import mongoose from 'mongoose';
import config from './config';
import api from './api';

const app = express(); // express app
const port = config.PORT; // default port to listen

/* establish connection to local database */
mongoose.connect(`mongodb://${config.HOST}/${config.DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.dropDatabase();
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to database.'));

/* register your middleware functions */
app.use(express.static('/public/'));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true}));

app.use(middleware.timeLog);
app.use(middleware.accessControl);

/* register your API */
app.use(/*optional endpoint: config.ENDPOINT, */ api);

/* starts the server */
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  process.exit(1);
});
