import express from 'express';
import middleware from './middleware/server.start';
import mongoose from 'mongoose';
import config from './config';
import api from './api';

const app = express(); // express app
const port = config.PORT; // default port to listen

/**
 * Establish connection to database
 */
mongoose.connect(config.DB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

/* initialize database */
const db = mongoose.connection;

/* action which will execute if connection to database results in an error */
db.on('error', console.error.bind(console, 'connection error:'));

/* action which will execute on successful connection to database */
db.once('open', () => console.log('Connected to database.'));

/* register your middleware functions */
app.use(express.static('public'));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true}));

app.use(middleware.timeLog);
app.use(middleware.accessControl);

// middleware registered

/* register your API */
app.use(config.ENDPOINT, api);

/* starts the server */
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

/* action which will execute if server is stopped through Ctrl+C keyboard input */
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  process.exit(1);
});
