<template>
  <q-card>
    <q-form @submit="goSubmit">
      <div class="row top">
        <div class="dialog-title">{{ primaryId ? '编辑' : '新增' }}角色</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <div class="dialog-main-title">角色名称：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入角色名称"
            v-model="edata.name"
            :rules="[(v) => !!v]"
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

      gql: {
        create: '/role/add',
        update: '',
      },

      edata: {},
    };
  },

  async mounted() {
    this.edata = this.selected[0] ? { ...this.selected[0] } : {};
    this.edata.state = this.edata.id ? this.edata.state : 1;
  },
  methods: {
    preSave() {},
    async goSubmit() {
      if (this.edata.id) {
        this.loading++;
        const res = await http.put(`/role/rename/${this.edata.id}?name=${this.edata.name}`);
        if (res.res) {
          this.$emit('submit', this.edata);
          this.hide();
        } else {
          this.alert('修改失败');
        }
        this.loading--;
      } else {
        this.submit('');
      }
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
  height: 40px;
  width: 100%;
  margin-bottom: 17px;
}
.dialog-main-title {
  width: 80px;
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  text-align: left;
  line-height: 40px;
}
.dialog-main-title-main {
  width: 250px;
  font-size: 15px;
  font-weight: 600;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  text-align: left;
  line-height: 40px;
}
.dialog-main-input {
  height: 40px;
  width: 250px;
}
.dialog-main-btn {
  margin-top: 12px;
  width: 100%;
  height: 40px;
}
</style>
