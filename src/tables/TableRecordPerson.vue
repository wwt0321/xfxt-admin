<template>
  <div>
    <div class="top-filter">
      <div class="top-filter-title">工号：</div>
      <q-input v-model="filters.workNo" outlined dense class="top-filter-input" placeholder="请输入工号"></q-input>
      <div class="top-filter-title">姓名：</div>
      <q-input v-model="filters.name" outlined dense class="top-filter-input" placeholder="请输入姓名"></q-input>
      <div class="top-filter-title" style="width:72px;">发放时间：</div>
      <q-input
        style="width:200px;"
        type="date"
        outlined
        dense
        stack-label
        v-model="filters.startTime"
        placeholder="请选择开始时间"
        mask="####-##-##"
        clearable
      ></q-input>
      <div class="top-filter-line">-</div>
      <q-input
        style="width:200px;margin-right:20px"
        type="date"
        outlined
        dense
        stack-label
        v-model="filters.endTime"
        placeholder="请选择结束时间"
        mask="####-##-##"
        clearable
      ></q-input>
      <q-btn class="top-filter-btn" color="secondary" label="查询" @click="refresh"></q-btn>
    </div>
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
          <div
            class="operation-title"
            :style="row.state == 1 ? '' : 'color:grey'"
            :loading="loading > 0"
            @click="refund(row)"
          >
            退补
          </div>
          <!--<div style="margin-left:25px" class="operation-title" :loading="loading > 0" @click="regrant(row)">
            重新补贴
          </div>-->
        </div>
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import { date } from 'quasar';
import { http } from '../utils/luch-request/index.js';
export default {
  name: 'TableAnnouncement',
  mixins: [MixinTable],
  data() {
    return {
      edata: {},
      time: '',
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
        {
          name: 'time',
          label: '补贴发放时间',
          field: 'time',
          align: 'center',
          format: (v) => date.formatDate(v, 'YYYY-MM-DD HH:mm:ss'),
        },
        { name: 'name', label: '姓名', field: 'name', align: 'center' },
        { name: 'amount', label: '补贴金额', field: 'amount', align: 'center' },
        { name: 'way', label: '补贴途径', field: 'way', align: 'center', format: (v) => '个人补贴' },
        {
          name: 'state',
          label: '补贴当前状态',
          field: 'state',
          align: 'center',
          format: (v) => (v == 2 ? '已退补' : '补贴成功'),
        },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [],

      // 查询条件
      filters: {
        workNo: '',
        name: '',
        startTime: '',
        endTime: '',
      },
      //编辑弹出框
      isShow: {},
    };
  },

  async mounted() {
    this.refresh();
  },

  methods: {
    async refresh() {
      this.selected = [];
      let url = `/record/user?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}`;
      if (this.filters) {
        let filters = { ...this.filters };
        filters.startTime = filters.startTime ? new Date(filters.startTime).getTime() : '';
        filters.endTime = filters.endTime ? new Date(filters.endTime).getTime() + 1000 * 60 * 60 * 24 : '';
        Object.keys(filters).forEach((v) => {
          if (filters[v] || filters[v] === 0) {
            url += `&${v}=${filters[v]}`;
          }
        });
      }
      const res = await http.get(url);
      this.rows = res.data.list;
      this.pagination.rowsNumber = res.data.num;
    },
    /**
     * 检验日期字符串是否符合标准 ####-##-##
     */
    isValidDateStringOrEmpty(str) {
      if (!str) {
        return true;
      }

      return isValidDateString(str);
    },
    async refund(row) {
      if (row.state == 1) {
        let result = confirm(`确认对“${row.name}”进行退补?`);
        if (result) {
          this.loading++;
          let params = new FormData();
          params.append('id', row.id);
          const res = await http.put('/distribute/refundByUser', params);
          if (res.res) {
            this.refresh();
            alert('退补成功');
          } else {
            alert('退补失败');
          }
          this.loading--;
        }
      }
    },
    async regrant(row) {
      let result = confirm(`确认对“${row.name}”进行重新补贴?`);
      if (result) {
        this.loading++;
        let params = new FormData();
        params.append('workNo', row.roleId);
        params.append('username', row.roleName);
        params.append('amount', row.amount);
        const res = await http.post('/distribute/user', params);
        if (res.res) {
          this.refresh();
          alert('重新补贴成功');
        } else {
          alert('重新补贴失败');
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
.top-filter {
  margin-bottom: 20px;
  height: 40px;
  display: flex;
  align-items: center;
}
.top-filter-title {
  width: 42px;
  line-height: 20px;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  margin-right: 8px;
}
.top-filter-input {
  width: 150px;
  margin-right: 20px;
}
.top-filter-btn {
  width: 80px;
  height: 40px;
}
.top-filter-line {
  width: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
</style>
