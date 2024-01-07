const express = require("express");
const cors = require("cors");
// // To integrate the graphql with eixsisting server, use apollo-server-express (or other dedicated package)
// // and it creates an apollo server instance
const { ApolloServer } = require("@apollo/server");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { expressMiddleware } = require("@apollo/server/express4");
const { createServer } = require("node:http");
const dotenv = require("dotenv");

// Database
const { connectDatabase } = require("./dbConfig");

// GraphQL
const { typeDefs } = require("./schema/graphqlSchema");
const { resolvers } = require("./resolvers/index");
const { context } = require("./context");

dotenv.config({ path: `${__dirname}/config.env` });

const DB_URI = process.env.DATABASE.replace(
  /<PASSWORD>/,
  process.env.DATABASE_PASSWORD
);

// Connect to database
connectDatabase(DB_URI);

const app = express();

// // Creating server using http
const httpServer = createServer(app);

async function startServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    status400ForVariableCoercionErrors: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  // Starting apollo server
  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => context(req),
    })
  );

  httpServer.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/`);
  });
}

startServer(typeDefs, resolvers);
