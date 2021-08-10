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
        { name: 'shop', label: '消费商户', field: 'shop', align: 'center' },
        { name: 'amount', label: '消费金额', field: 'amount', align: 'center', format: (v) => `￥${v}` },
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
    async refresh() {
      this.selected = [];
      let filters = { ...this.search };
      let url = `/statistics/store?startTime=${filters.startTime}&endTime=${filters.endTime}`;
      const store = await http.get(url);
      console.log(3333, store);
      //this.rows = store.data.list;
      //this.pagination.rowsNumber = store.data.num;
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
