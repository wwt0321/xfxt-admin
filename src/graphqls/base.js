/**
 * 不要直接修改这个文件
 * 如果请求内容与你的需求不服
 * 将对应的请求复制到 queries.js 或 mutations.js 进行修改
 */
import gql from 'nanographql';

export default {
  //======== queries ========
  types: gql`
    query {
      schema: __schema {
        types {
          kind
          name
        }
      }
    }
  `,
  query: gql`
    query($name: String!) {
      __type(name: $name) {
        name
        fields {
          name
          type {
            kind
            ofType {
              name
              kind
            }
          }
          description
        }
      }
    }
  `,
  configs: gql`
    query {
      configs {
        nodes {
          key
          value
          type
          comment
        }
      }
    }
  `,
  dicts: gql`
    query {
      roles {
        nodes {
          value: id
          label: name
        }
      }
    }
  `,
  functions: gql`
    query {
      groups: functions(first: 100, condition: { parentId: null }) {
        nodes {
          id
          name
          functions: childFunctions(condition: { active: true }) {
            nodes {
              id
              name
              route
              icon
            }
          }
        }
      }
    }
  `,
  admins: gql`
    query($first: Int, $offset: Int) {
      admins(first: $first, offset: $offset) {
        nodes {
          id
          name
          tzCreate
          role {
            id
            name
          }
          parent {
            id
            name
          }
        }
      }
    }
  `,

  //========= mutations ========
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
