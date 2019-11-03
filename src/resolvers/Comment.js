export const Comment = {
  author({ author }, args, { db }, info) {
    return db.users.find(user => user.id === author);
  },
  post({ post: postId }, args, { db }, info) {
    return db.posts.find(post => post.id === postId);
  }
};
