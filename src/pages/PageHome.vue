<template>
  <div class="app q-pa-lg" :style="conheight">
    <div class="top" v-if="isstatistics">
      <div class="card-top row">
        <div class="card-top-title">
          信息总览
        </div>
        <q-space></q-space>
        <q-tabs dense style="margin-right:22px" v-model="tab" align="left" active-color="secondary">
          <q-tab name="tab1" label="今天" @click="timeChange(1)" />
          <q-tab name="tab3" label="昨天" @click="timeChange(2)" />
          <q-tab name="tab4" label="近7日" @click="timeChange(3)" />
          <q-tab name="tab5" label="近30日" @click="timeChange(4)" />
        </q-tabs>
      </div>
      <div class="top-body row">
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">现金充值</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ total.rechargeSum || 0 }}</div>
        </div>
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">补贴</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ total.allowanceSum || 0 }}</div>
        </div>
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">消费</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ total.consumeSum || 0 }}</div>
        </div>
      </div>
    </div>
    <div class="body" v-if="isrecharge">
      <div class="card">
        <div class="card-top row">
          <div class="card-top-title">
            账户充值
          </div>
        </div>
        <div class="card-body" style="padding:24px 30px;">
          <q-form class="card-body" @submit="goRecharge">
            <div class="card-body-box-cz row">
              <div class="card-body-box-cz-title">金额：</div>
              <q-space></q-space>
              <q-input
                v-model="amount1"
                type="number"
                outlined
                dense
                class="card-body-box-cz-input"
                color="blue"
                placeholder="请输入金额"
                :rules="[(v) => v > 0]"
              ></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">用户：</div>
              <q-space></q-space>
              <ComponentCombobox
                class="card-body-box-cz-input"
                v-model="user"
                :options="users"
                v-bind="filterAttrs"
                :placeholder="!user || !user.value ? '请选择用户' : ''"
                :rules="[(v) => !!v]"
                @input="changeUser1"
              />
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">工号：</div>
              <q-space></q-space>
              <q-input
                v-model="jobnum"
                outlined
                dense
                class="card-body-box-cz-input"
                color="blue"
                placeholder="请选择用户"
                readonly
              ></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">类型：</div>
              <q-space></q-space>
              <div class="card-body-box-cz-input">
                <q-radio style="font-size:14px" v-model="shape" :val="1" label="充值" />
                <q-radio style="margin-left:20px;font-size:14px" v-model="shape" :val="2" label="提现" />
              </div>
            </div>
            <div class="card-body-box-cz row" style="margin-top:20px">
              <q-btn color="secondary" type="submit" style="width:100%;" :loading="loading > 0" label="确定"></q-btn>
            </div>
          </q-form>
        </div>
      </div>
      <div class="card">
        <div class="card-top row">
          <div class="card-top-title">
            个人补贴
          </div>
        </div>
        <div class="card-body" style="padding:24px 30px;">
          <q-form class="card-body" @submit="goSubsidy">
            <div class="card-body-box-cz row">
              <div class="card-body-box-cz-title">金额：</div>
              <q-space></q-space>
              <q-input
                v-model="amount2"
                type="number"
                outlined
                dense
                class="card-body-box-cz-input"
                color="blue"
                placeholder="请输入补贴金额"
                :rules="[(v) => v > 0]"
              ></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">用户：</div>
              <q-space></q-space>
              <ComponentCombobox
                class="card-body-box-cz-input"
                v-model="user2"
                :options="users"
                v-bind="filterAttrs"
                :placeholder="!user2 || !user2.value ? '请选择用户' : ''"
                :rules="[(v) => !!v]"
                @input="changeUser2"
              />
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">工号：</div>
              <q-space></q-space>
              <q-input
                v-model="jobnum2"
                outlined
                dense
                class="card-body-box-cz-input"
                color="blue"
                placeholder="请选择用户"
                readonly
              ></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:70px">
              <q-btn color="secondary" style="width:100%;" type="submit" :loading="loading > 0" label="确定"></q-btn>
            </div>
          </q-form>
        </div>
      </div>
      <div class="card">
        <div class="card-top row">
          <div class="card-top-title">
            按角色补贴
          </div>
        </div>
        <div class="card-body" style="padding:24px 30px;">
          <q-form class="card-body" @submit="goRole">
            <div class="card-body-box-cz row">
              <div class="card-body-box-cz-title">金额：</div>
              <q-space></q-space>
              <q-input
                v-model="amount3"
                type="number"
                outlined
                dense
                class="card-body-box-cz-input"
                color="blue"
                placeholder="请输入补贴金额"
                :rules="[(v) => v > 0]"
              ></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">角色：</div>
              <q-space></q-space>
              <ComponentCombobox
                class="card-body-box-cz-input"
                v-model="role"
                :options="roles"
                v-bind="filterAttrs"
                :placeholder="!role || !role.value ? '请选择角色' : ''"
                :rules="[(v) => !!v]"
              />
            </div>
            <div class="card-body-box-cz row" style="margin-top:120px">
              <q-btn color="secondary" style="width:100%;" type="submit" :loading="loading > 0" label="确定"></q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { http } from '../utils/luch-request/index.js';
