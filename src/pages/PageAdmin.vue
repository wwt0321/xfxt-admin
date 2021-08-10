<template>
  <div class="q-ma-md">
    <q-btn class="body-btn" color="secondary" label="新增账号" @click="addPerson"></q-btn>
    <table-admin ref="table" />
  </div>
</template>

<script>
import { http } from '../utils/luch-request/index.js';
import TableAdmin from 'src/tables/TableAdmin.vue';

export default {
  name: 'PageAdmin',
  components: { TableAdmin },
  data() {
    return {
      // 主键字段和名称字段
      fieldId: 'id',
      fieldName: 'name',

      // 改动数据的接口名称
      gqlCreate: 'admin.create',
      gqlUpdate: 'admin.update',
      gqlDelete: 'admin.delete',

      // 表格列设置
      columns: [
        { name: 'name', label: '账号', field: 'name', align: 'left' },
        { name: 'role', label: '类型', field: 'role', align: 'left', format: (v) => v?.name || '无' },
        { name: 'tzCreate', label: '创建时间', field: 'tzCreate', align: 'left' },
        { name: 'parent', label: '上级', field: 'parent', align: 'left', format: (v) => v?.name || '无' },
        { name: 'operation', label: '操作', style: 'width: 100px', align: 'right' },
      ],
      edata: {
        name: '',
        roleId: '',
      },
      filters: {},
    };
  },

  mounted() {},

  methods: {
    addPerson() {
      this.$refs.table.showCreate();
    },
  },
};
</script>

<style scoped>
.body-btn {
  height: 40px;
  margin-bottom: 13px;
}
</style>
