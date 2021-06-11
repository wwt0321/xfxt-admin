import { zipObj, pluck, path, filter, reject, forEach } from 'rambda';

export const MixinUtils = {
  data() {
    return {
      optionBooleans: [
        {
          value: true,
          label: '是',
        },
        {
          value: false,
          label: '否',
        },
      ],
      optionIntBooleans: [
        {
          value: 1,
          label: '是',
        },
        {
          value: 0,
          label: '否',
        },
      ],
      afterShow: {},
      afterHide: {},
    };
  },
  methods: {
    /**
     * 用于内部代码质量检测，及时通知可能存在 bug 的情况
     */
    reportBug(message) {
      this.$q.notify({
        message,
        icon: 'bug_report',
        color: 'red',
      });
    },
    /**
     * 检查属性是否存在
     *
     * @param {String|Array} keys
     * @param {Function} choose - filter/reject
     */
    matchKeys(keys, choose) {
      const keyArr = typeof keys === 'string' ? keys.split(',') : keys;
      return choose((v) => typeof path(v, this) === 'undefined')(keyArr);
    },
    /**
     * 检查必备的键
     *
     * @params {String|String[]} keys 'a,b,c' 或 ['a', 'b', 'c']
     */
    assertKeys(keys) {
      const matched = this.matchKeys(keys, filter);
      matched.forEach((v) => {
        this.$q.notify({
          message: `${v} 未设置`,
          icon: 'bug_report',
          color: 'red',
        });
      });
    },
    /**
     * 检查过时的属性
     *
     * @param {String} keys - 过时的属性，用英文逗号分隔
     */
    deprecated(keys) {
      const matched = this.matchKeys(keys, reject);
      if (matched.length > 0) {
        console.warn(`Depreated in ${this.$options.name}`, matched);
      }
    },
    async alert(options) {
      if (typeof options === 'string') {
        options = {
          message: options,
        };
      }
      return new Promise((resolve) => {
        this.$q
          .dialog({
            persistent: true,
            ...options,
          })
          .onOk(resolve);
      });
    },
    async confirm(options) {
      if (typeof options === 'string') {
        options = {
          message: options,
        };
      }
      return new Promise((resolve) => {
        this.$q
          .dialog({
            persistent: true,
            cancel: true,
            ...options,
          })
          .onOk(() => {
            resolve(true);
          })
          .onCancel(() => {
            resolve(false);
          });
      });
    },
    mapDict(dictName) {
      const keys = pluck('value')(this.dicts[dictName]);
      const values = pluck('label')(this.dicts[dictName]);
      return zipObj(keys, values);
    },
    dialog(name) {
      if (typeof this.isShow[name] == 'undefined') {
        this.reportBug(`isShow.${name} 未定义`);
        return;
      }

      return (state) => () => {
        console.log(this);
        this.isShow[name] = state;
      };
    },

    /**
     * 根据 isShow 中的属性生成显示和隐藏的方法
     */
    $watchShowHide() {
      forEach((_v, k) => {
        if (this.afterShow[k] || this.afterHide[k]) {
          this.$watch(`isShow.${k}`, (nv) => {
            nv && this.afterShow[k]?.();
            !nv && this.afterHide[k]?.();
          });
        }
      })(this.isShow);
    },
  },
};
