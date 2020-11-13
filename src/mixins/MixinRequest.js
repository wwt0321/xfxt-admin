import axios from 'axios';
import { pluck, includes } from 'rambda';
import queries from '../graphqls/queries.js';

const getHeaders = (headers = {}) => {
  headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };
  if (localStorage.jwtAdminToken) {
    headers.Authorization = `Bearer ${localStorage.jwtAdminToken}`;
  }
  return headers;
};

const gaxios = (queryName, variables) => {
  if (!queries[queryName]) {
    return alert(`查询 ${queryName} 未实现`);
  }
  return axios({
    method: 'POST',
    url: '/postgraphiles/admin/graphql',
    headers: getHeaders(),
    data: queries[queryName](variables),
  });
};

const aaxios = (url, data) => {
  return axios({
    method: 'POST',
    url,
    headers: getHeaders(),
    data,
  });
};

export const MixinRequest = {
  data() {
    return {
      loading: 0,
    };
  },
  methods: {
    /**
     * @params string queryName 请求名称
     * @params object variables 请求参数
     * @params boolean notify 是否提示错误，默认提示，如果想自己接管提示，将其设置为 false
     */
    async grequest(queryName, variables = null, notify = true) {
      this.loading++;
      return gaxios(queryName, variables)
        .then(({ data }) => {
          // http 状态正确，但 graphql 接口执行失败的情况
          if (data.errors) {
            if (notify) {
              const caption = pluck('message', data.errors).join('\n');
              let message = '请求失败';
              let icon = 'report_problem';
              if (includes('permission', caption)) {
                message = '权限不足';
              }
              if (includes('query has no destination for result data', caption)) {
                message = '数据库函数未正确返回(或报错)';
                icon = 'bug_report';
              }
              this.$q.notify({
                message,
                caption,
                icon,
              });
            } else {
              throw { errors: data.errors };
            }
          }

          this.loading--;
          return data.data;
        })
        .catch(({ response, request, errors }) => {
          this.loading--;
          if (errors) {
            throw errors;
          }
          // graphql 接口响应失败的情况
          if (response && response.data && response.data.errors) {
            console.error({ config: response.config, errors: response.data.errors });
            return response.data.errors;
          }

          // 网络故障等原因
          if (response) {
            // 其他响应
            this.$q.notify({
              message: `${response.status} ${response.statusText}`,
              icon: 'error',
            });
            console.error({ type: 'unexpected response', err: response });
          } else {
            this.$q.notify({
              message: `请求失败，请检查您的网络!`,
              icon: 'wifi_off',
            });
            // 无响应
            console.error({ type: 'no response', err: request });
          }
        });
    },

    async arequest(url, data = {}, notify = true) {
      this.loading++;
      return aaxios(url, data)
        .then(({ data }) => {
          this.loading--;

          if (data.status) {
            if (notify) {
              this.$q.notify({
                message: data.message,
                icon: 'report_problem',
              });
            }
          }

          return data;
        })
        .catch(({ response, request }) => {
          // 网络故障等原因
          if (response) {
            // 其他响应
            this.$q.notify({
              message: `${response.status} ${response.statusText}`,
              icon: 'error',
            });
            console.error({ type: 'unexpected response', err: response });
          } else {
            // 无响应
            this.$q.notify({
              message: `请求失败，请检查您的网络!`,
              icon: 'wifi_off',
            });
            console.error({ type: 'no response', err: request });
          }
          return { status: -1 };
        });
    },
  },
};
