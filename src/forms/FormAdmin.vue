<template>
  <q-card>
    <q-form @submit="goSubmit">
      <div class="row top">
        <div class="dialog-title">{{ edata.id ? '编辑' : '新增' }}账号</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <div class="dialog-main-title">用户名：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入用户名"
            v-model="edata.name"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">系统角色：</div>
          <q-select
            class="dialog-main-input"
            outlined
            stack-label
            dense
            map-options
            emit-value
            multiple
            v-model="edata.roles"
            :options="roles"
            :rules="[(v) => !!v && v.length > 0]"
          />
        </div>
        <q-btn
          class="dialog-main-btn"
          type="submit"
          :loading="loading > 0"
          :disabled="loading > 0"
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
  name: 'FormAdmin',
  mixins: [MixinForm],
  props: ['selected'],
  data() {
    return {
      gql: {
        create: '/system/addUser',
        update: '/system/updateUser',
      },

      edata: {},
      roles: [],
    };
  },

  async mounted() {
    let edata = this.selected[0] ? { ...this.selected[0] } : {};
    edata.roles = edata.roleIds ? edata.roleIds.split(',') : [];
    edata.roles.forEach((v, n) => {
      edata.roles[n] = parseInt(v);
    });
    edata.password = '123456';
    if (edata.id) {
      delete edata.password;
    }
    console.log(edata);
    this.edata = edata;
    this.$forceUpdate();
    const roles = await http.get(`/system/getRoles`);
    roles.data.forEach((v) => {
      v.value = v.id;
      v.label = v.name;
    });
    this.roles = roles.data;
  },
  methods: {
    async preSave() {},
    goSubmit() {
      this.edata.roleIds = this.edata.roles.join(',');
      this.submit('');
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
  width: 100%;
  margin-bottom: 17px;
}
.dialog-main-title {
  width: 100px;
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  text-align: left;
  line-height: 40px;
}
.dialog-main-input {
  width: 180px;
}
.dialog-main-btn {
  margin-top: 12px;
  width: 100%;
  height: 40px;
}
</style>
