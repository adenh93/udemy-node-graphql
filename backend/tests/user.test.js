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
