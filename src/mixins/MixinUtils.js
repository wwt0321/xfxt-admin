export const MixinUtils = {
  methods: {
    assertKeys(keys) {
      keys.split(',').forEach((v) => {
        if (typeof this[v] == 'undefined') {
          this.$q.notify({
            message: `${v} 未设置`,
            icon: 'bug_report',
            color: 'red',
          });
        }
      });
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
  },
};
