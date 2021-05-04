import gql from 'nanographql';

export default {
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
};
