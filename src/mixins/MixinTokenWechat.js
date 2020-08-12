import jwt from 'jsonwebtoken';

/**
 * 提取或存储 jwtToken
 * @params string jwtToken - json web token
 * 不传入时为获取，传入时为设置
 */
const token = (jwtToken = null) => {
  if (jwtToken) {
    localStorage.jwtToken = jwtToken;
    return;
  }

  if (!localStorage.jwtToken) {
    return false;
  }
  return jwt.decode(localStorage.jwtToken);
};

/**
 * 增加一个 appid 后，成为有效的 beforeEnter
 * @params String appid - 公众号的 appid
 * return beforeEnter
 */
const helperGuard = (appid, host, state) => (to, from, next) => {
  const redirect = host + '/auth/code';

  if (!token()) {
    localStorage.to = to.fullPath;
    window.location.replace(
      `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`,
    );
  }
  next();
};

const MixinTokenWechat = {
  methods: {
    token,

    /**
     * 用 code 交换 token
     */
    exchangeToken() {
      const code = this.$route.params.code;
      this.$axios
        .get('/auth/wechat/authenticate', {
          params: {
            code,
          },
        })
        .then(({ data }) => {
          console.log(data);
          if (!data.jwtToken) {
            return;
          }
          localStorage.jwtToken = data.jwtToken;
          this.$router.replace(localStorage.to);
        });
    },
  },
};

export { helperGuard, MixinTokenWechat };
