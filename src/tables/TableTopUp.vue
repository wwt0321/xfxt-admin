<template>
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
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import { date } from 'quasar';
import { http } from '../utils/luch-request/index.js';
export default {
  name: 'TableAnnouncement',
  mixins: [MixinTable],
  props: ['work'],
  data() {
    return {
      edata: {},
      time: '',
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
        { name: 'amount', label: '充值金额', field: 'amount', align: 'center', format: (v) => `￥${v}` },
        { name: 'type', label: '充值类型', field: 'type', align: 'center', format: (v) => (v == 1 ? '充值' : '提现') },
      ],

      rows: [],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {},
    };
  },

  async mounted() {},

  methods: {
    async refresh(type) {
      this.selected = [];
      let url = `/account/getRecords?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}&workNo=${this.work}`;
      if (type) {
        url += `&type=${type}`;
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
  justify-content: center;
}
.operation-title {
  font-size: 15px;
  color: #109da2;
  cursor: pointer;
}
</style>
