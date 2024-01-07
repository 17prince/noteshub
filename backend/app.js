const express = require("express");
// // To integrate the graphql with eixsisting server, use apollo-server-express (or other dedicated package)
// // and it creates an apollo server instance
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { createServer } = require("node:http");
const { connectDatabase } = require("./dbConfig");
const dotenv = require("dotenv");

const { typeDefs, resolvers } = require("./schema/graphqlSchema");

dotenv.config({ path: `${__dirname}/../config.env` });

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
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  // Starting apollo server
  await server.start();

  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: "/",
  });

  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 2001 }, resolve));

  console.log(`🚀 Server ready at http://localhost:2001${server.graphqlPath}`);
}

startServer(typeDefs, resolvers);
