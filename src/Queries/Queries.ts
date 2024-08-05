import { gql } from 'urql';


export const GET_POST = gql`
query ($options: PageQueryOptions) {
  posts(options: $options) {
    data {
      id
      title
      body
      user {
        id
      }
    }
  }
}
`;


export const CREATE_POST = gql`
mutation ( $input: CreatePostInput! ) {
  createPost(input: $input) {
    id
    title
    body
  }
}
`;


export const DELETE_POST = gql`
mutation ($id: ID!) {
  deletePost(id: $id)
}
`