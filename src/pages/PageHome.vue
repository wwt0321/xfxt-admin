<template>
  <div class="app q-pa-lg" :style="conheight">
    <div class="top">
      <div class="card-top row">
        <div class="card-top-title">
          信息总览
        </div>
        <q-space></q-space>
        <q-tabs dense style="margin-right:22px" v-model="tab" align="left" active-color="secondary">
          <q-tab name="tab1" label="今天" />
          <q-tab name="tab3" label="昨天" />
          <q-tab name="tab4" label="近7日" />
          <q-tab name="tab5" label="近30日" />
        </q-tabs>
      </div>
      <div class="top-body row">
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">现金充值</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ xjcz }}</div>
        </div>
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">补贴</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ bt }}</div>
        </div>
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">消费</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ xf }}</div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="card">
        <div class="card-top row">
          <div class="card-top-title">
            账户充值
          </div>
        </div>
        <div class="card-body" style="padding:24px 30px;">
          <div class="card-body">
            <div class="card-body-box-cz row">
              <div class="card-body-box-cz-title">金额：</div>
              <q-space></q-space>
              <q-input outlined dense class="card-body-box-cz-input" color="blue" placeholder="请输入金额"></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">姓名：</div>
              <q-space></q-space>
              <q-input outlined dense class="card-body-box-cz-input" color="blue" placeholder="请输入姓名"></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">工号：</div>
              <q-space></q-space>
              <q-input outlined dense class="card-body-box-cz-input" color="blue" placeholder="请输入工号"></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">类型：</div>
              <q-space></q-space>
              <div class="card-body-box-cz-input">
                <q-radio style="font-size:14px" v-model="shape" val="line1" label="充值" />
                <q-radio style="margin-left:20px;font-size:14px" v-model="shape" val="line2" label="退费" />
                <q-radio style="margin-left:20px;font-size:14px" v-model="shape" val="line3" label="补贴" />
                <q-radio style="margin-left:20px;font-size:14px" v-model="shape" val="line4" label="退补" />
              </div>
            </div>
            <div class="card-body-box-cz row" style="margin-top:20px">
              <q-btn color="secondary" style="width:100%;" label="确定"></q-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-top row">
          <div class="card-top-title">
            个人补贴
          </div>
        </div>
        <div class="card-body" style="padding:24px 30px;">
          <div class="card-body">
            <div class="card-body-box-cz row">
              <div class="card-body-box-cz-title">金额：</div>
              <q-space></q-space>
              <q-input
                outlined
                dense
                class="card-body-box-cz-input"
                color="blue"
                placeholder="请输入补贴金额"
              ></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">姓名：</div>
              <q-space></q-space>
              <q-input outlined dense class="card-body-box-cz-input" color="blue" placeholder="请输入姓名"></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">工号：</div>
              <q-space></q-space>
              <q-input outlined dense class="card-body-box-cz-input" color="blue" placeholder="请输入工号"></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:70px">
              <q-btn color="secondary" style="width:100%;" label="确定"></q-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-top row">
          <div class="card-top-title">
            按角色补贴
          </div>
        </div>
        <div class="card-body" style="padding:24px 30px;">
          <div class="card-body">
            <div class="card-body-box-cz row">
              <div class="card-body-box-cz-title">金额：</div>
              <q-space></q-space>
              <q-input
                outlined
                dense
                class="card-body-box-cz-input"
                color="blue"
                placeholder="请输入补贴金额"
              ></q-input>
            </div>
            <div class="card-body-box-cz row" style="margin-top:10px">
              <div class="card-body-box-cz-title">角色：</div>
              <q-space></q-space>
              <q-select
                class="card-body-box-cz-input"
                outlined
                dense
                emit-value
                map-options
                v-model="model"
                :options="options"
              />
            </div>
            <div class="card-body-box-cz row" style="margin-top:120px">
              <q-btn color="secondary" style="width:100%;" label="确定"></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageHome',
  data() {
    return {
      //屏幕高度
      conheight: {
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
      tab: 'tab1',
      shape: '',
      xjcz: 100,
      bt: 1000,
      xf: 1234.24,
    };
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  methods: {
    getHeight() {
      this.conheight.height = window.innerHeight - 66 + 'px';
    },
  },
};
</script>
<style scoped>
.app {
  width: 100%;
  min-width: 1440px;
  background: rgb(242, 243, 245);
  height: 160px;
}
.top {
  width: 100%;
  background: rgb(255, 255, 255);
}
.top-body {
  display: flex;
  justify-content: space-between;
  height: 110px;
  padding: 20px;
}
.top-body-box {
  height: 70px;
  width: 32%;
  border: 1.1px solid #e8e8e8;
  border-radius: 6.5px;
  padding: 0px 36px 0px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.body {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.card {
  width: 32.5%;
  height: 360px;
  background: rgb(255, 255, 255);
  border-radius: 4.5px;
  transition: unset;
}
.card-top {
  height: 52px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
}
.card-top-title {
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  margin-left: 22px;
}
.card-body {
  height: 110px;
}
.card-body-box {
  height: 70px;
  width: 100%;
  border: 1.1px solid #e8e8e8;
  border-radius: 6.5px;
  padding: 0px 36px 0px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-body-box-xx-title {
  width: 60px;
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: Normal;
  text-align: left;
  color: #333333;
  line-height: 20px;
  text-align: left;
}
.card-body-box-xx-money {
  width: 280px;
  height: 28px;
  opacity: 1;
  font-size: 20px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: Bold;
  text-align: right;
  color: #01979d;
  line-height: 28px;
}
.card-body-box-cz {
  height: 40px;
  width: 100%;
}
.card-body-box-cz-title {
  width: 42px;
  height: 40px;
  opacity: 1;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: Normal;
  text-align: left;
  color: #333333;
  line-height: 40px;
}
.card-body-box-cz-input {
  width: 88%;
}
</style>
