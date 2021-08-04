// GraphQL 接口地址
export const endpoint = '/postgraphiles/admin/graphql';

// swagger 接口地址
export const gateway = '/console';

// JWT 存在 localStorage[tokenKey] 中，一个系统有多个客户端时，通过不同的命名确保可以同时登录多个系统而不冲突
export const tokenKey = 'jwtAdmin';

// 用于自动生成 GraphQL 接口的基础 Mutation 操作
export const simpleMutationTables = [{ name: 'admin', id: 'id', idType: 'uuid' }];
