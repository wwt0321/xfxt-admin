import { MixinRequest } from './MixinRequest';
import { tokenKey } from '../../config';
import { http } from '../utils/luch-request/index.js';

/**
 * 提取或存储 jwtToken
 * @params string jwtToken - json web token
 * 不传入时为获取，传入时为设置
 */
const token = (jwtToken) => {
  //if (typeof jwtToken !== 'undefined') {
  //  localStorage.setItem(tokenKey, jwtToken);
  //  return;
  //}
  let token = localStorage.getItem(tokenKey);
  if (!token) {
    return false;
  }
  const time = localStorage.jwtTime || 0;
  // 是否快要过期
  const isNearExpired = time - new Date() / 1000 < 3600;
  // 必须有 id 且有效期够长
  if (!localStorage.jwtTime || isNearExpired) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem('jwtTime');
    localStorage.removeItem('to');
    return false;
  }
  return token;
};

/**
 * Guard 用于 beforeEnter
 * @params String appid - 公众号的 appid
 * return beforeEnter
 */
const helperGuard = (to, _from, next) => {
  if (!token()) {
    localStorage.to = to.fullPath;
    return next('/login');
  }
  next();
};

const MixinTokenAdmin = {
  mixins: [MixinRequest],
  methods: {
    token,

    /**
     * 用账号密码换取 token
     * @param {Object} params - 登录所需参数
     */
    async exchangeToken(params) {
      const data = await http.post('/system/login', params);
      if (data.res) {
        localStorage.setItem('jwtTime', data.data.time);
        localStorage.setItem(tokenKey, data.authid);
        token();
        this.$router.replace(localStorage.to && localStorage.to != '/' ? localStorage.to : '/home');
        return true;
      } else {
        alert(data.msg);
        return false;
      }
    },
  },
};

export { helperGuard, MixinTokenAdmin };
