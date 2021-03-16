import express from "express";
import middleware from "./middleware/server.start";
import { config } from "./config";
import api from "./api";

const app = express();

/* register your middleware functions */
app.use(express.static("/public/"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(middleware.timeLog);
app.use(middleware.accessControl);


const port = config.PORT; // default port to listen

/* register your API */
app.use(/*optional endpoint: config.ENDPOINT, */api);

/* starts the server */
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  process.exit(1);
});
