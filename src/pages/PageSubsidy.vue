<template>
  <div class="q-pa-lg row app " :style="conheight">
    <div class="body-left" :style="bodyheight1">
      <div class="top-title">补贴方案设置</div>
      <div class="top-filter" v-for="(v, n) in roles" :key="n">
        <div class="top-filter-title">{{ v.name }}：</div>
        <q-input
          v-model="allowances[n].allowance"
          type="number"
          outlined
          dense
          class="top-filter-input"
          placeholder="请输入金额"
          :rules="[(v) => v >= 0]"
        ></q-input>
      </div>
      <q-btn class="top-filter-btn " color="secondary" label="补贴发放" @click="grant"></q-btn>
      <q-btn class="top-filter-btn " color="secondary" label="保存方案" @click="showScheme"></q-btn>
    </div>
    <q-space></q-space>
    <div class="body-right" :style="bodyheight2">
      <table-subsidy ref="mychild" />
    </div>
    <!-- 保存方案 -->
    <q-dialog v-model="isShow.scheme" no-backdrop-dismiss>
      <form-scheme
        v-if="isShow.scheme"
        @hide="hideScheme"
        @submit="$refs.mychild.refresh"
        :selected="allowances"
        style="width: 430px;"
      ></form-scheme>
    </q-dialog>
  </div>
</template>
<script>
import TableSubsidy from 'src/tables/TableSubsidy.vue';
import FormScheme from 'src/forms/FormScheme.vue';
import { http } from '../utils/luch-request/index.js';
export default {
  components: { TableSubsidy, FormScheme },
  name: 'PageSubsidy',
  data() {
    return {
      //屏幕高度
      conheight: {
        height: '',
      },
      bodyheight1: {
        height: '',
        width: '22%',
      },
      bodyheight2: {
        height: '',
        width: '77%',
      },
      //编辑弹出框
      isShow: {
        scheme: false,
      },
      roles: [],
      allowances: [],
    };
  },
  async mounted() {
    const roles = await http.get(`/role/get?limit=${999}&page=${1}&state=${1}`);
    this.roles = roles.data.list;
    roles.data.list.forEach((v) => {
      this.allowances.push({
        id: v.id,
        name: v.name,
        allowance: 0,
      });
    });
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  methods: {
    refresh() {},
    getHeight() {
      this.conheight.height = window.innerHeight - 66 + 'px';
      this.bodyheight1.height = window.innerHeight - 144 + 'px';
      this.bodyheight2.height = window.innerHeight - 144 + 'px';
    },
    showScheme() {
      let sum = 0;
      for (let i = 0; i < this.allowances.length; i++) {
        if (this.allowances[i].allowance < 0) {
          return alert('补贴金额不能小于0');
        }
        sum += parseFloat(this.allowances[i].allowance);
      }
      if (sum == 0) {
        return alert('至少得有一个角色补贴金额大于0');
      }
      this.isShow.scheme = true;
    },
    hideScheme() {
      this.isShow.scheme = false;
    },
    async grant() {
      let sum = 0;
      for (let i = 0; i < this.allowances.length; i++) {
        if (this.allowances[i].allowance < 0) {
          return alert('补贴金额不能小于0');
        }
        sum += parseFloat(this.allowances[i].allowance);
      }
      if (sum == 0) {
        return alert('至少得有一个角色补贴金额大于0');
      }
      let ids = this.allowances.map((v) => v.id);
      let roleNames = this.allowances.map((v) => v.name);
      let allowances = this.allowances.map((v) => v.allowance || 0);
      let edata = {};
      edata.ids = ids.join(',');
      edata.roleNames = roleNames.join(',');
      edata.allowances = allowances.join(',');
      console.log(edata);
      let params = new FormData();
      Object.keys(edata).forEach((v) => {
        params.append(v, edata[v] == 0 ? 0 : edata[v] || '');
      });
      let res = await http.post('/distribute/plan', params);
      if (res.res) {
        alert('发放补贴成功');
      } else {
        alert('发放补贴失败');
      }
    },
  },
};
</script>
<style scoped>
.app {
  width: 100%;
  min-width: 1440px;
  background: rgb(242, 243, 245);
}
.top {
  width: 100%;
  height: 80px;
  background: #ffffff;
  color: #333333;
  display: flex;
  align-items: center;
}
.top-title {
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-left: 20px;
}
.top-filter {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.top-filter-title {
  width: 40%;
  min-width: 42px;
  line-height: 40px;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  margin-right: 8px;
}
.top-filter-input {
  width: 273px;
}
.top-filter-btn {
  margin-top: 30px;
  width: 100%;
  height: 40px;
}
.body-left {
  background: #ffffff;
  padding: 29px 20px;
  margin-top: 14px;
}
.body-right {
  background: #ffffff;
  padding: 20px;
  margin-top: 14px;
}
.body-btn {
  height: 40px;
  margin-bottom: 13px;
}
</style>
