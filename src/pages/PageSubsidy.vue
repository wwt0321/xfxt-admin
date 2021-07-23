<template>
  <div class="q-pa-lg row app " :style="conheight">
    <div class="body-left" :style="bodyheight1">
      <div class="top-title">补贴方案设置</div>
      <div class="top-filter">
        <div class="top-filter-title">医生：</div>
        <q-input outlined dense class="top-filter-input" placeholder="请输入金额"></q-input>
      </div>
      <div class="top-filter">
        <div class="top-filter-title">护士：</div>
        <q-input outlined dense class="top-filter-input" placeholder="请输入金额"></q-input>
      </div>
      <div class="top-filter">
        <div class="top-filter-title">主任：</div>
        <q-input outlined dense class="top-filter-input" placeholder="请输入金额"></q-input>
      </div>
      <div class="top-filter">
        <div class="top-filter-title">其他：</div>
        <q-input outlined dense class="top-filter-input" placeholder="请输入金额"></q-input>
      </div>
      <q-btn class="top-filter-btn " color="secondary" label="补贴发放"></q-btn>
      <q-btn class="top-filter-btn " color="secondary" label="保存方案" @click="showScheme"></q-btn>
    </div>
    <q-space></q-space>
    <div class="body-right" :style="bodyheight2">
      <table-subsidy />
    </div>
    <!-- 补贴发放 -->
    <q-dialog v-model="isShow.scheme" no-backdrop-dismiss>
      <form-scheme v-if="isShow.scheme" @hide="hideScheme" @submit="refresh" style="width: 430px;"></form-scheme>
    </q-dialog>
  </div>
</template>
<script>
import TableSubsidy from 'src/tables/TableSubsidy.vue';
import FormScheme from 'src/forms/FormScheme.vue';
export default {
  components: { TableSubsidy, FormScheme },
  name: 'PageHome',
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
    };
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  methods: {
    getHeight() {
      this.conheight.height = window.innerHeight - 66 + 'px';
      this.bodyheight1.height = window.innerHeight - 144 + 'px';
      this.bodyheight2.height = window.innerHeight - 144 + 'px';
    },
    showScheme() {
      this.isShow.scheme = true;
    },
    hideScheme() {
      this.isShow.scheme = false;
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
  height: 40px;
  display: flex;
  align-items: center;
}
.top-filter-title {
  min-width: 42px;
  line-height: 20px;
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
