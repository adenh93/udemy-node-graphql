// Demo user data
export const users = [
  {
    id: "1",
    name: "Aden Herold",
    email: "aden.herold1@gmail.com",
    age: 26
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@graphql.com"
  },
  {
    id: "3",
    name: "Joe Bloggs",
    email: "joe.bloggs@graphql.com",
    age: 24
  }
];

export const posts = [
  {
    id: "1",
    title: "Why learn GraphQL?",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "Upcoming React features",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    published: false,
    author: "1"
  },
  {
    id: "3",
    title: "Express vs Koa",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    published: true,
    author: "2"
  }
];

export const comments = [
  {
    id: "1",
    text: "This is the next thing I need to learn.",
    author: "3",
    post: "1"
  },
  {
    id: "2",
    text: "Interesting seeing how GraphQL stacks up to REST.",
    author: "2",
    post: "1"
  },
  {
    id: "3",
    text: "Sounds great! Looking forward to the future of React!",
    author: "1",
    post: "2"
  },
  {
    id: "4",
    text: "Interesting. I might have to give Koa a spin some time.",
    author: "1",
    post: "3"
  }
];
