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
  createPost(parent, { data }, { db }, info) {
    const userExists = db.users.some(user => user.id === data.author);

    if (!userExists) {
      throw new Error("Author not found!");
    }

    const post = { id: uuidv4(), ...data };
    db.posts.push(post);

    return post;
  },
  deletePost(parent, { id }, { db }, info) {
    const post = db.posts.find(post => post.id === id);

    if (!post) {
      throw new Error("Post not found!");
    }

    db.comments = db.comments.filter(comment => comment.post !== id);
    db.posts = db.posts.filter(post => post.id !== id);

    return post;
  },
  createComment(parent, { data }, { db }, info) {
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

    return comment;
  },
  deleteComment(parent, { id }, { db }, info) {
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found!");
    }

    db.comments = db.comments.filter(comment => comment.id !== id);

    return comment;
  }
};
