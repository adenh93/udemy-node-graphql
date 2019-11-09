import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import * as resolvers from "./resolvers";
import prisma from "./prisma";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    ...resolvers
  },
  context(request) {
    return {
      prisma,
      request
    };
  }
});

server.start(() => {
  console.log("GraphQL server is running");
});
