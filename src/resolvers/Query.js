import getUserId from "../utils/getUserId";

const Query = {
  me(parent, args, { prisma, request }, info) {
    const id = getUserId(request);
    return prisma.query.user({ where: { id } }, info);
  },
  users(parent, { query, pagination }, { prisma }, info) {
    const opArgs = {
      ...pagination
    };

    if (query) {
      opArgs.where = {
        name_contains: query
      };
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, { query, pagination }, { prisma }, info) {
    const opArgs = {
      ...pagination,
      where: {
        published: true
      }
    };

    if (query) {
      opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
    }

    return prisma.query.posts(opArgs, info);
  },
  myPosts(parent, { query, pagination }, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      ...pagination,
      where: {
        author: { id: userId }
      }
    };

    if (query) {
      opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, { pagination }, { prisma }, info) {
    const opArgs = {
      ...pagination,
      where: {
        post: { published: true }
      }
    };

    return prisma.query.comments(opArgs, info);
  },
  async post(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);
    const posts = await prisma.query.posts(
      {
        where: { id, OR: [{ published: true }, { author: { id: userId } }] }
      },
      info
    );

    if (posts.length === 0) {
      throw new Error("Post not found!");
    }

    return posts[0];
  }
};

export { Query as default };
