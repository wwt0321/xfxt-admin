import gql from 'nanographql';

export default {
  auth: gql`
    mutation($username: String!, $password: String!) {
      auth: authenticateAdmin(input: { name: $username, password: $password }) {
        jwtToken
      }
    }
  `,
  ticketTypes: gql`
    query {
      dict: dictTicketTypesList {
        id
        name
      }
    }
  `,
  tickets: gql`
    query($typeId: Int!) {
      tickets: ticketsList(condition: { typeId: $typeId }) {
        id
        name
        price
      }
    }
  `,
  functions: gql`
    query {
      groups: functionsList(first: 100, condition: { parentId: null }) {
        id
        name
        functions: childFunctionsList(condition: { active: true }) {
          id
          name
          route
          icon
        }
      }
      functions: functionsList(first: 100) {
        id
        route
        name
        icon
      }
    }
  `,
};
