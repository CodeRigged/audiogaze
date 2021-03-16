import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

const {
  PORT = /* default PORT */ "3000",
  ENDPOINT = /* default endpoint */ "/",
} = process.env;

const config = {
  PORT,
  ENDPOINT,
};

export { config };
