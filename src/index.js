import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import * as resolvers from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    ...resolvers
  },
  context: {
    db
  }
});

server.start(() => {
  console.log("GraphQL server is running");
});
