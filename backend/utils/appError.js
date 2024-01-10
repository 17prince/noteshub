const { GraphQLError } = require("graphql");

class AppError extends GraphQLError {
  constructor(message, extensions = {}) {
    super(message, extensions);

    // Custom properties
    this.extensions = extensions || { code: "INTERNAL_SERVER_ERROR" };
  }
}

module.exports = AppError;
