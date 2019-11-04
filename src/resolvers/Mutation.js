import uuidv4 from "uuid/v4";

export const Mutation = {
  createUser(parent, { data }, { db }, info) {
    const emailTaken = db.users.some(user => user.email === data.email);

    if (emailTaken) {
      throw new Error("Email is already taken!");
    }

    const user = { id: uuidv4(), ...data };
    db.users.push(user);

    return user;
  },
  deleteUser(parent, { id }, { db }, info) {
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error("User not found!");
    }

    db.posts = db.posts.filter(post => {
      db.comments = db.comments.filter(comment => comment.post !== post.id);
      return post.author !== id;
    });

    db.comments = db.comments.filter(comment => comment.author !== id);
    db.users = db.users.filter(user => user.id !== id);

    return user;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      if (data.email !== user.email) {
        const emailTaken = db.users.some(user => user.email === data.email);

        if (emailTaken) {
          throw new Error("Email in use");
        }
      }
    }

    return Object.assign(user, data);
  },
  createPost(parent, { data }, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === data.author);

    if (!userExists) {
      throw new Error("Author not found!");
    }

    const post = { id: uuidv4(), ...data };
    db.posts.push(post);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }

    return post;
  },
  deletePost(parent, { id }, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === id);

    if (!post) {
      throw new Error("Post not found!");
    }

    db.comments = db.comments.filter(comment => comment.post !== id);
    db.posts = db.posts.filter(post => post.id !== id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post
        }
      });
    }

    return post;
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
