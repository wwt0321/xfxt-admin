import jwt from 'jsonwebtoken';
import { tokenKey } from '../../config';

/**
 * 提取 jwtToken
 * @return {String} - token
 */
const getToken = () => {
  if (!localStorage.getItem(tokenKey)) {
    return null;
  }

  const token = jwt.decode(localStorage.getItem(tokenKey));

  // 是否快要过期
  const isNearExpired = token.exp - new Date() / 1000 < 3600;

  // 必须有 id 且有效期够长
  if (!token.id || isNearExpired) {
    localStorage.removeItem(tokenKey);
    return null;
  }

  return token;
};

/**
 * 增加一个 appid 后，成为有效的 beforeEnter
 * @params String appid - 公众号的 appid 或 企业号的 corpid
 * return beforeEnter
 */
const helperGuard = (appid, host, state) => (to, _from, next) => {
  const redirect = host + '/auth/code';

  const token = getToken();
  console.log('-> token', token);
  if (!token) {
    localStorage.to = to.fullPath;
    window.location.replace(
      `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`,
    );
  }
  next();
};

const MixinTokenWechat = {
  computed: {
    token: {
      get: getToken,
      set(jwtToken) {
        localStorage.setItem(tokenKey, jwtToken);
      },
    },
  },

  methods: {
    /**
     * 用 code 交换 token
     */
    exchangeToken() {
      const code = this.$route.params.code;
      return this.$axios
        .get(this.authpath, {
          params: {
            code,
          },
        })
        .then(({ data }) => {
          if (!data.jwtToken) {
            throw data;
          }
          this.token = data.jwtToken;
          this.$router.replace(localStorage.to);
        });
    },
  },
};

export { helperGuard, MixinTokenWechat };
