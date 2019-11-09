import { GraphQLServer } from "graphql-yoga";
import * as resolvers from "./resolvers";
import prisma from "./prisma";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    ...resolvers
  },
  context: {
    prisma
  }
});

server.start(() => {
  console.log("GraphQL server is running");
});
