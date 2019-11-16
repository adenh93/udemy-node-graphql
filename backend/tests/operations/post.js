import { gql } from "apollo-boost";

export const getPosts = gql`
  query {
    posts {
      id
      title
      published
    }
  }
`;

export const myPosts = gql`
  query {
    myPosts {
      id
      title
    }
  }
`;

export const createPost = gql`
  mutation($data: CreatePostInput) {
    createPost(data: $data) {
      id
      title
      published
    }
  }
`;

export const updatePost = gql`
  mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      published
    }
  }
`;

export const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

export const subscribeToPosts = gql`
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
