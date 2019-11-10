import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import getUserId from "../utils/getUserId";

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: data.email });

    if (emailTaken) {
      throw new Error("Email is already taken!");
    }

    if (data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer");
    }

    const password = await bcrypt.hash(data.password, 8);

    const user = await prisma.mutation.createUser({
      data: { ...data, password }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async login(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: data.email } });

    if (!user) {
      throw new Error("Incorrect username or password.");
    }

    const authenticated = await bcrypt.compare(data.password, user.password);

    if (!authenticated) {
      throw new Error("Incorrect username or password.");
    }

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const id = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const id = getUserId(request);

    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  async createPost(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const userExists = await prisma.exists.User({ id: userId });

    if (!userExists) {
      throw new Error("Author not found!");
    }

    return prisma.mutation.createPost(
      { data: { ...data, author: { connect: { id: userId } } } },
      info
    );
  },
  async deletePost(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({ id, author: { id: userId } });

    if (!postExists) {
      throw new Error("Post not found!");
    }

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({ id, author: { id: userId } });

    if (!postExists) {
      throw new Error("Post not found!");
    }

    const isPublished = await prisma.exists.Post({ id, published: true });

    if (isPublished && !data.published) {
      await prisma.mutation.deleteManyComments({ where: { post: { id } } });
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  async createComment(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: data.post,
      published: true
    });

    if (!postExists) {
      throw new Error("Post not found!");
    }

    return prisma.mutation.createComment(
      {
        data: {
          ...data,
          author: {
            connect: { id: userId }
          },
          post: {
            connect: { id: data.post }
          }
        }
      },
      info
    );
  },
  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: userId }
    });

    if (!commentExists) {
      throw new Error("Comment not found!");
    }

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id,
      author: { id: userId }
    });

    if (!commentExists) {
      throw new Error("Comment not found!");
    }

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  }
};

export { Mutation as default };
