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
export default {
  name: 'TableAnnouncement',
  mixins: [MixinTable],
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
        { name: 'time', label: '时间', field: 'time', align: 'center' },
        { name: 'name', label: '姓名', field: 'name', align: 'center' },
        { name: 'money', label: '充值金额', field: 'money', align: 'center' },
        { name: 'style', label: '充值类型', field: 'style', align: 'center' },
      ],

      rows: [
        {
          time: '',
          name: '张三',
          money: 100,
          style: '充值',
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
  justify-content: space-around;
}
.operation-title {
  font-size: 15px;
  color: #109da2;
  cursor: pointer;
}
</style>
