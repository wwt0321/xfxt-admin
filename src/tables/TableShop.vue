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
      <q-td slot="body-cell-number" slot-scope="{ row }">
        <div style="text-align:center;" v-for="(v, n) in row.nums" :key="n">{{ v }}</div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation">
          <div style="margin-right:25px" class="operation-title" @click="showEdit(row)">编辑</div>
          <div class="operation-title" v-if="row.state == 2" @click="changeState(row, 1)">启用</div>
          <div class="operation-title" style="color:#ea5e5e" v-if="row.state == 1" @click="changeState(row, 2)">
            禁用
          </div>
        </div>
      </q-td>
    </q-table>
    <!-- 添加/编辑商户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-shop
        v-if="isShow.edit"
        :primary-id="primaryId"
        @hide="hideEdit"
        @submit="refresh"
        :selected="selected"
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
import { http } from '../utils/luch-request/index.js';
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
        {
          name: 'state',
          label: '状态',
          field: 'state',
          align: 'center',
          format: (v) => (v == 1 ? '已启用' : '已禁用'),
        },
        { name: 'number', label: '消费机编号', field: 'number', align: 'center' },
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
      let url = `/merchants/get?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}`;
      if (this.filters) {
        Object.keys(this.filters).forEach((v) => {
          if (this.filters[v] || this.filters[v] === 0) {
            url += `&${v}=${this.filters[v]}`;
          }
        });
      }
      const merchants = await http.get(url);
      merchants.data.list.forEach((v) => {
        v.nums = v.posNums ? v.posNums.split(';') : [];
      });
      this.rows = merchants.data.list;
      this.pagination.rowsNumber = merchants.data.num;
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

    async changeState(row, state) {
      let params = new FormData();
      params.append('id', row.id);
      params.append('state', state);
      let res = await http.put(`/merchants/updateState/${row.id}`, params);
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
