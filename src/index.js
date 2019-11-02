import { GraphQLServer } from "graphql-yoga";

// Type definitions (schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return "Hello from GraphQL!";
    },
    name() {
      return "Aden Herold";
    },
    location() {
      return "Darwin, NT";
    },
    bio() {
      return "I am a software developer living and working in the Northern Territory.";
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("GraphQL server is running");
});
