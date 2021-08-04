import { keys, intersection, pluck } from 'rambda';
import { MixinUtils } from '../mixins/MixinUtils';
import { MixinCommon } from '../mixins/MixinCommon';
import { escape } from 'html-escaper';

export const MixinTable = {
  mixins: [MixinUtils, MixinCommon],
  data() {
    return {
      core: {}, // 模块内部核心数据
      operations: [], // 当前用户可以执行的操作
      rows: [], // 列表数据
      loading: 0, // 加载状态指示器
      mutating: 0, // 写入状态指示器，大于 0 时禁用写操作按钮
      nativeVisibleColumns: [],
      pagination: {
        sortBy: '',
        descending: Boolean,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        maxpage: 1,
      },
      columns: [],
      selected: [],

      gql: {},

      //手工表格选择每页的行数
      options: [10, 20, 50],

      primaryId: undefined,

      isShow: {
        edit: false,
      },
    };
  },
  props: {
    locked: {
      type: Object,
      default: () => {
        return {};
      },
    },
    lockedVisibleColumns: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
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
     * 根据内部和外部的条件决定显示哪些列
     */
    visibleColumns() {
      if (this.nativeVisibleColumns.length && this.lockedVisibleColumns.length) {
        return intersection(this.nativeVisibleColumns, this.lockedVisibleColumns);
      }
      if (this.nativeVisibleColumns.length) {
        return this.nativeVisibleColumns;
      }
      if (this.lockedVisibleColumns.length) {
        return this.lockedVisibleColumns;
      }
      return pluck('name', this.columns);
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
    hide() {
      this.$emit('hide');
    },
    showEdit() {
      this.isShow.edit = true;
      this.primaryId = this.selected[0][this.fieldId];
    },
    showCreate() {
      this.isShow.edit = true;
      this.primaryId = undefined;
      this.selected = [];
    },
    hideEdit() {
      this.isShow.edit = false;
    },

    // 权限判定
    permission(operation) {
      return (
        (_.include(window.permission, '*') || _.include(window.permission, operation)) &&
        !_.include(window.permission, `!${operation}`)
      );
    },

    clearSelect() {
      this.selected = [];
    },

    // 给表格中删除按钮绑定此事件，让用户确认是否删除当前行
    confirmDeleteRow(name, id) {
      this.$q
        .dialog({
          title: `确认删除"${name}"？`,
          cancel: true,
        })
        .onOk(async () => {
          await this.deleteRow(id);
          await this.refresh();
          this.clearSelect();
        });
    },

    // 删除指定行的数据，需要自己定义 this.gql.delete
    async deleteRow(id) {
      await this.grequest(this.gql.delete, {
        id,
      });
    },

    // 提示进行批量删除操作
    showDeleteRows() {
      const safeNames = this.selected.map((v) => escape(v[this.fieldName] || '')).join('<br/>');
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
          await this.refresh();
          this.clearSelect();
        });
    },

    // 批量删除当前选中项目
    async deleteRows(ids) {
      await Promise.all(ids.map(this.deleteRow));
    },

    request({ pagination }) {
      this.pagination = { ...pagination };
      this.refresh();
    },

    /**
     * simpleList 简单列表，只需传入查询名称
     * 简单列表刷新，只需传入 graphql query 名称和分页之外的参数
     *
     * @param queryName {String} - 查询名称
     * @param params {Object} - 分页与查询条件参数
     * @param returnOnly {Boolean} - 是否只返回数据，但不更新 this.rows
     * @return Promise<Object[]>;
     */
    async simpleList(queryName, params = {}, returnOnly = false) {
      const data = await this.grequest(queryName, {
        ...this.paginationParams,
        ...params,
      });
      const k = keys(data);
      if (k.length != 1) {
        this.$q.notify({
          message: `simpleList 只支持一个健，实际得到了${k}`,
          icon: 'report_problem',
        });
        throw data;
      }
      this.pagination.rowsNumber = data[k[0]].totalCount;
      if (returnOnly) {
        return data[k[0]].nodes;
      }
      this.rows = data[k[0]].nodes;
      return this.rows;
    },

    /**
     * 检查是属性是否有缺失或使用了过时的属性
     */
    $checkProperties() {
      if (this.$options.name?.substring(0, 5) != 'Table') {
        this.alert('name 不符合命名规则，必须以 Table 开头');
      }
      this.assertKeys('$options.name,fieldId,fieldName,columns,isShow,refresh');
      this.deprecated('gqlDelete,modeEdit');
    },

    /**
     * 初始化
     */
    init() {
      this.$checkProperties();

      // 初始化核心变量
      this.core.name = this.$options.name.substring(5);

      // 初始化可以自动推断的变量
      if (!this.gql.delete) {
        this.gql.delete = `delete${this.core.name}`;
      }

      // 根据特殊属性生成关联的方法
      this.$watchShowHide();
    },
  },
  async created() {
    this.init();
  },
};
