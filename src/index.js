import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import db from "./db";

// Resolvers
const resolvers = {
  Query: {
    users(parent, { query }, { db }, info) {
      if (query) {
        return db.users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      return db.users;
    },
    posts(parent, { query }, { db }, info) {
      if (query) {
        return db.posts.filter(
          post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );
      }
      return db.posts;
    },
    comments(parent, { query }, { db }, info) {
      if (query) {
        return db.comments.filter(comment =>
          comment.text.toLowerCase().includes(query.toLowerCase())
        );
      }
      return db.comments;
    },
    me(parent, args, { db }, info) {
      return db.users[0];
    },
    post(parent, { id }, { db }, info) {
      return db.posts.find(post => post.id === id);
    }
  },
  Mutation: {
    createUser(parent, { data }, { db }, info) {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email is already taken!");
      }

      const user = { id: uuidv4(), ...data };
      db.users.push(user);

      return user;
    },
    deleteUser(parent, { id }, { db }, info) {
      const user = db.users.find(user => user.id === id);

      if (!user) {
        throw new Error("User not found!");
      }

      db.posts = db.posts.filter(post => {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
        return post.author !== id;
      });

      db.comments = db.comments.filter(comment => comment.author !== id);
      db.users = db.users.filter(user => user.id !== id);

      return user;
    },
    createPost(parent, { data }, { db }, info) {
      const userExists = db.users.some(user => user.id === data.author);

      if (!userExists) {
        throw new Error("Author not found!");
      }

      const post = { id: uuidv4(), ...data };
      db.posts.push(post);

      return post;
    },
    deletePost(parent, { id }, { db }, info) {
      const post = db.posts.find(post => post.id === id);

      if (!post) {
        throw new Error("Post not found!");
      }

      db.comments = db.comments.filter(comment => comment.post !== id);
      db.posts = db.posts.filter(post => post.id !== id);

      return post;
    },
    createComment(parent, { data }, { db }, info) {
      const userExists = db.users.some(user => user.id === data.author);

      if (!userExists) {
        throw new Error("Author not found!");
      }

      const postExists = db.posts.find(
        post => post.id === data.post && post.published
      );

      if (!postExists) {
        throw new Error("Post not found!");
      }

      const comment = { id: uuidv4(), ...data };
      db.comments.push(comment);

      return comment;
    },
    deleteComment(parent, { id }, { db }, info) {
      const comment = db.comments.find(comment => comment.id === id);

      if (!comment) {
        throw new Error("Comment not found!");
      }

      db.comments = db.comments.filter(comment => comment.id !== id);

      return comment;
    }
  },
  User: {
    posts({ id }, args, { db }, info) {
      return db.posts.filter(post => post.author === id);
    },
    comments({ id }, args, { db }, info) {
      return db.comments.filter(comment => comment.author === id);
    }
  },
  Post: {
    author({ author }, args, { db }, info) {
      return db.users.find(user => user.id === author);
    },
    comments({ id }, args, { db }, info) {
      return db.comments.filter(comment => comment.post === id);
    }
  },
  Comment: {
    author({ author }, args, { db }, info) {
      return db.users.find(user => user.id === author);
    },
    post({ post: postId }, args, { db }, info) {
      return db.posts.find(post => post.id === postId);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db
  }
});

server.start(() => {
  console.log("GraphQL server is running");
});
