import getUserId from "../utils/getUserId";

const Subscription = {
  comment: {
    async subscribe(parent, { postId }, { prisma }, info) {
      const postExists = await prisma.exists.Post({ id: postId });

      if (!postExists) {
        throw new Error("Post not found!");
      }

      return prisma.subscription.comment(
        { where: { node: { post: { id: postId } } } },
        info
      );
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post(
        { where: { node: { published: true } } },
        info
      );
    }
  },
  myPosts: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = getUserId(request);
      return prisma.subscription.post(
        { where: { node: { author: { id: userId } } } },
        info
      );
    }
  }
};

export { Subscription as default };
