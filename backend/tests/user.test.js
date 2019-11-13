import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import hashPassword from "../src/utils/hashPassword";
import prisma from "../src/prisma";

const client = new ApolloBoost({
  uri: "http://localhost:4000"
});

beforeEach(async () => {
  await prisma.mutation.deleteManyUsers();

  const { id } = await prisma.mutation.createUser({
    data: {
      name: "Test User",
      email: "test123@test.com",
      password: await hashPassword("testPassword123")
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Test Post 1",
      body: "Test Body",
      published: true,
      author: {
        connect: {
          id
        }
      }
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Test Post 2",
      body: "Test Body",
      published: false,
      author: {
        connect: {
          id
        }
      }
    }
  });
});

test("Should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Test"
          email: "test@test.com"
          password: "testPassword123"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const { data } = await client.mutate({
    mutation: createUser
  });

  const userExists = await prisma.exists.User({ id: data.createUser.user.id });
  expect(userExists).toBe(true);
});

test("Should expose public author profiles", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const { data } = await client.query({ query: getUsers });

  expect(data.users.length).toBe(1);
  expect(data.users[0].email).toBe(null);
});

test("Should get all published posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        published
      }
    }
  `;

  const { data } = await client.query({ query: getPosts });

  expect(data.posts.length).toBe(1);
  expect(data.posts[0].published).toBe(true);
});

test("Should not allow login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "test123@test.com", password: "somePassword" }) {
        token
        user {
          id
        }
      }
    }
  `;

  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test("Should not allow user to sign up with an invalid password", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Test name"
          email: "test@graphql.test"
          password: "abc123"
        }
      ) {
        token
      }
    }
  `;

  await expect(client.mutate({ mutation: createUser })).rejects.toThrow();
});
