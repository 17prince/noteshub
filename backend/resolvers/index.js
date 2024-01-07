const { queryResolver } = require("./queryResolver");
const { mutationResolver } = require("./mutationResolver");

exports.resolvers = {
  Query: queryResolver,
  Mutation: mutationResolver,
};
