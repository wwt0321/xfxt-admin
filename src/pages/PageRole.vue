<template>
  <div class="q-pa-lg app" :style="conheight">
    <div class="top row">
      <div class="top-title">角色管理</div>
      <div class="top-filter">
        <q-input
          v-model="searches.name"
          outlined
          dense
          class="top-filter-input"
          style="width:250px"
          placeholder="请输入角色名称"
        ></q-input>
        <q-btn class="top-filter-btn" color="secondary" label="查询" @click="search"></q-btn>
      </div>
    </div>
    <div class="body" :style="bodyheight">
      <q-btn class="body-btn" color="secondary" label="新增角色" v-if="isbase" @click="addRole"></q-btn>
      <table-role ref="table" />
    </div>
  </div>
</template>
<script>
import TableRole from 'src/tables/TableRole.vue';
export default {
  components: { TableRole },
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
      searches: {
        name: '',
      },
      isbase: false,
    };
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  async mounted() {
    let sroles = JSON.parse(localStorage.user).roleList;
    let index2 = sroles.findIndex((v) => v.id == 2);
    if (index2 > -1) {
      this.isbase = true;
    }
  },
  methods: {
    getHeight() {
      this.conheight.height = window.innerHeight - 66 + 'px';
      this.bodyheight.height = window.innerHeight - 208 + 'px';
    },
    addRole() {
      this.$refs.table.showCreate();
    },
    search() {
      this.$refs.table.goSearch(this.searches);
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
