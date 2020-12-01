import { map, keys, intersection, zipObj } from 'rambda';
import { MixinUtils } from '../mixins/MixinUtils';
import { MixinCommon } from '../mixins/MixinCommon';
import { escape } from 'html-escaper';

export const MixinCRUD = {
  mixins: [MixinUtils, MixinCommon],
  data() {
    return {
      operations: [], // 当前用户可以执行的操作
      rows: [], // 列表数据
      loading: 0, // 加载状态指示器
      mutating: 0, // 写入状态指示器，大于 0 时禁用写操作按钮
      modeEdit: false, // 切换到编辑状态
      initEdata: {}, // 用来存储 edata 的初始状态，添加新项目时以此为默认值
      pagination: {
        sortBy: '',
        descending: Boolean,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
      selected: [],
    };
  },
  computed: {
    dicts() {
      return this.$store.state.dicts;
    },
    totalCount() {
      return this.pagination.rowsNumber;
    },
    pages() {
      return Math.ceil(this.totalCount / this.pagination.rowsPerPage);
    },
    paginationParams() {
      return {
        first: this.pagination.rowsPerPage,
        offset: (this.pagination.page - 1) * this.pagination.rowsPerPage,
      };
    },
    /**
     * 默认排序方法，结合字段上的可排序标志
     */
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
          this.refresh();
        });
    },

    // 删除指定行的数据，需要自己定义 this.gqlDelete
    async deleteRow(id) {
      await this.grequest(this.gqlDelete, {
        id,
      });
      this.modeDelete = false;
    },

    // 提示进行批量删除操作
    showDeleteRows() {
      const safeNames = this.selected.map((v) => escape(v[this.fieldName])).join('<br/>');
      const ids = this.selected.map((v) => v[this.fieldId]);
      this.$q
        .dialog({
          title: `确认删除选中的"${ids.length}"项吗？`,
          message: safeNames,
          html: true,
          cancel: true,
        })
        .onOk(async () => {
          await this.deleteRows(ids);
          this.refresh();
        });
    },

    // 批量删除当前选中项目
    async deleteRows(ids) {
      ids.forEach(this.deleteRow);
    },

    showCreate() {
      this.showEdit(this.initEdata);
    },

    showEdit(row) {
      const validKeys = intersection(keys(row), keys(this.initEdata));
      this.edata = zipObj(validKeys, map((v) => row[v])(validKeys));
      if (row[this.fieldId]) {
        this.edata[this.fieldId] = row[this.fieldId];
      }
      this.modeEdit = true;
    },

    request({ pagination }) {
      this.pagination = { ...pagination };
      this.refresh();
    },

    // 添加或保存数据，需要自定义 this.gqlUpdate 和 this.gqlCreate
    async save() {
      const mutation = this.edata.id ? this.gqlUpdate : this.gqlCreate;
      this.preSave?.();
      const variables = this.edata.id
        ? {
            id: this.edata.id || undefined,
            patch: this.edata,
          }
        : {
            input: this.edata,
          };
      await this.grequest(mutation, variables);
      this.modeEdit = false;
      this.refresh();
    },
    checkProperties() {
      this.assertKeys('fieldId,fieldName,gqlCreate,gqlUpdate,gqlDelete,columns,edata,refresh');
    },
  },
  created() {
    this.checkProperties();
    this.initEdata = { ...this.edata };
  },
};
