import gql from 'nanographql';

export default {
  auth: gql`
    mutation($username: String!, $password: String!) {
      auth: authenticateAdmin(input: { name: $username, password: $password }) {
        jwtToken
      }
    }
  `,
  resetPassword: gql`
    mutation($id: UUID!) {
      resetPassword(input: { id: $id }) {
        plain: string
      }
    }
  `,
  setPassword: gql`
    mutation($plain: String!) {
      setPassword(input: { plain: $plain }) {
        plain: string
      }
    }
  `,
};
