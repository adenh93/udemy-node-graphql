import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import getClient from "./utils/getClient";
import seedDatabase from "./utils/seedDatabase";

const client = getClient();

beforeEach(seedDatabase);

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
