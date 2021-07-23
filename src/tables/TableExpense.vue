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
    <q-td style="text-align:center" slot="body-cell-money" slot-scope="{ row }"> ￥{{ row.money }} </q-td>
  </q-table>
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import { date } from 'quasar';
export default {
  name: 'TableAnnouncement',
  mixins: [MixinTable],
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
          name: 'date',
          label: '时间',
          field: 'id',
          align: 'center',
          format: (v) => date.formatDate(v, 'YYYY-MM-DD HH:mm:ss'),
        },
        { name: 'money', label: '金额', field: 'money', align: 'center' },
        { name: 'content', label: '内容', field: 'content', align: 'center' },
        { name: 'shop', label: '商户', field: 'shop', align: 'center' },
      ],

      rows: [
        {
          date: '',
          money: 30,
          content: '套餐',
          shop: '食堂',
        },
      ],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {},
    };
  },

  async mounted() {
    this.refresh();
  },

  methods: {
    refresh() {},
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
