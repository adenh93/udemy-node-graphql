import { gql } from "apollo-boost";

const getPosts = gql`
  query {
    posts {
      id
      title
      published
    }
  }
`;

const myPosts = gql`
  query {
    myPosts {
      id
      title
    }
  }
`;

const createPost = gql`
  mutation($data: CreatePostInput) {
    createPost(data: $data) {
      id
      title
      published
    }
  }
`;

const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      published
    }
  }
`;

const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const subscribeToPosts = gql`
  subscription {
    post {
      mutation
      node {
        id
        title
        published
      }
    }
  }
`;

export {
  getPosts,
  myPosts,
  createPost,
  updatePost,
  deletePost,
  subscribeToPosts
};
