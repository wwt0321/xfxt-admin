import Request from './request';
import { gateway, tokenKey } from '../../../config.js';

const http = new Request();

http.setConfig((config) => {
  /* 设置全局配置 */

  config.baseUrl = gateway;

  config.headers = {
    ...config.headers,
    Accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
  };
  return config;
});

http.validateStatus = (response) => {
  return response.statusCode === 200;
};

http.interceptor.request((config, cancel) => {
  let authorize = localStorage.jwtTime || 0;
  /* 请求之前拦截器 */
  // 有 token 且有效期超过 1 小时
  if (authorize - new Date() / 1000 > 3600 && config.url != '/system/login') {
    config.headers.authId = localStorage.getItem(tokenKey);
  }
  config.headers = {
    ...config.headers,
  };
  /*
  if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
  }
  */
  return config;
});

http.interceptor.response(
  (response) => {
    /* 请求之后拦截器 */
    let authorize = localStorage.jwtTime || 0;
    //if (response.headers.authId) {
    //  let token = response.headers.authId.replace('Bearer ', '');
    //  authorize.access_token = token;
    //  authorize.expires_in = authorize.expires_in + 3600;
    //  localStorage.setItem(tokenKey, authorize);
    //}
    return response;
  },
  (response) => {
    if (response.data?.code === 9000) {
      let result = confirm('请求失败，要重新登录吗');
      if (result) {
        localStorage.removeItem(tokenKey);
        this.$router.replace('/login');
      }
    }
    // 请求错误做点什么
    return response;
  },
);

export { http };
