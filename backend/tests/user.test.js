import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import getClient from "./utils/getClient";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import { createUser, getUsers, login, getProfile } from "./operations";

const client = getClient();

beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const variables = {
    data: {
      name: "Test",
      email: "test@test.com",
      password: "testPassword123"
    }
  };

  const { data } = await client.mutate({
    mutation: createUser,
    variables
  });

  const userExists = await prisma.exists.User({ id: data.createUser.user.id });
  expect(userExists).toBe(true);
});

test("Should expose public author profiles", async () => {
  const { data } = await client.query({ query: getUsers });

  expect(data.users.length).toBe(1);
  expect(data.users[0].email).toBe(null);
});

test("Should not allow login with bad credentials", async () => {
  const variables = {
    data: {
      email: "test123@test.com",
      password: "somePassword"
    }
  };

  await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test("Should not allow user to sign up with an invalid password", async () => {
  const variables = {
    data: {
      name: "Test name",
      email: "test@graphql.test",
      password: "abc123"
    }
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test("Should fetch user profile", async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
