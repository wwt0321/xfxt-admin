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
      <q-td slot="body-cell-impose" slot-scope="{ row }">
        <div class="operation">
          <div>每日上限：{{ row.everyday }}；单词限额：{{ row.everytime }}</div>
          <div style="margin-left:55px;" class="operation-title" @click="showAstrict(row.id)">设置</div>
        </div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation">
          <div class="operation-title" @click="showSubsidies(row.id)">补贴发放</div>
          <div style="margin-left:25px" class="operation-title" @click="showEdit(row.id)">编辑</div>
          <div style="margin-left:25px;color:#ea5e5e" class="operation-title">删除</div>
        </div>
      </q-td>
    </q-table>
    <!-- 添加/编辑用户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-role
        v-if="isShow.edit"
        :primary-id="primaryId"
        @hide="hideEdit"
        @submit="refresh"
        style="width: 410px;"
        :locked="locked"
        :type="filters.type"
      ></form-role>
    </q-dialog>
    <!-- 消费限制 -->
    <q-dialog v-model="isShow.astrict" no-backdrop-dismiss>
      <form-astrict
        v-if="isShow.astrict"
        :primary-id="primaryId"
        @hide="hideAstrict"
        @submit="refresh"
        style="width: 410px;"
        :locked="locked"
        :type="filters.type"
      ></form-astrict>
    </q-dialog>
    <!-- 补贴发放 -->
    <q-dialog v-model="isShow.subsidies" no-backdrop-dismiss>
      <form-subsidies
        v-if="isShow.subsidies"
        :primary-id="primaryId"
        @hide="hideSubsidies"
        @submit="refresh"
        style="width: 410px;"
        :locked="locked"
        :type="filters.type"
      ></form-subsidies>
    </q-dialog>
  </div>
</template>

<script>
import FormRole from 'src/forms/FormRole.vue';
import { MixinTable } from '../mixins/MixinTable';
import FormAstrict from 'src/forms/FormAstrict.vue';
import FormSubsidies from 'src/forms/FormSubsidies.vue';
export default {
  components: { FormRole, FormAstrict, FormSubsidies },
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
        { name: 'user', label: '角色', field: 'user', align: 'center' },
        { name: 'impose', label: '消费限制', field: 'impose', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [
        {
          id: '1',
          user: '测试',
          everyday: '500',
          everytime: '500',
        },
      ],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {
        edit: false,
        astrict: false,
        subsidies: false,
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
    showAstrict(id) {
      this.isShow.astrict = true;
      this.primaryId = id;
    },
    hideAstrict() {
      this.isShow.astrict = false;
    },
    showSubsidies(id) {
      this.isShow.subsidies = true;
      this.primaryId = id;
    },
    hideSubsidies() {
      this.isShow.subsidies = false;
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
