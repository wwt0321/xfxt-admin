/**
 * Request 1.0.1
 * @Class Request
 * @description luch-request 1.0.1 http请求插件
 * @Author lu-ch
 * @Date 2019-09-20
 * @Email webwork.s@qq.com
 * http://ext.dcloud.net.cn/plugin?id=392
 */
import axios from 'axios';
export default class Request {
  config = {
    baseUrl: '',
    headers: {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
  };

  static posUrl(url) {
    /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
  }

  static addQueryString(params) {
    let paramsData = '';
    Object.keys(params).forEach(function(key) {
      paramsData += key + '=' + params[key] + '&';
    });
    return paramsData.substring(0, paramsData.length - 1);
  }

  /**
   * @property {Function} request 请求拦截器
   * @property {Function} response 响应拦截器
   * @type {{request: Request.interceptor.request, response: Request.interceptor.response}}
   */
  interceptor = {
    /**
     * @param {Request~requestCallback} cb - 请求之前拦截,接收一个函数（config, cancel）=> {return config}。第一个参数为全局config,第二个参数为函数，调用则取消本次请求。
     */
    request: (cb) => {
      if (cb) {
        this.requestBeforeFun = cb;
      }
    },
    /**
     * @param {Request~responseCallback} cb 响应拦截器，对响应数据做点什么
     * @param {Request~responseErrCallback} ecb 响应拦截器，对响应错误做点什么
     */
    response: (cb, ecb) => {
      if (cb && ecb) {
        this.requestComFun = cb;
        this.requestComFail = ecb;
      }
    },
  };

  requestBeforeFun(config) {
    return config;
  }

  requestComFun(response) {
    return response;
  }

  requestComFail(response) {
    return response;
  }

  /**
   * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
   * @param { Object } response - 请求响应体（只读）
   * @return { Boolean } 如果为true,则 resolve, 否则 reject
   */
  validateStatus(response) {
    return response.statusCode === 200;
  }

  /**
   * @Function
   * @param {Request~setConfigCallback} f - 设置全局默认配置
   */
  setConfig(f) {
    this.config = f(this.config);
  }

  /**
   * @Function
   * @param {Object} options - 请求配置项
   * @prop {String} options.url - 请求路径
   * @prop {Object} options.data - 请求参数
   * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
   * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
   * @prop {Object} [options.headers = config.headers] - 请求headers
   * @prop {Object} [options.method = config.method] - 请求方法
   * @returns {Promise<unknown>}
   */
  async request(options = {}) {
    let that = this;
    options.baseUrl = this.config.baseUrl;
    options.dataType = options.dataType || this.config.dataType;
    options.responseType = options.responseType || this.config.responseType;
    options.url = options.url || '';
    options.data = options.data || {};
    options.params = options.params || {};
    options.headers = options.headers || this.config.headers;
    options.method = options.method || this.config.method;
    return new Promise((resolve, reject) => {
      let next = true;

      let handleRe = {};
      options.complete = (response) => {
        response.config = handleRe;
        if (this.validateStatus(response)) {
          // 成功
          response = this.requestComFun(response);
          resolve(response);
        } else {
          response = this.requestComFail(response);
          reject(response);
        }
      };
      const cancel = (t = 'handle cancel', config = options) => {
        const err = {
          errMsg: t,
          config: config,
        };
        reject(err);
        next = false;
      };

      handleRe = { ...this.requestBeforeFun(options, cancel) };
      const _config = { ...handleRe };
      if (!next) return;

      let mergeUrl = Request.posUrl(options.url) ? options.url : options.baseUrl + options.url;
      if (JSON.stringify(options.params) !== '{}') {
        const paramsH = Request.addQueryString(options.params);
        mergeUrl += mergeUrl.indexOf('?') === -1 ? `?${paramsH}` : `&${paramsH}`;
      }
      _config.url = mergeUrl;
      axios(_config)
        .then((res) => {
          console.log('res:', res);
          let data = res.data;
          resolve(data);
        })
        .catch(({ response, request }) => {
          console.log('err:', response);
          if (response.status == 403) {
            if (!localStorage.logout) {
              alert('登录过期，请重新登录');
            }
            localStorage.to = window.location.hash.replace('#', '');
            localStorage.logout = 1;
            location.href = window.location.href.split('#')[0] + '#/login';
            return false;
          }

          return resolve([response || request]);
        });
    });
  }

  get(url, options = {}) {
    return this.request({
      url,
      method: 'GET',
      ...options,
    });
  }

  post(url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'POST',
      ...options,
    });
  }

  // #ifndef MP-ALIPAY
  put(url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'PUT',
      ...options,
    });
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
  delete(url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'DELETE',
      ...options,
    });
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN
  connect(url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'CONNECT',
      ...options,
    });
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
  head(url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'HEAD',
      ...options,
    });
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
  options(url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'OPTIONS',
      ...options,
    });
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN
  trace(url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'TRACE',
      ...options,
    });
  }

  // #endif

  upload(
    url,
    {
      // #ifdef APP-PLUS
      files,
      // #endif
      // #ifdef MP-ALIPAY
      fileType,
      // #endif
      filePath,
      name,
      headers,
      formData,
    },
  ) {
    return new Promise((resolve, reject) => {
      let next = true;
      let handleRe = {};
      const pubConfig = {
        baseUrl: this.config.baseUrl,
        url,
        // #ifdef APP-PLUS
        files,
        // #endif
        // #ifdef MP-ALIPAY
        fileType,
        // #endif
        filePath,
        method: 'UPLOAD',
        name,
        headers: headers || this.config.headers,
        formData,
        complete: (response) => {
          response.config = handleRe;
          if (response.statusCode === 200) {
            // 成功
            response = this.requestComFun(response);
            resolve(response);
          } else {
            response = this.requestComFail(response);
            reject(response);
          }
        },
      };
      const cancel = (t = 'handle cancel', config = pubConfig) => {
        const err = {
          errMsg: t,
          config: config,
        };
        reject(err);
        next = false;
      };

      handleRe = { ...this.requestBeforeFun(pubConfig, cancel) };
      const _config = { ...handleRe };
      if (!next) return;
      _config.url = Request.posUrl(url) ? url : this.config.baseUrl + url;
      console.log(555, _config);
      //uni.uploadFile(_config);
    });
  }
}

/**
 * setConfig回调
 * @return {Object} - 返回操作后的config
 * @callback Request~setConfigCallback
 * @param {Object} config - 全局默认config
 */
/**
 * 请求拦截器回调
 * @return {Object} - 返回操作后的config
 * @callback Request~requestCallback
 * @param {Object} config - 全局config
 * @param {Function} [cancel] - 取消请求钩子，调用会取消本次请求
 */
/**
 * 响应拦截器回调
 * @return {Object} - 返回操作后的response
 * @callback Request~responseCallback
 * @param {Object} response - 请求结果 response
 */
/**
 * 响应错误拦截器回调
 * @return {Object} - 返回操作后的response
 * @callback Request~responseErrCallback
 * @param {Object} response - 请求结果 response
 */
