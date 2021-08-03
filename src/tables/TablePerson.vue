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
          <div>{{ row.balance }}</div>
          <div class="row">
            <div class="operation-title" @click="showPay(row.id)">充值</div>
            <div style="margin-left:20px" @click="showSubsidy(row.id)" class="operation-title">补贴</div>
          </div>
        </div>
      </q-td>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <div class="operation">
          <div class="operation-title" @click="showRechargeRecord(row.id)">充值记录</div>
          <div class="operation-title" @click="showExpense(row.id)">消费记录</div>
          <div class="operation-title" @click="showEdit(row.id)">编辑</div>
          <div class="operation-title" style="color:#ea5e5e">删除</div>
        </div>
      </q-td>
    </q-table>
    <!-- 添加/编辑用户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-person
        v-if="isShow.edit"
        :primary-id="primaryId"
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
        { name: 'number', label: '工号', field: 'number', align: 'center' },
        { name: 'name', label: '姓名', field: 'name', align: 'center' },
        { name: 'phone', label: '手机号', field: 'phone', align: 'center' },
        { name: 'role', label: '角色', field: 'role', align: 'center' },
        { name: 'card', label: '绑定卡号', field: 'card', align: 'center' },
        { name: 'balance', label: '余额', field: 'balance', align: 'center' },
        { name: 'operation', label: '操作', field: 'operation', align: 'center' },
      ],

      rows: [
        {
          id: '1',
          number: '001',
          name: '张三',
          phone: '18658246353',
          role: '医生',
          card: '11111',
          balance: '100.00/60.00',
        },
        {
          id: '2',
          number: '002',
          name: '李四',
          phone: '18658246353',
          role: '护士',
          card: '',
          balance: '100.00/60.00',
        },
      ],

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
    };
  },

  async mounted() {
    this.refresh();
  },

  methods: {
    refresh() {},
    showPay(id) {
      this.isShow.pay = true;
      this.primaryId = id;
    },
    hidePay() {
      this.isShow.pay = false;
    },
    showSubsidy(id) {
      this.isShow.subsidy = true;
      this.primaryId = id;
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
    showEdit(id) {
      this.isShow.edit = true;
      this.primaryId = id;
    },
    showRechargeRecord(id) {
      this.isShow.rechargeRecord = true;
      this.primaryId = id;
    },
    hideRechargeRecord() {
      this.isShow.rechargeRecord = false;
    },
    showExpense(id) {
      this.isShow.expense = true;
      this.primaryId = id;
    },
    hideExpemse() {
      this.isShow.expense = false;
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
