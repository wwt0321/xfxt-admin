import jwtDecode from 'jwt-decode';
import { tokenKey } from '../../config';
import 'dingtalk-jsapi/entry/union';
import requestAuthCode from 'dingtalk-jsapi/api/runtime/permission/requestAuthCode';

/**
 * 提取 jwtToken
 * @return {String} - token
 */
const getToken = () => {
  if (!localStorage.getItem(tokenKey)) {
    return null;
  }

  const token = jwtDecode(localStorage.getItem(tokenKey));

  // 是否快要过期
  const isNearExpired = token.exp - new Date() / 1000 < 3600;

  // 必须有 id 且有效期够长
  if (!token.id || isNearExpired) {
    localStorage.removeItem(tokenKey);
    return null;
  }

  return token;
};

const helperGuard = () => () => 0;

const MixinDingtalk = {
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
      requestAuthCode({
        corpId: this.corpid,
        onSuccess: (info) => {
          const code = info.code;
          this.$axios
            .get('/auth/dingtalk/authenticate', {
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
      });
    },
  },
};

export { helperGuard, MixinDingtalk };
