export const Query = {
  users(parent, { query }, { prisma }, info) {
    return prisma.query.users(null, info);
  },
  posts(parent, { query }, { prisma }, info) {
    return prisma.query.posts(null, info);
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
