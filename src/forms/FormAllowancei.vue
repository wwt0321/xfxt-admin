<template>
  <q-card>
    <q-form @submit="goSubmit">
      <div class="row top">
        <div class="dialog-title">编辑方案</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px 25px 30px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <div class="dialog-main-title">方案名称：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入方案名称"
            v-model="edata.name"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row" v-for="(v, n) in roles" :key="n">
          <div class="dialog-main-title">{{ v.label }}：</div>
          <q-input
            class="dialog-main-input"
            type="number"
            outlined
            stack-label
            dense
            placeholder="请输入金额"
            v-model="v.allowance"
            :rules="[(v) => v >= 0]"
          />
        </div>
        <q-btn
          class="dialog-main-btn"
          type="primary"
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
  name: 'FormPay',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      shape: '0',
      model: 0,
      gql: {
        create: '',
        update: '/plan/update',
      },

      edata: {},
      roles: [],
    };
  },

  async mounted() {
    this.edata = this.selected[0] ? { ...this.selected[0] } : {};
    const roles = await http.get(`/role/get?limit=${999}&page=${1}&state=${1}`);
    roles.data.list.forEach((v) => {
      v.value = v.id;
      v.label = v.name;
    });
    let roleids = this.edata.roleIds ? this.edata.roleIds.split(',') : [];
    let allowances = this.edata.allowances ? this.edata.allowances.split(',') : [];
    roles.data.list.forEach((v, n) => {
      let index = roleids.findIndex((r) => r == v.id);
      if (index > -1) {
        v.allowance = parseFloat(allowances[index]);
      } else {
        v.allowance = 0;
      }
    });
    this.roles = roles.data.list;
    console.log(this.roles);
  },
  methods: {
    preSave() {},
    async goSubmit() {
      let sum = 0,
        roles = [];
      this.roles.forEach((v) => {
        sum += parseFloat(v.allowance);
        if (v.allowance) {
          roles.push(v);
        }
      });
      if (sum === 0) {
        return alert('至少得有一个角色补贴金额大于0');
      }
      this.edata.ids = roles.map((v) => v.value).join(',');
      this.edata.roleNames = roles.map((v) => v.label).join(',');
      this.edata.allowances = roles.map((v) => parseFloat(v.allowance).toFixed(2) || 0).join(',');
      this.gql.update += `/${this.edata.id}`;
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

.dialog-main-btn {
  margin-top: 29px;
  width: 100%;
  height: 40px;
}
.dialog-main {
  height: 40px;
  width: 100%;
  margin-bottom: 17px;
}
.dialog-main-title {
  width: 75px;
  line-height: 40px;
  font-size: 15px;
  color: #333333;
}
.dialog-main-input {
  width: 257px;
  height: 30px;
  margin-left: 8px;
}
</style>
