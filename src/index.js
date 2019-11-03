import { GraphQLServer } from "graphql-yoga";
import { users, posts } from "./dummy-data";

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post(id: String!): Post
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, { query }, ctx, info) {
      if (query) {
        return users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      return users;
    },
    posts(parent, { query }, ctx, info) {
      if (query) {
        return posts.filter(
          post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );
      }
      return posts;
    },
    me() {
      return users[0];
    },
    post(parent, { id }, ctx, info) {
      return posts.find(post => post.id === id);
    }
  },
  User: {
    posts({ id }, args, ctx, info) {
      return posts.filter(post => post.author === id);
    }
  },
  Post: {
    author({ author }, args, ctx, info) {
      return users.find(user => user.id === author);
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
