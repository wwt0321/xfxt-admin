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
          <div style="margin-left:25px" class="operation-title" :loading="loading > 0" @click="send(row)">发放</div>
          <div style="margin-left:25px" class="operation-title" @click="showEdit(row)">编辑</div>
          <div
            style="margin-left:25px;color:#ea5e5e"
            class="operation-title"
            :loading="loading > 0"
            @click="goDel(row)"
          >
            删除
          </div>
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
        :selected="selected"
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
import { http } from '../utils/luch-request/index.js';
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
        { name: 'contain', label: '方案内容', field: 'contain', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [],

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
    async refresh() {
      this.selected = [];
      let url = `/plan/get?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}`;
      if (this.filters) {
        Object.keys(this.filters).forEach((v) => {
          if (this.filters[v] || this.filters[v] == 0) {
            url += `&${v}=${this.filters[v]}`;
          }
        });
      }
      const plans = await http.get(url);
      this.rows = plans.data.list;
      this.pagination.rowsNumber = plans.data.num;
    },
    showEdit(row) {
      this.isShow.edit = true;
      this.selected[0] = row;
    },
    async send(row) {
      let result = confirm(`确认发放“${row.name}”补贴?`);
      if (result) {
        this.loading++;
        let params = new FormData();
        params.append('id', row.id);
        let res = await http.post('/distribute/planID', params);
        if (res.res) {
          alert('发放补贴成功');
        } else {
          alert('发放补贴失败');
        }
        this.loading--;
      }
    },
    async goDel(row) {
      let result = confirm(`确认删除“${row.name}”?`);
      if (result) {
        this.loading++;
        let params = new FormData();
        params.append('id', row.id);
        let res = await http.delete(`/plan/delete/${row.id}`, params);
        if (res.res) {
          alert('删除成功');
          this.refresh();
        } else {
          alert('删除失败');
        }
        this.loading--;
      }
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
