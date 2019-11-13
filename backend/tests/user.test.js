import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import prisma from "../src/prisma";

const client = new ApolloBoost({
  uri: "http://localhost:4000"
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