import { date } from 'quasar';
export default {
  name: 'PageHome',
  data() {
    return {
      //屏幕高度
      conheight: {
        height: '',
      },
      filterAttrs: {
        dense: true,
        clearable: true,
        mapOptions: true,
        outlined: true,
        color: 'blue',
      },
      amount1: '',
      amount2: '',
      amount3: '',
      user: '',
      user2: '',
      users: [],
      jobnum: '',
      jobnum2: '',
      role: '',
      roles: [],
      tab: 'tab1',
      shape: 1,
      filters: {},
      total: {
        allowanceSum: 0,
        rechargeSum: 0,
        consumeSum: 0,
      },
      loading: 0,
      isrecharge: false,
      isstatistics: false,
    };
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  async mounted() {
    let index = JSON.parse(localStorage.user).roleList.findIndex((v) => v.id == 3);
    if (index > -1) {
      this.isrecharge = true;
      const users = await http.get('/user/get?limit=9999&page=1&state=1');
      users.data.list.forEach((v) => {
        v.value = v.id;
        v.label = v.name;
      });
      this.users = users.data.list;
      const roles = await http.get(`/role/get?limit=${999}&page=${1}&state=${1}`);
      roles.data.list.forEach((v) => {
        v.value = v.id;
        v.label = v.name;
      });
      this.roles = roles.data.list;
    }
    let index2 = JSON.parse(localStorage.user).roleList.findIndex((v) => v.id == 4);
    if (index2 > -1) {
      this.isstatistics = true;
      this.timeChange(1);
    }
  },
  methods: {
    getHeight() {
      this.conheight.height = window.innerHeight - 66 + 'px';
    },
    async timeChange(type) {
      let today = date.formatDate(new Date(), 'YYYY-MM-DD'),
        oneday = 1000 * 60 * 60 * 24;
      today = Date.parse(today);
      if (type == 1) {
        this.filters.startTime = today;
        this.filters.endTime = today + oneday;
      } else if (type == 2) {
        this.filters.startTime = today - oneday;
        this.filters.endTime = today;
      } else if (type == 3) {
        this.filters.startTime = today - 6 * oneday;
        this.filters.endTime = today + oneday;
      } else if (type == 4) {
        this.filters.startTime = today - 29 * oneday;
        this.filters.endTime = today + oneday;
      }
      let url = `/statistics/overview?startTime=${this.filters.startTime}&endTime=${this.filters.endTime}`;
      const data = await http.get(url);
      this.total = data.data;
    },
    changeUser1(e) {
      this.jobnum = e ? e.workNo : '';
    },
    changeUser2(e) {
      this.jobnum2 = e ? e.workNo : '';
    },
    async goRecharge() {
      this.loading++;
      let params = new FormData();
      params.append('amount', this.amount1);
      params.append('workNo', this.user.workNo);
      params.append('name', this.user.name);
      params.append('type', parseInt(this.shape));
      const res = await http.post('/account/recharge', params);
      if (res.res) {
        this.timeChange(1);
        alert(this.shape == 1 ? '充值成功' : '提现成功');
      } else {
        alert(this.shape == 1 ? '充值失败' : '提现失败');
      }
      this.loading--;
    },
    async goSubsidy() {
      this.loading++;
      let params = new FormData();
      params.append('amount', this.amount2);
      params.append('workNo', this.user2.workNo);
      params.append('username', this.user2.name);
      const res = await http.post('/distribute/user', params);
      if (res.res) {
        this.timeChange(1);
        alert('发放补贴成功');
      } else {
        alert('发放补贴失败');
      }
      this.loading--;
    },
    async goRole() {
      this.loading++;
      let params = new FormData();
      params.append('amount', this.amount3);
      params.append('roleId', this.role.id);
      params.append('roleName', this.role.name);
      const res = await http.post('/distribute/role', params);
      if (res.res) {
        this.timeChange(1);
        alert('发放补贴成功');
      } else {
        alert('发放补贴失败');
      }
      this.loading--;
    },
  },
};
</script>
<style scoped>
.app {
  width: 100%;
  min-width: 1440px;
  background: rgb(242, 243, 245);
  height: 160px;
}
.top {
  width: 100%;
  background: rgb(255, 255, 255);
}
.top-body {
  display: flex;
  justify-content: space-between;
  height: 110px;
  padding: 20px;
}
.top-body-box {
  height: 70px;
  width: 32%;
  border: 1.1px solid #e8e8e8;
  border-radius: 6.5px;
  padding: 0px 36px 0px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.body {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.card {
  width: 32.5%;
  height: 360px;
  background: rgb(255, 255, 255);
  border-radius: 4.5px;
  transition: unset;
}
.card-top {
  height: 52px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
}
.card-top-title {
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-left: 22px;
}
.card-body {
  height: 110px;
}
.card-body-box {
  height: 70px;
  width: 100%;
  border: 1.1px solid #e8e8e8;
  border-radius: 6.5px;
  padding: 0px 36px 0px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body-box-xx-title {
  width: 60px;
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: Normal;
  text-align: left;
  color: #333333;
  line-height: 20px;
  text-align: left;
}
.card-body-box-xx-money {
  width: 280px;
  height: 28px;
  opacity: 1;
  font-size: 20px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: Bold;
  text-align: right;
  color: #01979d;
  line-height: 28px;
}
.card-body-box-cz {
  height: 40px;
  width: 100%;
}
.card-body-box-cz-title {
  width: 42px;
  height: 40px;
  opacity: 1;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: Normal;
  text-align: left;
  color: #333333;
  line-height: 40px;
}
.card-body-box-cz-input {
  width: 88%;
}
</style>
