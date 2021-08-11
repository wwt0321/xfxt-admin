<template>
  <div class="q-pa-lg app" :style="conheight">
    <div class="top row">
      <div class="top-title">菜单管理</div>
    </div>
    <div class="body" :style="bodyheight">
      <q-btn class="body-btn" color="secondary" label="新增菜单" @click="goAdd"></q-btn>
      <table-function ref="table" />
    </div>
  </div>
</template>

<script>
import TableFunction from 'src/tables/TableFunction.vue';

export default {
  name: 'PageFunction',
  components: { TableFunction },
  data() {
    return {
      conheight: {
        height: '',
      },
      bodyheight: {
        height: '',
      },
      filters: {},
    };
  },

  mounted() {
    this.conheight.height = window.innerHeight - 66 + 'px';
    this.bodyheight.height = window.innerHeight - 208 + 'px';
  },

  methods: {
    goAdd() {
      this.$refs.table.showCreate();
    },
  },
};
</script>

<style scoped>
.app {
  width: 100%;
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
