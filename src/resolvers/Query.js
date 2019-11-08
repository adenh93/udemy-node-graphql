export const Query = {
  users(parent, { query }, { prisma }, info) {
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            name_contains: query
          },
          {
            email_contains: query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, { query }, { prisma }, info) {
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            title_contains: query
          },
          {
            body_contains: query
          }
        ]
      };
    }

    return prisma.query.posts(opArgs, info);
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
