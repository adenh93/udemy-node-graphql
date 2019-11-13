import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import seedDatabase from "./utils/seedDatabase";

const client = new ApolloBoost({
  uri: "http://localhost:4000"
});

beforeEach(seedDatabase);

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
