import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import getClient from "./utils/getClient";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";

const client = getClient();

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

test("Should fetch an authenticated user's posts", async () => {
  const client = getClient(userOne.jwt);
  const getPosts = gql`
    query {
      myPosts {
        id
        title
      }
    }
  `;

  const { data } = await client.query({ query: getPosts });
  expect(data.myPosts.length).toBe(2);
});

test("Should be able to update own post", async () => {
  const client = getClient(userOne.jwt);
  const updatePost = gql`
    mutation {
      updatePost(
        id: "${postOne.post.id}"
        data: {
          published: false
        }
      ) {
        id
        title
        published
      }
    }
  `;

  const { data } = await client.mutate({ mutation: updatePost });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("Should be able to create a post", async () => {
  const client = getClient(userOne.jwt);
  const createPost = gql`
    mutation {
      createPost(data: { title: "Some Title", body: "Body", published: true }) {
        id
        title
        published
      }
    }
  `;

  const { data } = await client.mutate({ mutation: createPost });
  const exists = await prisma.exists.Post({ id: data.createPost.id });

  expect(exists).toBe(true);
});

test("Should be able to delete a post", async () => {
  const client = getClient(userOne.jwt);
  const deletePost = gql`
    mutation {
      deletePost(id: "${postTwo.post.id}") {
        id
      }
    }
  `;

  await client.mutate({ mutation: deletePost });
  const exists = await prisma.exists.Post({ id: postTwo.post.id });

  expect(exists).toBe(false);
});
