<template>
  <div>
    <div class="top-filter">
      <div class="top-filter-title">角色：</div>
      <q-input outlined dense class="top-filter-input" placeholder="请输入角色名称"></q-input>
      <q-input
        style="width:200px;margin-top:20px"
        outlined
        dense
        stack-label
        v-model="time"
        placeholder="请选择开始时间"
        mask="####-##-##"
        :rules="[isValidDateString || '日期格式错误']"
        clearable
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxyHappen" transition-show="scale" transition-hide="scale">
              <q-date minimal v-model="time" @input="$refs.qDateProxyHappen.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div class="top-filter-line">-</div>
      <q-input
        style="width:200px;margin-top:20px;margin-right:20px"
        outlined
        dense
        stack-label
        v-model="time"
        placeholder="请选择结束时间"
        mask="####-##-##"
        :rules="[isValidDateString || '日期格式错误']"
        clearable
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxyHappen" transition-show="scale" transition-hide="scale">
              <q-date minimal v-model="time" @input="$refs.qDateProxyHappen.hide()" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-btn class="top-filter-btn" color="secondary" label="查询"></q-btn>
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
      <q-td slot="body-cell-operation">
        <div class="operation">
          <div style="margin-left:25px" class="operation-title">退补</div>
          <div style="margin-left:25px" class="operation-title">重新补贴</div>
        </div>
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import { date } from 'quasar';
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
          name: 'date',
          label: '补贴发放时间',
          field: 'id',
          align: 'center',
          format: (v) => date.formatDate(v, 'YYYY-MM-DD HH:mm:ss'),
        },
        { name: 'name', label: '角色', field: 'name', align: 'center' },
        { name: 'money', label: '补贴金额', field: 'money', align: 'center' },
        { name: 'way', label: '补贴途径', field: 'way', align: 'center' },
        { name: 'state', label: '补贴当前状态', field: 'state', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [
        {
          id: '1',
          date: '',
          name: '医生',
          way: '角色补贴',
          state: '补贴成功',
          money: 100,
        },
        {
          id: '2',
          date: '',
          name: '护士',
          way: '角色补贴',
          state: '已退补',
          money: 100,
        },
      ],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {},
    };
  },

  async mounted() {
    this.refresh();
  },

  methods: {
    refresh() {},
    /**
     * 检验日期字符串是否符合标准 ####-##-##
     */
    isValidDateStringOrEmpty(str) {
      if (!str) {
        return true;
      }

      return isValidDateString(str);
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
