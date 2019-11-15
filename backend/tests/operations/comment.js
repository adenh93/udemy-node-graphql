import { gql } from "apollo-boost";

const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`;

export { deleteComment };
