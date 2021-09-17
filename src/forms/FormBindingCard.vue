<template>
  <q-card>
    <q-form>
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
              <div class="dialog-main-title-main">{{ edata.name }}</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">工号：</span>
              <div class="dialog-main-title-main">{{ edata.workNo }}</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">手机号：</span>
              <div class="dialog-main-title-main">{{ edata.phoneNum }}</div>
            </div>
          </div>
          <div class="dialog-main-right">
            <div class="dialog-main row">
              <span class="dialog-main-title">卡号：</span>
              <div class="dialog-main-title-main">{{ edata.cardNo }}</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">现金账户：</span>
              <div class="dialog-main-title-main">{{ edata.balance }}</div>
            </div>
            <div class="dialog-main row">
              <span class="dialog-main-title">补贴账户：</span>
              <div class="dialog-main-title-main">{{ edata.allowance }}</div>
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
      <q-card style="width:400px;">
        <q-form @submit="preSave">
          <div class="row top">
            <div class="dialog-title">读卡绑定</div>
            <q-space />
            <q-img class="dialog-close" src="../assets/close.svg" @click="isShow.edit = false"></q-img>
          </div>
          <q-card-section style="padding:25px 40px">
            <!-- 表单内容 -->
            <div class="dialog-main-title" style="text-align:center;">
              等待读卡中……
            </div>
            <div class="dialog-main-card">卡号：{{ cardNo }}</div>
            <q-btn
              class="dialog-main-btn"
              type="primary"
              :loading="mutating > 0"
              :disabled="mutating > 0 || !cardNo"
              label="确定"
              color="secondary"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { MixinForm } from '../mixins/MixinForm';
export default {
  name: 'FormBindingCard',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      mutating: 0,

      gql: {
        create: '',
        update: '',
        query: '',
      },

      edata: {},

      //编辑弹出框
      isShow: {
        edit: false,
      },
    };
  },

  async mounted() {
    this.cardNo = '';
    this.edata = this.selected[0] ? { ...this.selected[0] } : {};
  },
  methods: {
    async preSave() {
      this.mutating++;
      let params = new FormData();
      params.append('id', this.edata.id);
      params.append('cardNo', this.cardNo);
      let res = await http.put(`/user/update`, params);
      if (res.res) {
        this.cardNo = '';
        this.isShow.edit = false;
        this.$emit('submit', this.edata);
        this.hide();
        this.alert(`${this.edata.cardNo ? '换绑' : '绑定'}成功`);
      } else {
        this.alert(`${this.edata.cardNo ? '换绑' : '绑定'}失败`);
      }
      this.mutating--;
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
