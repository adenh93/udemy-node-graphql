import ApolloBoost, { gql } from "apollo-boost";

const client = new ApolloBoost({
  uri: "http://localhost:4000"
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

const getPosts = gql`
  query {
    posts {
      id
      title
      author {
        id
        name
      }
    }
  }
`;

client
  .query({
    query: getUsers
  })
  .then(({ data }) => {
    let html = "";

    data.users.forEach(({ name }) => {
      html += `
        <div>
            <h3>${name}</h3>
        </div>
      `;
    });

    document.getElementById("users").innerHTML = html;
  });

client
  .query({
    query: getPosts
  })
  .then(({ data }) => {
    let html = "";

    data.posts.forEach(({ title, author }) => {
      html += `
        <div>
            <h3>${title}</h3>
            <p>published by ${author.name}</p>
        </div>
      `;
    });

    document.getElementById("posts").innerHTML = html;
  });
