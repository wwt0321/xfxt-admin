import { map, keys, intersection, zipObj } from 'rambda';
import { MixinRequest } from './MixinRequest';
import { MixinCommon } from './MixinCommon';
import { MixinUtils } from './MixinUtils';
import { camelCase } from 'change-case';
import { http } from '../utils/luch-request/index.js';

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
      loaded: false,
      loading: 0,
    };
  },

  methods: {
    async hide() {
      console.log('emit: hide');
      this.$emit('hide');
    },

    // 添加或保存数据，需要自定义 this.gqlUpdate 和 this.gqlCreate
    async submit(tip) {
      console.log(this.edata);
      this.loading++;

      let params = new FormData();
      Object.keys(this.edata).forEach((v) => {
        params.append(v, this.edata[v] === 0 ? 0 : this.edata[v] || '');
      });
      let res = '';
      if (this.primaryId) {
        res = await http.put(this.gql.update, params);
      } else {
        res = await http.post(this.gql.create, params);
      }
      if (res.res) {
        this.$emit('submit', this.edata);
        this.hide();
        alert(this.primaryId ? `${tip || '编辑'}成功` : `${tip || '新建'}成功`);
      } else {
        alert(this.primaryId ? `${tip || '编辑'}失败` : `${tip || '新建'}失败`);
      }
      this.loading--;
    },

    async load(returnOnly = false) {
      const data = await this.grequest(this.gql.query, { id: this.primaryId });
      const key = keys(data)[0];
      const row = data[key];
      if (row === null) {
        return null;
      }
      console.log(keys(row), keys(this.initEdata));
      const validKeys = intersection(keys(row), keys(this.initEdata));
      const validData = zipObj(validKeys, map((v) => row[v])(validKeys));
      if (!returnOnly) {
        this.edata = validData;
      }
      this.loaded = true;
      return validData;
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
      console.log(this.initEdata);
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
