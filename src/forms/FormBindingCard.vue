<template>
  <q-card>
    <q-form @submit="submit('')">
      <div class="row top">
        <div class="dialog-title">绑定卡号</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="row">
          <div class="dialog-main-left">
            <div class="dialog-main row">
              <span class="dialog-main-title">姓名：</span>
              <div class="dialog-main-title-main">张三</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">工号：</span>
              <div class="dialog-main-title-main">00001</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">手机号：</span>
              <div class="dialog-main-title-main">13528282920</div>
            </div>
          </div>
          <div class="dialog-main-right">
            <div class="dialog-main row">
              <span class="dialog-main-title">卡号：</span>
              <div class="dialog-main-title-main">1919191919191</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">现金账户：</span>
              <div class="dialog-main-title-main">100.00</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">补贴账户：</span>
              <div class="dialog-main-title-main">60.00</div>
            </div>
          </div>
        </div>
        <q-btn
          class="dialog-main-btn"
          :loading="mutating > 0"
          :disabled="mutating > 0"
          label="读卡"
          color="secondary"
          @click="isShow.edit = true"
        />
      </q-card-section>
    </q-form>
    <!-- 添加/编辑用户 -->
    <q-dialog v-model="isShow.edit" no-backdrop-dismiss>
      <form-read
        v-if="isShow.edit"
        :primary-id="primaryId"
        @hide="hideEdit"
        @submit="refresh"
        style="width: 380px;"
        :locked="locked"
      ></form-read>
    </q-dialog>
  </q-card>
</template>

<script>
import { MixinForm } from '../mixins/MixinForm';
import FormRead from 'src/forms/FormRead.vue';
export default {
  components: { FormRead },
  name: 'FormPay',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      mutating: 0,

      gql: {
        create: 'eventType.create',
        update: 'eventType.update',
        query: 'eventType',
      },

      edata: {},

      //编辑弹出框
      isShow: {
        edit: false,
      },
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
  margin-right: 10px;
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  text-align: left;
  line-height: 40px;
}
.dialog-main-title-main {
  font-size: 15px;
  font-weight: 600;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  text-align: left;
  line-height: 40px;
}
.dialog-main-btn {
  margin-top: 12px;
  width: 100%;
  height: 40px;
}
.dialog-main-left {
  width: 190px;
  border-right: 1px dashed #e8e8e8;
}
.dialog-main-right {
  width: 230px;
  padding-left: 40px;
}
</style>
