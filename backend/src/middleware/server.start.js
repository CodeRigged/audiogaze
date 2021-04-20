// logs message when an API call is made including current time
const timeLog = (req, res, next) => {
  console.log(`API call to ${req.originalUrl} at ${new Date()}`);
  next();
};

// sets headers of response
const accessControl = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
};

export default {timeLog, accessControl};
