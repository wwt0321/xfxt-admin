<template>
  <q-card>
    <q-form @submit="goSubmit">
      <div class="row top">
        <div class="dialog-title">消费限制</div>
        <q-space />
        <q-img class="dialog-close" src="../assets/close.svg" @click="hide"></q-img>
      </div>
      <q-card-section style="padding:25px 40px">
        <!-- 表单内容 -->
        <div class="dialog-main row">
          <span class="dialog-main-title">角色：</span>
          <div class="dialog-main-title" style="font-weight:600">{{ edata.name }}</div>
        </div>
        <div class="dialog-main row">
          <span class="dialog-main-title">每日消费上限：</span>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输每日消费上限金额"
            v-model="edata.max"
            :rules="[(v) => !!v]"
          />
        </div>
        <div class="dialog-main row">
          <div class="dialog-main-title">每次消费金额：</div>
          <q-input
            class="dialog-main-input"
            outlined
            stack-label
            dense
            placeholder="请输入单次消费金额"
            v-model="edata.limit"
            :rules="[(v) => !!v]"
          />
        </div>

        <q-btn
          class="dialog-main-btn"
          type="primary"
          :loading="mutating > 0"
          :disabled="mutating > 0"
          label="确定"
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
  name: 'FormEventType',
  mixins: [MixinForm],
  props: ['selected', 'type'],
  data() {
    return {
      mutating: 0,
      eventCategories: [],

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
  },
  methods: {
    preSave() {},
    async goSubmit() {
      const res = await http.put(`/role/set/${this.edata.id}?limit=${this.edata.limit}&max=${this.edata.max}`);
      if (res.res) {
        this.$emit('submit', this.edata);
        return this.hide();
      } else {
        alert('设置失败');
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
  font-size: 15px;
  font-family: PingFang SC, PingFang SC-Normal;
  color: #333333;
  margin-right: 8px;
  line-height: 40px;
}
.dialog-main-input {
  height: 40px;
  width: 216px;
}
.dialog-main-btn {
  margin-top: 12px;
  width: 100%;
  height: 40px;
}
</style>
