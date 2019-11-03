import { GraphQLServer } from "graphql-yoga";
import { users, posts, comments } from "./dummy-data";

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
    me: User!
    post(id: String!): Post
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments(parent, { query }, ctx, info) {
      if (query) {
        return comments.filter(comment =>
          comment.text.toLowerCase().includes(query.toLowerCase())
        );
      }
      return comments;
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
    },
    comments({ id }, args, ctx, info) {
      return comments.filter(comment => comment.author === id);
    }
  },
  Post: {
    author({ author }, args, ctx, info) {
      return users.find(user => user.id === author);
    },
    comments({ id }, args, ctx, info) {
      return comments.filter(comment => comment.post === id);
    }
  },
  Comment: {
    author({ author }, args, ctx, info) {
      return users.find(user => user.id === author);
    },
    post({ post: postId }, args, ctx, info) {
      return posts.find(post => post.id === postId);
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
