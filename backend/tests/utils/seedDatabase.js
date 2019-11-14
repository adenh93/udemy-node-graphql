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

const seedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({ id: userOne.user.id }, process.env.JWT_SECRET);

  await prisma.mutation.createPost({
    data: {
      title: "Test Post 1",
      body: "Test Body",
      published: true,
      author: {
        connect: {
          id: userOne.user.id
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
          id: userOne.user.id
        }
      }
    }
  });
};

export { seedDatabase as default, userOne };
