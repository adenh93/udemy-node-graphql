import getUserId from "../utils/getUserId";

const User = {
  email: {
    fragment: "fragment userId on User { id }",
    resolve({ id, email }, args, { request }, info) {
      const userId = getUserId(request, false);
      return userId === id ? email : null;
    }
  },
  posts: {
    fragment: "fragment userId on User { id }",
    resolve({ id }, args, { prisma }, info) {
      return prisma.query.posts(
        {
          where: { author: { id }, published: true }
        },
        info
      );
    }
  }
};

export { User as default };
