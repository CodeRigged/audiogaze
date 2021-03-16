/* standard middleware which you are free to use or not for your project */
const timeLog = (req, res, next) => {
  console.log(`API call to ${req.originalUrl} at ${new Date()}`);
  next();
};

const accessControl = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
};

export default { timeLog, accessControl };
