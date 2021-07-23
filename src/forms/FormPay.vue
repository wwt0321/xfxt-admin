<template>
  <q-card>
    <q-form @submit="submit">
      <div class="row top">
        <div class="dialog-title">用户充值</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <div class="dialog-main-title">姓名：</div>
          <div class="dialog-main-title-main">张三</div>
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">工号</div>
          <div class="dialog-main-title-main">000001</div>
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">金额：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入金额"
            v-model="edata.name"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">类型：</div>
          <q-radio dense v-model="shape" val="0" label="充值" />
          <q-radio v-model="shape" val="1" label="退费" />
        </div>

        <q-btn
          class="dialog-main-btn"
          type="primary"
          :loading="mutating > 0"
          :disabled="mutating > 0"
          label="确定"
          color="secondary"
        />
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import { MixinForm } from '../mixins/MixinForm';

export default {
  name: 'FormPay',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      shape: '0',
      mutating: 0,

      gql: {
        create: 'eventType.create',
        update: 'eventType.update',
        query: 'eventType',
      },

      edata: {},
    };
  },

  async mounted() {
    /*
    if (this.primaryId) {
      const { eventTypes } = await this.grequest('eventTypes', { condition: { id: this.primaryId } });
      this.edata = eventTypes.nodes[0];
      delete this.edata.eventCategory;
    }*/
  },
  methods: {
    preSave() {},
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
