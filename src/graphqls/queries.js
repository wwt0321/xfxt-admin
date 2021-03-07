import gql from 'nanographql';

export default {
  auth: gql`
    mutation($username: String!, $password: String!) {
      auth: authenticateAdmin(input: { name: $username, password: $password }) {
        jwtToken
      }
    }
  `,
  configs: gql`
    query {
      configs {
        nodes {
          key
          value
          comment
        }
      }
    }
  `,
  // 按 id -> value, name -> label 的固定格式加载所有配置项，在框架启动时一次性加载
  dicts: gql`
    query {
      appTypes: dictAppTypes {
        nodes {
          value: id
          label: name
        }
      }
      roles {
        nodes {
          value: id
          label: name
        }
      }
      genders: dictGenders {
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
          uuid
          name
          ctime
          role {
            id
            name
          }
          parent {
            uuid
            name
          }
        }
      }
    }
  `,
};
