import { map, keys, intersection, zipObj } from 'rambda';
import { MixinUtils } from '../mixins/MixinUtils';
import { MixinRequest } from '../mixins/MixinRequest';

export const MixinCRUD = {
  mixins: [MixinUtils, MixinRequest],
  data() {
    return {
      operations: [], // 当前用户可以执行的操作
      rows: [], // 列表数据
      loading: 0, // 加载状态指示器
      mutating: 0, // 写入状态指示器，大于 0 时禁用写操作按钮
      modeEdit: false, // 切换到编辑状态
      initEdata: {}, // 用来存储 edata 的初始状态，添加新项目时以此为默认值
      totalCount: 0, // 列表数据总数
      pagination: {
        sortBy: '',
        descending: Boolean,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
    };
  },
  computed: {
    pages() {
      return Math.ceil(this.totalCount / this.pagination.rowsPerPage);
    },
    paginationParams() {
      return {
        first: this.pagination.rowsPerPage,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
      };
    },
    sortField() {
      if (!this.pagination.sortBy) {
        return '';
      }
      const field = this.pagination.sortBy.replace(/([A-Z])/g, '_$1').toUpperCase();
      return field + '_' + (this.pagination.descending ? 'DESC' : 'ASC');
    },
  },
  methods: {
    // 权限判定
    permission(operation) {
      return (
        (_.include(window.permission, '*') || _.include(window.permission, operation)) &&
        !_.include(window.permission, `!${operation}`)
      );
    },

    // 给表格中删除按钮绑定此事件，让用户确认是否删除当前行
    confirmDeleteRow(name, id) {
      this.$q
        .dialog({
          title: `确认删除"${name}"？`,
          cancel: true,
        })
        .onOk(() => {
          this.deleteRow(id);
        });
    },

    // 删除指定行的数据，需要自己定义 this.gqlDelete
    deleteRow(id) {
      this.$apollo
        .mutate({
          mutation: this.gqlDelete,
          variables: {
            id,
          },
        })
        .then(() => {
          this.modeDelete = false;
          this.$apolloProvider.defaultClient.resetStore();
        });
    },
    showCreate() {
      this.showEdit(this.initEdata);
    },

    showEdit(row) {
      const validKeys = intersection(keys(row), keys(this.initEdata));
      this.edata = zipObj(validKeys, map((v) => row[v])(validKeys));
      if (row.id) {
        this.edata.id = row.id;
      }
      console.log(this.edata);
      this.modeEdit = true;
    },

    request({ pagination }) {
      this.pagination = { ...pagination };
    },

    // 添加或保存数据，需要自定义 this.gqlUpdate 和 this.gqlCreate
    save() {
      const mutation = this.edata.id ? this.gqlUpdate : this.gqlCreate;
      if (this.saveEdata) {
        this.edata = this.saveEdata(this.edata);
      }
      const variables = this.edata.id
        ? {
            id: this.edata.id || undefined,
            patch: this.edata,
          }
        : {
            input: this.edata,
          };
      this.mutating++;
      this.grequest(mutation, variables)
        .then(() => {
          this.modeEdit = false;
          this.mutating--;
        })
        .catch(({ graphQLErrors }) => {
          this.mutating--;
          const message = graphQLErrors.map((v) => v.message).join('\n');
          this.$q.dialog({
            title: '错误',
            message: errors[message] || message,
          });
        });
    },
  },
  created() {
    this.assertKeys('gqlCreate,gqlUpdate,gqlDelete,edata');
    this.initEdata = { ...this.edata };
  },
};
