export const Query = {
  users(parent, { query }, { db }, info) {
    if (query) {
      return db.users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    return db.users;
  },
  posts(parent, { query }, { db }, info) {
    if (query) {
      return db.posts.filter(
        post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );
    }
    return db.posts;
  },
  comments(parent, { query }, { db }, info) {
    if (query) {
      return db.comments.filter(comment =>
        comment.text.toLowerCase().includes(query.toLowerCase())
      );
    }
    return db.comments;
  },
  me(parent, args, { db }, info) {
    return db.users[0];
  },
  post(parent, { id }, { db }, info) {
    return db.posts.find(post => post.id === id);
  }
};
