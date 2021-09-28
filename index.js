import {
  ApolloServer,
  ApolloServerPluginStopHapiServer,
} from "apollo-server-hapi";
import hapi from "@hapi/hapi";
import mongoose from "mongoose";
import { definitions } from "./definitions/definitions.js";
import { resolvers } from "./resolvers/resolvers.js";
import inert from "@hapi/inert";
import { DB_URI, DB_CONFIG, PORT } from "./config.js";

const startApolloServer = async (typeDefs, resolvers) => {
  const app = hapi.server({
    port: PORT,
  });
  await app.register(inert);
  app.route({
    method: "GET",
    path: "/images/{link*}",
    handler: function (request, h) {
      return h.file(`images/${request.params.link}`);
    },
  });
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginStopHapiServer({ hapiServer: app })],
  });
  await mongoose.connect(DB_URI, DB_CONFIG);
  await server.start();
  await server.applyMiddleware({ app });
  await app.start();
};

startApolloServer(definitions, resolvers);
