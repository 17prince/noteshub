const { unwrapResolverError } = require("@apollo/server/errors");
const { GraphQLError } = require("graphql");
const { JsonWebTokenError } = require("jsonwebtoken");
const AppError = require("../utils/appError");

// Handle Validation error
const handleValidationError = (stacktrace) => {
  return new AppError(
    "Your query doesn't match the schema. Try double-checking it!",
    {
      code: "GRAPHQL_VALIDATION_FAILED",
      stacktrace,
    }
  );
};

// Handle bad user input
const handleBadUserInputError = () => {
  return new AppError("Invalid value for a field argument !", {
    code: "BAD_USER_INPUT",
  });
};

// Handle resolver resolution error
const handleResolutionError = () => {
  return new AppError(
    "Could not resolve the resolver operation. Please specify the operaton name",
    { code: "OPERATION_RESOLUTION_FAILURE" }
  );
};

// Handle bad request error
const handleBadRequest = () => {
  return new AppError("Bad request, could not parse your query !", {
    code: "BAD_REQUEST",
  });
};

// Handle Internal server error
const handleInternalError = () => {
  return new AppError("Internal server error, please try after sometime !", {
    code: "INTERNAL_SERVER_ERROR",
  });
};

// Handle jwt token expired
const handleJWTExpiredError = () => {
  return new AppError("Your JWT token has expired, please login again", {
    code: "TokenExpiredError",
  });
};

// Handle invalid token error
const handleJWTTokenError = () => {
  return new AppError("Invalid token, please login again !", {
    code: "JsonWebTokenError",
  });
};

// Handle DB connection error (URI)
const handleURIConnectionError = () => {
  return process.env.NODE_ENV === "production"
    ? new AppError("Internal Server Error !")
    : new AppError("Invalid DB connection URI !", { code: "MongoParseError" });
};

// Handle castError
const handleCastError = (args) => {
  return new AppError("Cast to object faild for some value !", {
    code: "CastError",
    argumentName: args,
  });
};

// Handle duplicate key error
const handleDuplicateError = (key) => {
  return new AppError("Duplicate key: Key aready exist.", {
    code: "DUPLICATE_KEY_ERROR",
    argumentName: key,
  });
};
module.exports = (formattedError, error) => {
  if (formattedError instanceof GraphQLError) {
    console.log(formattedError);
    if (formattedError.extensions.code === "GRAPHQL_VALIDATION_FAILED")
      return handleValidationError(formattedError.extensions.stacktrace);

    if (formattedError.extensions?.code === "BAD_USER_INPUT")
      return handleBadUserInputError();

    if (formattedError.extensions?.code === "OPERATION_RESOLUTION_FAILURE")
      return handleResolutionError();

    if (formattedError.extensions?.code === "BAD_REQUEST")
      return handleBadRequest();

    if (formattedError.extensions?.code === "INTERNAL_SERVER_ERROR")
      return handleInternalError();

    return { ...formattedError };
  } else if (unwrapResolverError(error) instanceof Error) {
    const err = error.originalError;
    console.log(err);
    if (err.name === "TokenExpiredError") return handleJWTExpiredError();

    if (err.name === "JsonWebTokenError") return handleJWTTokenError();

    if (err.name === "MongoParseError") return handleURIConnectionError();

    if (err.name === "CastError")
      return handleCastError({ path: err.path, value: err.value });

    if (err.name === "MongoServerError" && err.code === 11000)
      return handleDuplicateError(err.keyValue);

    return error;
  }
};
