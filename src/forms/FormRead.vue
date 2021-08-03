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
        <div class="dialog-main-title">
          正在读卡中……
        </div>
        <div class="dialog-main-card">
          卡号：29101010101010100
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
.dialog-main-title {
  line-height: 25px;
  font-size: 18px;
  text-align: center;
  margin: 16px 0px 25px;
}
.dialog-main-card {
  line-height: 20px;
  font-size: 14px;
  text-align: center;
}
.dialog-main-btn {
  margin-top: 29px;
  width: 100%;
  height: 40px;
}
</style>
