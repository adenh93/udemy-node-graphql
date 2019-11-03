export const Post = {
  author({ author }, args, { db }, info) {
    return db.users.find(user => user.id === author);
  },
  comments({ id }, args, { db }, info) {
    return db.comments.filter(comment => comment.post === id);
  }
};
