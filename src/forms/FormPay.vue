<template>
  <q-card>
    <q-form @submit="goSubmit">
      <div class="row top">
        <div class="dialog-title">用户充值</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <div class="dialog-main-title">姓名：</div>
          <div class="dialog-main-title-main">{{ edata.name }}</div>
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">工号</div>
          <div class="dialog-main-title-main">{{ edata.workNo }}</div>
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">金额：</div>
          <q-input
            class="dialog-main-input"
            type="number"
            outlined
            stack-label
            dense
            placeholder="请输入金额"
            v-model="amount"
            :rules="[(v) => v > 0]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">类型：</div>
          <q-radio dense v-model="shape" :val="1" label="充值" />
          <q-radio v-model="shape" :val="2" label="提现" />
        </div>

        <q-btn
          class="dialog-main-btn"
          type="primary"
          :loading="loading > 0"
          :disabled="loading > 0"
          label="确定"
          color="secondary"
        />
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import { MixinForm } from '../mixins/MixinForm';
import { http } from '../utils/luch-request/index.js';

export default {
  name: 'FormPay',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      shape: 1,

      gql: {
        create: 'eventType.create',
        update: 'eventType.update',
        query: 'eventType',
      },

      edata: {},
      amount: '',
    };
  },

  async mounted() {
    this.edata = this.selected[0] ? { ...this.selected[0] } : {};
  },
  methods: {
    preSave() {},
    async goSubmit() {
      this.loading++;
      let params = new FormData();
      params.append('amount', parseFloat(this.amount).toFixed(2));
      params.append('workNo', this.edata.workNo);
      params.append('name', this.edata.name);
      params.append('type', parseInt(this.shape));
      const res = await http.post('/account/recharge', params);
      if (res.res) {
        this.$emit('submit', this.edata);
        this.hide();
        this.alert(this.shape == 1 ? '充值成功' : '提现成功');
      } else {
        this.alert(this.shape == 1 ? '充值失败' : '提现失败');
      }
      this.loading--;
    },
  },
};
</script>
<style scoped>
.top {
  opacity: 1;
  height: 50px;
  background: #01979d;
}
.dialog-title {
  width: 72px;
  opacity: 1;
  font-size: 18px;
  font-family: PingFang SC, PingFang SC-Normal;
  text-align: left;
  color: #ffffff;
  line-height: 50px;
  margin-left: 20px;
}
.dialog-close {
  width: 20px;
  height: 20px;
  margin: 15px 20px;
  cursor: pointer;
}
.dialog-main {
  height: 40px;
  width: 100%;
  margin-bottom: 17px;
}
.dialog-main-title {
  width: 60px;
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  text-align: left;
  line-height: 40px;
}
.dialog-main-title-main {
  width: 250px;
  font-size: 15px;
  font-weight: 600;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  text-align: left;
  line-height: 40px;
}
.dialog-main-input {
  height: 40px;
  width: 250px;
}
.dialog-main-btn {
  margin-top: 12px;
  width: 100%;
  height: 40px;
}
</style>
