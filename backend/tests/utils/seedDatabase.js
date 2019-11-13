import hashPassword from "../../src/utils/hashPassword";
import prisma from "../../src/prisma";

const seedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();

  const { id } = await prisma.mutation.createUser({
    data: {
      name: "Test User",
      email: "test123@test.com",
      password: await hashPassword("testPassword123")
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Test Post 1",
      body: "Test Body",
      published: true,
      author: {
        connect: {
          id
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
          id
        }
      }
    }
  });
};

export { seedDatabase as default };
