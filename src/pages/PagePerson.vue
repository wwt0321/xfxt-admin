<template>
  <div class="q-pa-lg app" :style="conheight">
    <div class="top row">
      <div class="top-title">用户管理</div>
      <div class="top-filter">
        <div class="top-filter-title">工号：</div>
        <q-input outlined dense class="top-filter-input" placeholder="请输入工号"></q-input>
        <div class="top-filter-title">姓名：</div>
        <q-input outlined dense class="top-filter-input" placeholder="请输入姓名"></q-input>
        <div class="top-filter-title" style="width:56px">手机号：</div>
        <q-input outlined dense class="top-filter-input" placeholder="请输入手机号"></q-input>
        <div class="top-filter-title" style="width:56px">角色：</div>
        <q-select class="top-filter-input" outlined dense emit-value map-options v-model="model" :options="options" />
        <q-btn class="top-filter-btn" color="secondary" label="查询"></q-btn>
      </div>
    </div>
    <div class="body" :style="bodyheight">
      <q-btn class="body-btn" color="secondary" label="新增用户" @click="addPerson"></q-btn>
      <table-person ref="table" />
    </div>
  </div>
</template>
<script>
import TablePerson from 'src/tables/TablePerson.vue';
export default {
  components: { TablePerson },
  name: 'PageHome',
  data() {
    return {
      //屏幕高度
      conheight: {
        height: '',
      },
      bodyheight: {
        height: '',
      },
      model: 0,
      options: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '医生',
          value: 1,
        },
        {
          label: '护士',
          value: 2,
        },
        {
          label: '主任',
          value: 3,
        },
      ],
    };
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  methods: {
    getHeight() {
      this.conheight.height = window.innerHeight - 66 + 'px';
      this.bodyheight.height = window.innerHeight - 208 + 'px';
    },
    addPerson() {
      this.$refs.table.showCreate();
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
  margin-left: 40px;
  height: 40px;
  display: flex;
  align-items: center;
}
.top-filter-title {
  width: 42px;
  line-height: 20px;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  margin-right: 8px;
}
.top-filter-input {
  width: 150px;
  margin-right: 20px;
}
.top-filter-btn {
  width: 80px;
  margin-right: 80px;
  height: 40px;
}
.body {
  width: 100%;
  background: #ffffff;
  padding: 20px;
  margin-top: 14px;
}
.body-btn {
  height: 40px;
  margin-bottom: 13px;
}
</style>
