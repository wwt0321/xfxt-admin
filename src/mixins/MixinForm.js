import { keys, map } from 'rambda';
import { MixinRequest } from './MixinRequest';
import { MixinCommon } from './MixinCommon';
import { MixinUtils } from './MixinUtils';
import { camelCase } from 'change-case';

export const MixinForm = {
  mixins: [MixinUtils, MixinRequest, MixinCommon],
  props: {
    dryMode: Boolean,
    primaryId: String,
    locked: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      core: {}, // 模块内部核心数据
      gql: {}, // 挂载GraphQL请求
      mutating: 0,
    };
  },

  methods: {
    async hide() {
      console.log('emit: hide');
      this.$emit('hide');
    },

    // 添加或保存数据，需要自定义 this.gqlUpdate 和 this.gqlCreate
    async submit() {
      const mutation = this.primaryId ? this.gql.update : this.gql.create;
      // 如果是数字类型，把默认值改回 null
      // this.edata = map((v, k) => (this.initEdata[k] === 0 && v === '' ? null : v))(this.edata);
      this.preSave?.();
      const variables = this.primaryId
        ? {
            id: this.primaryId || undefined,
            patch: this.edata,
          }
        : {
            input: this.edata,
          };
      if (!this.dryMode) {
        await this.grequest(mutation, variables);
      }
      this.$emit('submit', this.edata);
      return this.hide();
    },

    async load(returnOnly = false) {
      const data = await this.grequest(this.gql.query, { id: this.primaryId });
      const key = keys(data)[0];
      if (!returnOnly) {
        this.edata = data[key];
      }
      return data[key];
    },

    checkProperties() {
      if (this.$options.name.substring(0, 4) != 'Form') {
        this.alert('name 不符合命名规则，必须以 Form 开头');
      }
      this.assertKeys('edata');
      this.deprecated('gqlCreate,gqlUpdate');
    },

    init() {
      this.core.name = this.$options.name.substring(4);
      if (!this.gql.create) {
        this.gql.create = `create${this.core.name}`;
      }
      if (!this.gql.update) {
        this.gql.update = `update${this.core.name}`;
      }
      if (!this.gql.query) {
        this.gql.query = camelCase(this.core.name);
      }

      this.initEdata = { ...this.edata };
      this.edata = map((v) => {
        if (v === 'DEFAULT_DATE') {
          return this.defaults.date;
        }
        return v;
      })(this.edata);
    },
  },

  created() {
    this.checkProperties();
    this.init();
  },
};
