<template>
  <div>
    <!-- 数据列表 -->
    <q-table
      class="my-sticky-header-table"
      style="border: 1px solid rgba(0, 0, 0, 0.12);"
      color="primary"
      row-key="id"
      :columns="columns"
      :data="rows"
      :loading="loading > 0"
      :rows-per-page-options="[10, 20, 50]"
      :pagination.sync="pagination"
      @request="request"
      separator="cell"
      flat
    >
    </q-table>
  </div>
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import { date } from 'quasar';
import { http } from '../utils/luch-request/index.js';
export default {
  name: 'TableAnnouncement',
  mixins: [MixinTable],
  props: ['search'],
  data() {
    return {
      edata: {},
      // 主键字段和名称字段
      fieldId: 'id',
      fieldName: 'number',

      // 改动数据的接口名称
      gql: {
        create: '',
        update: '',
      },

      // 表格列设置
      columns: [
        {
          name: 'time',
          label: '时间',
          field: 'time',
          align: 'center',
          format: (v) => date.formatDate(v, 'YYYY-MM-DD HH:mm:ss'),
        },
        { name: 'userName', label: '姓名', field: 'userName', align: 'center' },
        { name: 'amount', label: '补贴金额', field: 'amount', align: 'center', format: (v) => `￥${v}` },
        {
          name: 'type',
          label: '补贴类型',
          field: 'type',
          align: 'center',
          format: (v) => (v == 1 ? '个人补贴' : v == 2 ? '角色补贴' : '方案补贴'),
        },
      ],

      rows: [],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {},
    };
  },

  async mounted() {
    //this.refresh();
  },

  methods: {
    async refresh() {
      this.selected = [];
      let url = `/statistics/user?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}&type=2`;
      if (this.search) {
        let filters = { ...this.search };
        Object.keys(filters).forEach((v) => {
          if (filters[v] || filters[v] == 0) {
            url += `&${v}=${filters[v]}`;
          }
        });
      }
      const users = await http.get(url);
      this.rows = users.data.list;
      this.pagination.rowsNumber = users.data.num;
    },
  },
};
</script>
<style scoped>
.operation {
  display: flex;
  justify-content: space-around;
}
.operation-title {
  font-size: 15px;
  color: #109da2;
  cursor: pointer;
}
</style>
