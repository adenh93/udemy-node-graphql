import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import getClient from "./utils/getClient";
import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
import {
  getPosts,
  myPosts,
  createPost,
  updatePost,
  deletePost,
  subscribeToPosts
} from "./operations";

const client = getClient();

beforeEach(seedDatabase);

test("Should get all published posts", async () => {
  const { data } = await client.query({ query: getPosts });

  expect(data.posts.length).toBe(1);
  expect(data.posts[0].published).toBe(true);
});

test("Should fetch an authenticated user's posts", async () => {
  const client = getClient(userOne.jwt);

  const { data } = await client.query({ query: myPosts });
  expect(data.myPosts.length).toBe(2);
});

test("Should be able to update own post", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };

  const { data } = await client.mutate({ mutation: updatePost, variables });

  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test("Should be able to create a post", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    data: {
      title: "Some Title",
      body: "Body",
      published: true
    }
  };

  const { data } = await client.mutate({ mutation: createPost, variables });
  const exists = await prisma.exists.Post({ id: data.createPost.id });

  expect(exists).toBe(true);
});

test("Should be able to delete a post", async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id
  };

  await client.mutate({ mutation: deletePost, variables });
  const exists = await prisma.exists.Post({ id: postTwo.post.id });

  expect(exists).toBe(false);
});

test("Should subscribe to published posts", async done => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next({ data }) {
      expect(data.post.mutation).toBe("DELETED");
      done();
    }
  });

  setTimeout(
    async () =>
      await prisma.mutation.deletePost({ where: { id: postOne.post.id } }),
    100
  );
});
