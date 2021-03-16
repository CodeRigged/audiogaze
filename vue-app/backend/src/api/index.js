import express from "express";
const api = express();

/* register your routes here */
// api.use('/some/endpoint', /* router */)

/* define a route handler for the default home page */
api.get("/", (req, res) => {
  res.send("Have fun coding!");
});
export default api;
