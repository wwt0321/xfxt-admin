<template>
  <q-card>
    <q-form @submit="submit">
      <div class="row top">
        <div class="dialog-title">{{ edata.id ? '编辑' : '新增' }}用户</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <div class="dialog-main-title">工号：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入工号"
            v-model="edata.workNo"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">姓名：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入姓名"
            v-model="edata.name"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">手机号：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入手机号"
            v-model="edata.phoneNum"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">角色：</div>
          <q-select
            class="dialog-main-input"
            outlined
            dense
            emit-value
            map-options
            v-model="edata.roleId"
            :options="roles"
            :rules="[(v) => !!v]"
          />
        </div>

        <q-btn
          class="dialog-main-btn"
          type="submit"
          :loading="mutating > 0"
          :disabled="mutating > 0"
          label="保存"
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
        create: '/user/add',
        update: '/user/update',
      },

      roles: [],

      edata: {},
    };
  },

  async mounted() {
    this.edata = this.selected[0] ? { ...this.selected[0] } : {};
    if (!this.selected[0]) {
      this.edata.balance = 0;
      this.edata.allowance = 0;
    }
    const roles = await http.get(`/role/get?limit=${999}&page=${1}`);
    roles.data.list.forEach((v) => {
      v.value = v.id;
      v.label = v.name;
    });
    this.roles = roles.data.list;
  },
  methods: {
    async preSave() {},
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
