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
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation" v-if="row.name != 'admin'">
          <!--<div class="operation-title" @click="showEdit(row)">编辑</div>-->
          <div class="operation-title" @click="resetPassword(row)">重置密码</div>
          <div class="operation-title" @click="del(row)">删除</div>
        </div>
      </q-td>
    </q-table>
    <!-- 添加/编辑用户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-admin v-if="isShow.edit" :selected="selected" @hide="hideEdit" @submit="refresh" style="width: 390px;">
      </form-admin>
    </q-dialog>
  </div>
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import FormAdmin from 'src/forms/FormAdmin.vue';
import { http } from '../utils/luch-request/index.js';

export default {
  components: { FormAdmin },
  name: 'TablePerson',
  mixins: [MixinTable],
  data() {
    return {
      //字段id（新增为undefine，修改为该字段id）
      primaryId: undefined,
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
        { name: 'name', label: '姓名', field: 'name', align: 'center' },
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
      let url = `/system/getUsers?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}`;
      if (this.filters) {
        Object.keys(this.filters).forEach((v) => {
          if (this.filters[v] || this.filters[v] === 0) {
            url += `&${v}=${this.filters[v]}`;
          }
        });
      }
      const users = await http.get(url);
      this.rows = users.data;
      this.pagination.rowsNumber = users.data.num;
    },
    showEdit(row) {
      this.isShow.edit = true;
      this.selected = [row];
    },
    goSearch(select) {
      this.pagination.page = 1;
      this.filters = select;
      this.refresh();
    },
    async resetPassword({ id, name }) {
      const isConfirm = confirm(`确认重置${name}的密码？`);
      if (!isConfirm) {
        return;
      }

      this.loading++;
      const res = await http.put(`/system/updateUser?id=${id}&password=123456`);
      console.log(res);
      if (res.res) {
        alert('重置成功');
      } else {
        alert('重置失败');
      }
      this.loading--;
    },
    async del({ id, name }) {
      const isConfirm = confirm(`确认删除${name}？`);
      if (!isConfirm) {
        return;
      }

      this.loading++;
      const res = await http.delete(`/system/deleteUser?id=${id}`);
      console.log(res);
      if (res.res) {
        this.refresh();
        alert('删除成功');
      } else {
        alert('删除失败');
      }
      this.loading--;
    },
  },
};
</script>
<style scoped>
.operation {
  margin: 0 auto;
  width: 200px;
  display: flex;
  justify-content: space-around;
}
.operation-title {
  font-size: 15px;
  color: #109da2;
  cursor: pointer;
}
</style>
