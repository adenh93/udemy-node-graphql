import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import getClient from "./utils/getClient";
import seedDatabase, {
  userOne,
  commentOne,
  commentTwo,
  postOne
} from "./utils/seedDatabase";
import { deleteComment, subscribeToComments } from "./operations";

const client = getClient();

beforeEach(seedDatabase);

test("Should be able to delete own comment", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentOne.comment.id
  };

  await client.mutate({ mutation: deleteComment, variables });
  const exists = await prisma.exists.Comment({ id: commentOne.comment.id });
  expect(exists).toBe(false);
});

test("Should not be able to delete another user's comment", async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: commentTwo.comment.id
  };

  await expect(
    client.mutate({ mutation: deleteComment, variables })
  ).rejects.toThrow();

  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id });
  expect(exists).toBe(true);
});

test("Should subscribe to comments for a post", async done => {
  const variables = {
    postId: postOne.post.id
  };

  client.subscribe({ query: subscribeToComments, variables }).subscribe({
    next({ data }) {
      expect(data.comment.mutation).toBe("DELETED");
      done();
    }
  });

  setTimeout(
    async () =>
      await prisma.mutation.deleteComment({
        where: { id: commentOne.comment.id }
      }),
    100
  );
});
