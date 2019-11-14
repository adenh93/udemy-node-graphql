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

const seedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({ id: userOne.user.id }, process.env.JWT_SECRET);

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
};

export { seedDatabase as default, userOne, postOne, postTwo };
