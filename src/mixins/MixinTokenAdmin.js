import jwt from 'jsonwebtoken';
import { MixinRequest } from './MixinRequest';

/**
 * 提取或存储 jwtToken
 * @params string jwtToken - json web token
 * 不传入时为获取，传入时为设置
 */
const token = (jwtToken) => {
  if (typeof jwtToken !== 'undefined') {
    localStorage.jwtAdminToken = jwtToken;
    return;
  }

  if (!localStorage.jwtAdminToken) {
    return false;
  }
  return jwt.decode(localStorage.jwtAdminToken);
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
      const { auth } = await this.grequest('auth', params);
      console.log(auth);
      if (!auth.jwtAdminToken) {
        return;
      }
      token(auth.jwtAdminToken);
      this.$router.replace(localStorage.to || '/');
      return auth.jwtAdminToken;
    },
  },
};

export { helperGuard, MixinTokenAdmin };
