import axios from 'axios';
import { pluck, includes } from 'rambda';
import queries from '../graphqls/index.js';
import { tokenKey } from '../../config';

console.log(queries);

const getHeaders = (headers = {}) => {
  headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };
  if (localStorage.getItem(tokenKey)) {
    headers.Authorization = `Bearer ${localStorage.getItem(tokenKey)}`;
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

export const MixinRequest = {
  data() {
    return {
      loading: 0,
    };
  },
  methods: {
    /**
     * catchUnexpectedErrors. 捕获开发过程中无法预知的错误
     *
     * @param {Error} error - 异常
     * @param {} error.response - 返回的内容
     * @param {} error.request  - 请求的内容
     * @param {} error.errors   - 希望自己处理的异常
     */
    catchUnexpectedErrors({ response, request, errors }) {
      console.log('interceptors.response.error');
      this.loading--;
      // 强制抛出异常
      if (errors) {
        throw errors;
      }
      // 网络故障等原因
      if (response) {
        // 其他响应
        this.$q.notify({
          message: `${response.status} ${response.statusText}`,
          icon: 'error',
        });
        console.error({ type: '意外的返回结果', response: response });
      } else {
        // 无响应
        this.$q.notify({
          message: `请求失败，请检查您的网络!`,
          icon: 'wifi_off',
        });
        console.error({ type: '无响应', request: request });
      }
      return { status: -1 };
    },

    /**
     * rrequest. Restful Request
     *
     * @param {} url - 地址
     * @param {} query - 地址 query 参数
     * @param {} notify - 是否自动提示，默认开
     */
    async rrequest(config, notify = true) {
      const instance = axios.create();

      instance.interceptors.request.use((config) => {
        this.loading++;
        return { ...config, headers: getHeaders(config.headers) };
      });

      instance.interceptors.response.use((response) => {
        console.log('interceptors.response.ok');
        this.loading--;
        const { data } = response;
        if (data.err) {
          if (notify) {
            this.$q.notify({
              message: data.message,
              icon: 'report_problem',
            });
          }
        }
        return data;
      }, this.catchUnexpectedErrors);

      return await instance(config);
    },

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
        .catch(this.catchUnexpectedErrors);
    },
  },
};
