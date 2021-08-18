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
          <div>每日上限：￥{{ row.max || 0 }}；单次限额：￥{{ row.limit || 0 }}</div>
          <div style="margin-left:55px;" class="operation-title" v-if="isbase" @click="showAstrict(row)">设置</div>
        </div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation">
          <div class="operation-title" v-if="isrecharge" @click="showSubsidies(row)">补贴发放</div>
          <div style="margin:0 25px" class="operation-title" v-if="isbase" @click="showEdit(row)">编辑</div>
          <div class="operation-title" v-if="row.state == 2 && isbase" @click="changeState(row, 1)">启用</div>
          <div
            class="operation-title"
            style="color:#ea5e5e"
            v-if="row.state == 1 && isbase"
            @click="changeState(row, 2)"
          >
            禁用
          </div>
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
        :selected="selected"
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
        :selected="selected"
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
        :selected="selected"
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
import { http } from '../utils/luch-request/index.js';
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
        create: '/role/add',
        update: '',
      },

      // 表格列设置
      columns: [
        { name: 'id', label: '序号', field: 'id', align: 'center' },
        { name: 'name', label: '角色', field: 'name', align: 'center' },
        {
          name: 'state',
          label: '状态',
          field: 'state',
          align: 'center',
          format: (v) => (v == 1 ? '已启用' : '已禁用'),
        },
        { name: 'impose', label: '消费限制', field: 'impose', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {
        edit: false,
        astrict: false,
        subsidies: false,
      },
      isrecharge: false,
      isbase: false,
    };
  },

  async mounted() {
    let sroles = JSON.parse(localStorage.user).roleList;
    let index1 = sroles.findIndex((v) => v.id == 3);
    if (index1 > -1) {
      this.isrecharge = true;
    }
    let index2 = sroles.findIndex((v) => v.id == 2);
    if (index2 > -1) {
      this.isbase = true;
    }
    this.refresh();
  },

  methods: {
    async refresh() {
      this.selected = [];
      let url = `/role/get?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}`;
      if (this.filters) {
        Object.keys(this.filters).forEach((v) => {
          if (this.filters[v] || this.filters[v] === 0) {
            url += `&${v}=${this.filters[v]}`;
          }
        });
      }
      const roles = await http.get(url);
      this.rows = roles.data.list;
      this.pagination.rowsNumber = roles.data.num;
    },
    showEdit(row) {
      this.isShow.edit = true;
      this.selected[0] = row;
    },
    showAstrict(row) {
      this.isShow.astrict = true;
      this.selected[0] = row;
    },
    hideAstrict() {
      this.isShow.astrict = false;
    },
    showSubsidies(row) {
      this.isShow.subsidies = true;
      this.selected[0] = row;
    },
    hideSubsidies() {
      this.isShow.subsidies = false;
    },
    goSearch(select) {
      this.pagination.page = 1;
      this.filters = select;
      this.refresh();
    },
    async changeState(row, state) {
      let params = new FormData();
      params.append('id', row.id);
      params.append('state', state);
      let res = await http.put(`/role/updateState/${row.id}`, params);
      if (res.res) {
        alert(`${state == 1 ? '启用' : '禁用'}成功`);
      } else {
        alert(`${state == 1 ? '启用' : '禁用'}失败`);
      }
      this.refresh();
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
