<template>
  <q-card>
    <q-form @submit="submit('')">
      <div class="row top">
        <div class="dialog-title">{{ edata.id ? '编辑' : '新增' }}菜单</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <div class="dialog-main-title">ID：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入ID"
            v-model="edata.id"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">名称：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入名称"
            v-model="edata.name"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">图标：</div>
          <q-input class="dialog-main-input" outlined stack-label dense placeholder="请输入图标" v-model="edata.icon" />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">前端路径：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入前端路径"
            v-model="edata.route"
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
        create: '/system/addFunction',
        update: '/system/updateFunction',
      },

      edata: {},
      filterAttrs: {
        dense: true,
        clearable: true,
        mapOptions: true,
        outlined: true,
        emitValue: true,
        multiple: true,
      },
      apis: [],
    };
  },

  async mounted() {
    let edata = this.selected[0] ? { ...this.selected[0] } : {};
    this.edata = edata;
  },
  methods: {
    async preSave() {},
    ddd() {
      this.$forceUpdate();
      console.log(this.edata);
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
  width: 200px;
}
.dialog-main-btn {
  margin-top: 12px;
  width: 100%;
  height: 40px;
}
</style>
