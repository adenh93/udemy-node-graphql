import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: {
    name: "Test User",
    email: "test123@test.com",
    password: bcrypt.hashSync("testPassword123")
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: "Another Test User",
    email: "test321@test.com",
    password: bcrypt.hashSync("testPassword321")
  },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: "Test Post 1",
    body: "Test Body",
    published: true
  },
  post: undefined
};

const postTwo = {
  input: {
    title: "Test Post 2",
    body: "Test Body",
    published: false
  },
  post: undefined
};

const commentOne = {
  input: {
    text: "Test Comment 1"
  },
  comment: undefined
};

const commentTwo = {
  input: {
    text: "Test Comment 2"
  },
  comment: undefined
};

const seedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  });

  userOne.jwt = jwt.sign({ id: userOne.user.id }, process.env.JWT_SECRET);
  userTwo.jwt = jwt.sign({ id: userTwo.user.id }, process.env.JWT_SECRET);

  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });

  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });

  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  });

  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {
        connect: {
          id: userTwo.user.id
        }
      },
      post: {
        connect: {
          id: postOne.post.id
        }
      }
    }
  });
};

export {
  seedDatabase as default,
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo
};
