import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

// variables read from .env.local-file
const {
  PORT = /* default PORT */ '3000',
  ENDPOINT = /* default endpoint */ '/api/v1',
  HOST = /* default host */ '127.0.0.1',
  GAZEPOINT_PORT = /* default gazepoint port */ '4242',
  DB_NAME /* change name in environment file */,
  DB_URI = `mongodb://${HOST}/${DB_NAME}`,
} = process.env;

// config variables of our application
const config = Object.freeze({
  PORT,
  ENDPOINT,
  HOST,
  GAZEPOINT_PORT,
  DB_NAME,
  DB_URI,
});

export default config;
