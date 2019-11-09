import uuidv4 from "uuid/v4";

export const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: data.email });

    if (emailTaken) {
      throw new Error("Email is already taken!");
    }

    return prisma.mutation.createUser({ data }, info);
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
  async createPost(parent, { data }, { prisma, pubsub }, info) {
    const userExists = await prisma.exists.User({ id: data.author });

    if (!userExists) {
      throw new Error("Author not found!");
    }

    return prisma.mutation.createPost(
      { data: { ...data, author: { connect: { id: data.author } } } },
      info
    );
  },
  async deletePost(parent, { id }, { prisma, pubsub }, info) {
    const post = await prisma.exists.Post({ id });

    if (!post) {
      throw new Error("Post not found!");
    }

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    let post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found!");
    }

    const updated = data.title || data.body;
    Object.assign(post, data);

    if (typeof data.published === "boolean") {
      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (updated) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    return post;
  },
  createComment(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === data.author);

    if (!userExists) {
      throw new Error("Author not found!");
    }

    const postExists = db.posts.find(
      post => post.id === data.post && post.published
    );

    if (!postExists) {
      throw new Error("Post not found!");
    }

    const comment = { id: uuidv4(), ...data };
    db.comments.push(comment);
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, { id }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found!");
    }

    db.comments = db.comments.filter(comment => comment.id !== id);
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "DELETED",
        data: comment
      }
    });

    return comment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    let comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found!");
    }

    Object.assign(comment, data);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });

    return comment;
  }
};
