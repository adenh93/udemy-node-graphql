import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Mutation = {
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    return {
      user,
      token
    };
  },
  async deleteUser(parent, { id }, { prisma }, info) {
    const user = await prisma.exists.User({ id });

    if (!user) {
      throw new Error("User not found!");
    }

    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  async updateUser(parent, { id, data }, { prisma }, info) {
    const user = await prisma.exists.User({ id });

    if (!user) {
      throw new Error("User not found!");
    }

    return prisma.mutation.updateUser({ where: { id }, data }, info);
  },
  async createPost(parent, { data }, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: data.author });

    if (!userExists) {
      throw new Error("Author not found!");
    }

    return prisma.mutation.createPost(
      { data: { ...data, author: { connect: { id: data.author } } } },
      info
    );
  },
  async deletePost(parent, { id }, { prisma }, info) {
    const post = await prisma.exists.Post({ id });

    if (!post) {
      throw new Error("Post not found!");
    }

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  async updatePost(parent, { id, data }, { prisma }, info) {
    let post = await prisma.exists.Post({ id });

    if (!post) {
      throw new Error("Post not found!");
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },
  async createComment(parent, { data }, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: data.author });

    if (!userExists) {
      throw new Error("Author not found!");
    }

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
            connect: { id: data.author }
          },
          post: {
            connect: { id: data.post }
          }
        }
      },
      info
    );
  },
  async deleteComment(parent, { id }, { prisma }, info) {
    const comment = await prisma.exists.Comment({ id });

    if (!comment) {
      throw new Error("Comment not found!");
    }

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    const comment = await prisma.exists.Comment({ id });

    if (!comment) {
      throw new Error("Comment not found!");
    }

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  }
};
