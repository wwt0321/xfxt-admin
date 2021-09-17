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
      :rows-per-page-options="[99]"
      :pagination.sync="pagination"
      @request="request"
      separator="cell"
      flat
    >
      <q-td slot="body-cell-icon" slot-scope="{ row }">
        <div style="text-align: center;"><q-icon :name="row.icon" /></div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation" v-if="row.name != 'admin'">
          <div class="operation-title" @click="showEdit(row)">编辑</div>
          <div class="operation-title" @click="del(row)">删除</div>
        </div>
      </q-td>
    </q-table>
    <!-- 添加/编辑用户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-function
        v-if="isShow.edit"
        :primary-id="primaryId"
        :selected="selected"
        @hide="hideEdit"
        @submit="refresh"
        style="width: 390px;"
      />
    </q-dialog>
  </div>
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import FormFunction from 'src/forms/FormFunction.vue';
import { http } from '../utils/luch-request/index.js';

export default {
  components: { FormFunction },
  name: 'TableFunction',
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
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        { name: 'name', label: '名称', field: 'name', align: 'left', format: (v, r) => (r.parent ? '├' + v : v) },
        { name: 'icon', label: '图标', field: 'icon', align: 'center' },
        { name: 'route', label: '前端路径', field: 'route', align: 'center' },
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
      //const users = await http.get('/system/getFunctions');
      this.rows = [
        {
          id: 10100,
          name: '首页',
          icon: 'https',
          route: '/home',
          parent: '10000',
        },
        {
          id: 10200,
          name: '用户管理',
          icon: 'https',
          route: '/person',
          parent: '10000',
        },
        {
          id: 10300,
          name: '角色管理',
          icon: 'https',
          route: '/role',
          parent: '10000',
        },
        {
          id: 10400,
          name: '商户管理',
          icon: 'https',
          route: '/shop',
          parent: '10000',
        },
        {
          id: 10500,
          name: '补贴方案设置',
          icon: 'https',
          route: '/subsidy',
          parent: '10000',
        },
        {
          id: 10600,
          name: '补贴记录',
          icon: 'https',
          route: '/record',
          parent: '10000',
        },
        {
          id: 10700,
          name: '统计报表',
          icon: 'https',
          route: '/statistical',
          parent: '10000',
        },
        {
          id: 20100,
          name: '菜单管理',
          icon: 'https',
          route: '/statistical',
          parent: '10000',
        },
        {
          id: 20200,
          name: '账号管理',
          icon: 'https',
          route: '/admin',
          parent: '10000',
        },
        {
          id: 20300,
          name: '权限管理',
          icon: 'https',
          route: '/authority',
          parent: '10000',
        },
      ];
      this.pagination.rowsNumber = this.rows.length;
    },
    showEdit(row) {
      this.isShow.edit = true;
      this.primaryId = row.id;
      this.selected = [row];
    },
    goSearch(select) {
      this.pagination.page = 1;
      this.filters = select;
      this.refresh();
    },
    async del({ id, name }) {
      const isConfirm = await this.confirm(`确认删除“${name}”？`);
      if (!isConfirm) {
        return;
      }

      this.loading++;
      const res = await http.delete(`/system/deleteFunction?id=${id}`);
      console.log(res);
      if (res.res) {
        this.refresh();
        this.alert('删除成功');
      } else {
        this.alert('删除失败');
      }
      this.loading--;
    },
  },
};
</script>
<style scoped>
.operation {
  margin: 0 auto;
  width: 100px;
  display: flex;
  justify-content: space-around;
}
.operation-title {
  font-size: 15px;
  color: #109da2;
  cursor: pointer;
}
</style>
