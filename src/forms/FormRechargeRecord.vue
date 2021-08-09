<template>
  <q-card>
    <q-form @submit="submit('')">
      <div class="row top">
        <div class="dialog-title">充值记录</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:20px 15px 25px 15px">
        <!-- 表单内容 -->
        <div class="dialog-main-title row">
          <span style="margin-left:10px">姓名：</span>
          <span style="margin-left:8px;font-size:600">{{ edata.name }}</span>
          <span style="margin-left:50px">工号：</span>
          <span style="margin-left:8px;font-size:600">{{ edata.workNo }}</span>
          <span style="margin-left:50px">手机号：</span>
          <span style="margin-left:8px;font-size:600">{{ edata.phoneNum }}</span>
          <q-space></q-space>
          <span>类型：</span>
          <q-select
            class="dialog-main-input"
            outlined
            dense
            emit-value
            map-options
            v-model="model"
            :options="options"
            @input="$refs.table.refresh(model)"
          />
        </div>
        <table-top-up ref="table" :work="edata.workNo" />
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import TableTopUp from 'src/tables/TableTopUp.vue';
import { MixinForm } from '../mixins/MixinForm';

export default {
  components: { TableTopUp },
  name: 'FormPay',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      mutating: 0,
      model: '',
      options: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '充值',
          value: 1,
        },
        {
          label: '提现',
          value: 2,
        },
      ],

      gql: {
        create: 'eventType.create',
        update: 'eventType.update',
        query: 'eventType',
      },

      edata: {},
    };
  },

  async mounted() {
    this.edata = this.selected[0] ? { ...this.selected[0] } : {};
    setTimeout(() => {
      this.$refs.table.refresh();
    });
  },
  methods: {
    preSave() {},
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
.dialog-main-title {
  line-height: 40px;
  font-size: 15px;
  color: #333333;
  margin-bottom: 14px;
}
.dialog-main-input {
  width: 150px;
  height: 30px;
  margin-left: 8px;
}
</style>
