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
      <q-td slot="body-cell-number" slot-scope="{ row }">
        <div class="operation">
          <span v-for="(v, index) in row.number" :key="index">
            {{ v.number }}<span v-if="index !== row.number.length - 1">；</span>
          </span>
        </div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation">
          <div style="margin-left:25px" class="operation-title" @click="showEdit(row.id)">编辑</div>
          <div style="margin-left:25px;color:#ea5e5e" class="operation-title">删除</div>
        </div>
      </q-td>
    </q-table>
    <!-- 添加/编辑用户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-shop
        v-if="isShow.edit"
        :primary-id="primaryId"
        @hide="hideEdit"
        @submit="refresh"
        style="width: 430px;"
        :locked="locked"
        :type="filters.type"
      ></form-shop>
    </q-dialog>
  </div>
</template>

<script>
import FormShop from 'src/forms/FormShop.vue';
import { MixinTable } from '../mixins/MixinTable';
export default {
  components: { FormShop },
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
        { name: 'name', label: '商户名称', field: 'name', align: 'center' },
        { name: 'number', label: '编号', field: 'number', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [
        {
          id: '1',
          name: '测试',
          number: [{ number: '281928282828289' }, { number: '382828282822828' }],
        },
      ],

      // 查询条件
      filters: {
        edit: false,
      },
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
  showEdit(id) {
    this.isShow.edit = true;
    this.primaryId = id;
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
