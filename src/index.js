import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

let users = [
  {
    id: "1",
    name: "Aden Herold",
    email: "aden.herold1@gmail.com",
    age: 26
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@graphql.com"
  },
  {
    id: "3",
    name: "Joe Bloggs",
    email: "joe.bloggs@graphql.com",
    age: 24
  }
];

let posts = [
  {
    id: "1",
    title: "Why learn GraphQL?",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "Upcoming React features",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    published: false,
    author: "1"
  },
  {
    id: "3",
    title: "Express vs Koa",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    published: true,
    author: "2"
  }
];

let comments = [
  {
    id: "1",
    text: "This is the next thing I need to learn.",
    author: "3",
    post: "1"
  },
  {
    id: "2",
    text: "Interesting seeing how GraphQL stacks up to REST.",
    author: "2",
    post: "1"
  },
  {
    id: "3",
    text: "Sounds great! Looking forward to the future of React!",
    author: "1",
    post: "2"
  },
  {
    id: "4",
    text: "Interesting. I might have to give Koa a spin some time.",
    author: "1",
    post: "3"
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
    me: User!
    post(id: String!): Post
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
  Mutation: {
    createUser(parent, { data }, ctx, info) {
      const emailTaken = users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email is already taken!");
      }

      const user = { id: uuidv4(), ...data };
      users.push(user);

      return user;
    },
    deleteUser(parent, { id }, ctx, info) {
      const user = users.find(user => user.id === id);

      if (!user) {
        throw new Error("User not found!");
      }

      posts = posts.filter(post => {
        comments = comments.filter(comment => comment.post !== post.id);
        return post.author !== id;
      });

      comments = comments.filter(comment => comment.author !== id);
      users = users.filter(user => user.id !== id);

      return user;
    },
    createPost(parent, { data }, ctx, info) {
      const userExists = users.some(user => user.id === data.author);

      if (!userExists) {
        throw new Error("Author not found!");
      }

      const post = { id: uuidv4(), ...data };
      posts.push(post);

      return post;
    },
    deletePost(parent, { id }, ctx, info) {
      const post = posts.find(post => post.id === id);

      if (!post) {
        throw new Error("Post not found!");
      }

      comments = comments.filter(comment => comment.post !== id);
      posts = posts.filter(post => post.id !== id);

      return post;
    },
    createComment(parent, { data }, ctx, info) {
      const userExists = users.some(user => user.id === data.author);

      if (!userExists) {
        throw new Error("Author not found!");
      }

      const postExists = posts.find(
        post => post.id === data.post && post.published
      );

      if (!postExists) {
        throw new Error("Post not found!");
      }

      const comment = { id: uuidv4(), ...data };
      comments.push(comment);

      return comment;
    },
    deleteComment(parent, { id }, ctx, info) {
      const comment = comments.find(comment => comment.id === id);

      if (!comment) {
        throw new Error("Comment not found!");
      }

      comments = comments.filter(comment => comment.id !== id);

      return comment;
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
