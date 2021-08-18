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
      <q-td style="text-align:center;" slot="body-cell-card" slot-scope="{ row }">
        <div v-if="row.card" class="operation">
          <div>{{ row.card }}</div>
          <div class="row">
            <div class="operation-title">更换</div>
            <div style="margin-left:20px;color:#ea5e5e" class="operation-title">解绑</div>
          </div>
        </div>
        <div v-else>
          <div class="operation-title" @click="showBinding(row.id)">+绑定卡号</div>
        </div>
      </q-td>
      <q-td style="text-align:center;" slot="body-cell-balance" slot-scope="{ row }">
        <div class="operation">
          <div>￥{{ row.balance }}</div>
          <div class="row" v-if="isrecharge">
            <div class="operation-title" @click="showPay(row)">充值</div>
          </div>
        </div>
      </q-td>
      <q-td style="text-align:center;" slot="body-cell-allowance" slot-scope="{ row }">
        <div class="operation">
          <div>￥{{ row.allowance }}</div>
          <div class="row" v-if="isrecharge">
            <div style="margin-left:20px" @click="showSubsidy(row)" class="operation-title">补贴</div>
          </div>
        </div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation">
          <div class="operation-title" v-if="isrecharge" @click="showRechargeRecord(row)">充值记录</div>
          <div class="operation-title" v-if="isrecharge" @click="showExpense(row)">消费记录</div>
          <div class="operation-title" v-if="isbase" @click="showEdit(row)">编辑</div>
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
      <form-person
        v-if="isShow.edit"
        :primary-id="primaryId"
        :selected="selected"
        @hide="hideEdit"
        @submit="refresh"
        style="width: 390px;"
        :locked="locked"
        :type="filters.type"
      >
      </form-person>
    </q-dialog>
    <!-- 充值 -->
    <q-dialog v-model="isShow.pay" no-backdrop-dismiss>
      <form-pay
        v-if="isShow.pay"
        :primary-id="primaryId"
        :selected="selected"
        @hide="hidePay"
        @submit="refresh"
        style="width: 390px;"
        :locked="locked"
        :type="filters.type"
      >
      </form-pay>
    </q-dialog>
    <!-- 补贴 -->
    <q-dialog v-model="isShow.subsidy" no-backdrop-dismiss>
      <form-subsidy
        v-if="isShow.subsidy"
        :primary-id="primaryId"
        :selected="selected"
        @hide="hideSubsidy"
        @submit="refresh"
        style="width: 410px;"
        :locked="locked"
        :type="filters.type"
      ></form-subsidy>
    </q-dialog>
    <!-- 绑定卡号 -->
    <q-dialog v-model="isShow.binding" no-backdrop-dismiss>
      <form-binding-card
        v-if="isShow.binding"
        :primary-id="primaryId"
        :selected="selected"
        @hide="hideBinding"
        @submit="refresh"
        style="width: 500px;"
        :locked="locked"
        :type="filters.type"
      ></form-binding-card>
    </q-dialog>
    <!-- 充值记录 -->
    <q-dialog v-model="isShow.rechargeRecord" no-backdrop-dismiss>
      <form-recharge-record
        v-if="isShow.rechargeRecord"
        :primary-id="primaryId"
        :selected="selected"
        @hide="hideRechargeRecord"
        @submit="refresh"
        style="width: 800px;"
        :locked="locked"
        :type="filters.type"
      >
      </form-recharge-record>
    </q-dialog>
    <!-- 消费记录 -->
    <q-dialog v-model="isShow.expense" no-backdrop-dismiss>
      <form-expense
        v-if="isShow.expense"
        :primary-id="primaryId"
        :selected="selected"
        @hide="hideExpemse"
        @submit="refresh"
        style="width: 800px;"
        :locked="locked"
        :type="filters.type"
      ></form-expense>
    </q-dialog>
  </div>
</template>

<script>
import { MixinTable } from '../mixins/MixinTable';
import FormPerson from 'src/forms/FormPerson.vue';
import FormPay from 'src/forms/FormPay.vue';
import FormSubsidy from 'src/forms/FormSubsidy.vue';
import FormBindingCard from 'src/forms/FormBindingCard.vue';
import FormRechargeRecord from 'src/forms/FormRechargeRecord.vue';
import FormExpense from 'src/forms/FormExpense.vue';
import { http } from '../utils/luch-request/index.js';

export default {
  components: { FormPerson, FormPay, FormSubsidy, FormBindingCard, FormRechargeRecord, FormExpense },
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
        { name: 'workNo', label: '工号', field: 'workNo', align: 'center' },
        { name: 'name', label: '姓名', field: 'name', align: 'center' },
        { name: 'phoneNum', label: '手机号', field: 'phoneNum', align: 'center' },
        { name: 'roleName', label: '角色', field: 'roleName', align: 'center' },
        {
          name: 'state',
          label: '状态',
          field: 'state',
          align: 'center',
          format: (v) => (v == 1 ? '已启用' : '已禁用'),
        },
        { name: 'cardNo', label: '绑定卡号', field: 'cardNo', align: 'center' },
        { name: 'balance', label: '余额', field: 'balance', align: 'center' },
        { name: 'allowance', label: '补贴', field: 'allowance', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [],

      // 查询条件
      filters: {},
      //编辑弹出框
      isShow: {
        edit: false,
        pay: false,
        subsidy: false,
        binding: false,
        rechargeRecord: false,
        expense: false,
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
      let url = `/user/get?limit=${this.pagination.rowsPerPage}&page=${this.pagination.page}`;
      if (this.filters) {
        Object.keys(this.filters).forEach((v) => {
          if (this.filters[v] || this.filters[v] === 0) {
            url += `&${v}=${this.filters[v]}`;
          }
        });
      }
      const users = await http.get(url);
      this.rows = users.data.list;
      this.pagination.rowsNumber = users.data.num;
    },
    showPay(row) {
      this.isShow.pay = true;
      this.primaryId = row.id;
      this.selected = [row];
    },
    hidePay() {
      this.isShow.pay = false;
    },
    showSubsidy(row) {
      this.isShow.subsidy = true;
      this.primaryId = row.id;
      this.selected = [row];
    },
    hideSubsidy() {
      this.isShow.subsidy = false;
    },
    showBinding(id) {
      this.isShow.binding = true;
      this.primaryId = id;
    },
    hideBinding() {
      this.isShow.binding = false;
    },
    showEdit(row) {
      this.isShow.edit = true;
      this.primaryId = row.id;
      this.selected = [row];
    },
    showRechargeRecord(row) {
      this.isShow.rechargeRecord = true;
      this.primaryId = row.id;
      this.selected = [row];
    },
    hideRechargeRecord() {
      this.isShow.rechargeRecord = false;
    },
    showExpense(row) {
      this.isShow.expense = true;
      this.primaryId = row.id;
      this.selected = [row];
    },
    hideExpemse() {
      this.isShow.expense = false;
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
      let res = await http.put(`/user/updateState/${row.id}`, params);
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
  justify-content: space-around;
}
.operation-title {
  font-size: 15px;
  color: #109da2;
  cursor: pointer;
}
</style>
