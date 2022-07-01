const CustomError = require("../utils/customError");

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";
  error.message = err.message;

  if (error.name === "ValidationError")
    error = new CustomError(error.message, 400);

  if (error.name === "CastError") {
    error = new CustomError(`Invalid ${error.path}:${error.value}!`, 400);
  }

  if (error.name === "JsonWebTokenError") {
    error = new CustomError("Invalid token, please try again.", 401);
  }
  if (error.name === "TokenExpiredError") {
    error = new CustomError("Your token has expired, please login again.", 401);
  }
  if (error.code === 11000) {
    const message = `The ${Object.keys(error.keyValue)}: ${Object.values(
      error.keyValue
    )} already exist, please try another value.`;
    error = new CustomError(message, 400);
  }
  
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};

module.exports = globalErrorHandler;
