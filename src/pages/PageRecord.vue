<template>
  <div class="q-pa-lg app" :style="conheight">
    <div class="top row">
      <div class="top-title">补贴记录</div>
      <div outline class="top-filter">
        <q-btn-group outline class="top-filter-btn" rounded unelevated>
          <q-btn v-if="!person" outline color="secondary" label="个人补贴" @click="select(1)" />
          <q-btn v-if="person" color="secondary" label="个人补贴" @click="select(1)" />
          <q-btn
            v-if="!role"
            class="top-filter-btn-border"
            outline
            color="secondary"
            label="角色补贴"
            @click="select(2)"
          />
          <q-btn v-if="role" class="top-filter-btn-border" color="secondary" label="角色补贴" @click="select(2)" />
          <q-btn v-if="!scheme" outline color="secondary" label="方案补贴" @click="select(3)" />
          <q-btn v-if="scheme" color="secondary" label="方案补贴" @click="select(3)" />
        </q-btn-group>
      </div>
    </div>
    <div class="body" :style="bodyheight">
      <table-record-person v-show="person" />
      <table-record-role v-show="role" />
      <table-record-subsidy v-show="scheme" />
    </div>
  </div>
</template>
<script>
import TableRecordPerson from 'src/tables/TableRecordPerson.vue';
import TableRecordRole from 'src/tables/TableRecordRole.vue';
import TableRecordSubsidy from 'src/tables/TableRecordSubsidy.vue';
export default {
  components: { TableRecordPerson, TableRecordRole, TableRecordSubsidy },
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
      person: true,
      role: false,
      scheme: false,
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
    select(number) {
      if (number == 1) {
        this.person = true;
        this.role = false;
        this.scheme = false;
      } else if (number == 2) {
        this.person = false;
        this.role = true;
        this.scheme = false;
      } else {
        this.person = false;
        this.role = false;
        this.scheme = true;
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
  height: 40px;
}
.top-filter-btn-border {
  border-left: 1px solid #26a69a;
  border-right: 1px solid #26a69a;
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
