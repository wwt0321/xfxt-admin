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
      <q-td slot="body-cell-body" slot-scope="{ row }">
        <div class="operation">医生：{{ row.doctor }}；护士：{{ row.nurse }}，主任：{{ row.director }}</div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation">
          <div style="margin-left:25px" class="operation-title">发放</div>
          <div style="margin-left:25px" class="operation-title" @click="showEdit(row.id)">编辑</div>
          <div style="margin-left:25px;color:#ea5e5e" class="operation-title">删除</div>
        </div>
      </q-td>
    </q-table>
    <!-- 添加/编辑用户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-allowancei
        v-if="isShow.edit"
        :primary-id="primaryId"
        @hide="hideEdit"
        @submit="refresh"
        style="width: 410px;"
        :locked="locked"
        :type="filters.type"
      ></form-allowancei>
    </q-dialog>
  </div>
</template>

<script>
import FormAllowancei from 'src/forms/FormAllowancei.vue';
import { MixinTable } from '../mixins/MixinTable';
export default {
  components: { FormAllowancei },
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
        { name: 'id', label: '序号', field: 'id', align: 'center' },
        { name: 'name', label: '方案名称', field: 'name', align: 'center' },
        { name: 'body', label: '方案内容', field: 'body', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [
        {
          id: '1',
          name: '方案一',
          doctor: 100,
          nurse: 100,
          director: 100,
        },
      ],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {
        edit: false,
      },
    };
  },

  async mounted() {
    this.refresh();
  },

  methods: {
    refresh() {},
    showEdit(id) {
      this.isShow.edit = true;
      this.primaryId = id;
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
