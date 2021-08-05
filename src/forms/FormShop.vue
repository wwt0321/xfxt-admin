<template>
  <q-card>
    <q-form @submit="goSubmit">
      <div class="row top">
        <div class="dialog-title">{{ edata.id ? '编辑' : '新增' }}商户</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <span class="dialog-main-title">商户名称：</span>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输商户名称"
            v-model="edata.name"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row" v-for="(v, index) in edata.nums" :key="index">
          <span class="dialog-main-title">刷卡机编号：</span>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输刷卡机编号"
            v-model="edata.nums[index]"
            @input="$forceUpdate()"
            :rules="[(v) => !!v]"
          />
          <q-space></q-space>
          <q-icon
            class="dialog-main-icon"
            v-if="index == edata.nums.length - 1"
            color="secondary"
            size="30px"
            name="add_circle_outline"
            @click="addNums()"
          ></q-icon>
          <q-icon
            class="dialog-main-icon"
            v-if="edata.nums.length > 1"
            color="secondary"
            size="30px"
            name="remove_circle_outline"
            @click="delNums(index)"
          ></q-icon>
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
import { http } from '../utils/luch-request/index.js';

export default {
  name: 'FormEventType',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      mutating: 0,
      eventCategories: [],

      gql: {
        create: '/merchants/add',
        update: '/merchants/update',
      },

      edata: {
        nums: [],
      },
    };
  },

  async mounted() {
    console.log(this.selected);
    this.edata = this.selected[0] ? { ...this.selected[0] } : {};
    this.edata.nums = this.edata.nums && this.edata.nums.length ? this.edata.nums : [''];
  },
  methods: {
    preSave() {},
    addNums() {
      this.edata.nums.push('');
      console.log(this.edata);
      this.$forceUpdate();
    },
    delNums(index) {
      this.edata.nums.splice(index, 1);
      this.$forceUpdate();
    },
    async goSubmit() {
      this.edata.posIds = this.edata.nums.join(';');
      this.gql.update += `/${this.edata.id}`;
      this.submit();
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
  width: 90px;
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  margin-right: 8px;
  line-height: 40px;
}
.dialog-main-input {
  height: 40px;
  width: 180px;
}
.dialog-main-btn {
  margin-top: 12px;
  width: 100%;
  height: 40px;
}
.dialog-main-icon {
  margin: 5px 0px;
  cursor: pointer;
}
</style>
