import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

const {
  PORT = /* default PORT */ '3000',
  ENDPOINT = /* default endpoint */ '/',
  HOST = /* default host */ '127.0.0.1',
  GAZEPOINT_PORT = /* default gazepoint port */ '4242',
  DB_NAME /* change name in  */,
} = process.env;

const config = Object.freeze({
  PORT,
  ENDPOINT,
  HOST,
  GAZEPOINT_PORT,
  DB_NAME,
});

export default config;
