<template>
  <div class="q-pa-lg app" :style="conheight">
    <div class="top row">
      <div class="top-title">统计报表</div>
      <div outline class="top-filter">
        <q-btn-group outline class="top-filter-btn" rounded unelevated>
          <q-btn v-if="!all" outline color="secondary" label="总体统计" @click="select(1)" />
          <q-btn v-if="all" color="secondary" label="总体统计" @click="select(1)" />
          <q-btn
            v-if="!persons"
            class="top-filter-btn-border"
            outline
            color="secondary"
            label="人员统计"
            @click="select(2)"
          />
          <q-btn v-if="persons" class="top-filter-btn-border" color="secondary" label="人员统计" @click="select(2)" />
          <q-btn v-if="!shops" outline color="secondary" label="门店统计" @click="select(3)" />
          <q-btn v-if="shops" color="secondary" label="门店统计" @click="select(3)" />
        </q-btn-group>
      </div>
    </div>
    <!--总体统计-->
    <div v-show="all" class="body" :style="bodyheight">
      <div class="all-top row">
        <q-tabs v-model="tab" align="left" active-color="secondary">
          <q-tab class="all-tab" name="tab1" label="今天" @click="timeChange(1)" />
          <q-tab class="all-tab" name="tab2" label="昨天" @click="timeChange(2)" />
          <q-tab class="all-tab" name="tab3" label="近7日" @click="timeChange(3)" />
          <q-tab class="all-tab" name="tab4" label="近30日" @click="timeChange(4)" />
          <q-tab class="all-tab" name="tab5" label="今年" @click="timeChange(5)" />
        </q-tabs>
        <q-space></q-space>
        <q-input
          style="width:180px"
          outlined
          dense
          stack-label
          v-model="time"
          placeholder="请选择开始时间"
          mask="####-##-##"
          clearable
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxyHappen" transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="time" @input="$refs.qDateProxyHappen.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="all-top-line">-</div>
        <q-input
          style="width:180px;margin-right:20px"
          outlined
          dense
          stack-label
          v-model="time"
          placeholder="请选择结束时间"
          mask="####-##-##"
          clearable
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxyHappen" transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="time" @input="$refs.qDateProxyHappen.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn class="top-filter-btn" color="secondary" label="查询"></q-btn>
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
      <div class="all-top row">
        <q-tabs v-model="tab2" align="left" active-color="secondary">
          <q-tab class="all-tab" name="tab1" label="现金充值" />
          <q-tab class="all-tab" name="tab2" label="补贴" />
          <q-tab class="all-tab" name="tab3" label="消费" />
        </q-tabs>
      </div>
      <div style="padding:20px">
        <table-statistical-person-pay :search="filters" v-show="tab2 == 'tab1'" />
        <table-statistical-person-subsidy :search="filters" v-show="tab2 == 'tab2'" />
        <table-statistical-consumption :search="filters" v-show="tab2 == 'tab3'" />
      </div>
    </div>
    <!--人员统计-->
    <div v-show="persons" class="body" :style="bodyheight">
      <div class="all-top row">
        <q-tabs v-model="tab3" align="left" active-color="secondary">
          <q-tab class="all-tab" name="tab1" label="现金充值" />
          <q-tab class="all-tab" name="tab2" label="补贴" />
          <q-tab class="all-tab" name="tab3" label="消费" />
        </q-tabs>
      </div>
      <div style="padding:20px">
        <table-statistical-person-pay v-show="tab3 == 'tab1'" />
        <table-statistical-person-subsidy v-show="tab3 == 'tab2'" />
        <table-statistical-consumption v-show="tab3 == 'tab3'" />
      </div>
    </div>
    <!--门店统计-->
    <div v-show="shops" class="body" :style="bodyheight">
      <div class="all-top row">
        <q-tabs v-model="tab4" align="left" active-color="secondary">
          <q-tab class="all-tab" name="tab1" label="今天" />
          <q-tab class="all-tab" name="tab2" label="昨天" />
          <q-tab class="all-tab" name="tab3" label="近7日" />
          <q-tab class="all-tab" name="tab4" label="近30日" />
          <q-tab class="all-tab" name="tab5" label="今年" />
        </q-tabs>
        <q-space></q-space>
        <q-input
          style="width:180px"
          outlined
          dense
          stack-label
          v-model="time"
          placeholder="请选择开始时间"
          mask="####-##-##"
          clearable
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxyHappen" transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="time" @input="$refs.qDateProxyHappen.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="all-top-line">-</div>
        <q-input
          style="width:180px;margin-right:20px"
          outlined
          dense
          stack-label
          v-model="time"
          placeholder="请选择结束时间"
          mask="####-##-##"
          clearable
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxyHappen" transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="time" @input="$refs.qDateProxyHappen.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn class="top-filter-btn" color="secondary" label="查询"></q-btn>
      </div>
      <div style="padding:20px">
        <table-statistical-consumption />
      </div>
    </div>
  </div>
</template>
<script>
import TableAll from 'src/tables/TableAll.vue';
import TableStatisticalPersonSubsidy from 'src/tables/TableStatisticalPersonSubsidy.vue';
import TableStatisticalConsumption from 'src/tables/TableStatisticalConsumption.vue';
import TableStatisticalPersonPay from 'src/tables/TableStatisticalPersonPay.vue';

export default {
  components: { TableAll, TableStatisticalPersonSubsidy, TableStatisticalConsumption, TableStatisticalPersonPay },
  name: 'PageStartical',
  data() {
    return {
      time: '',
      //屏幕高度
      conheight: {
        height: '',
      },
      bodyheight: {
        height: '',
      },
      tab: 'tab1',
      tab2: 'tab1',
      tab3: 'tab1',
      tab4: 'tab1',
      //顶部的切换
      all: true,
      persons: false,
      shops: false,
      //人员统计
      subsidy: true,
      consumption: false,
      filters: {},
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
        this.all = true;
        this.persons = false;
        this.shops = false;
      } else if (number == 2) {
        this.all = false;
        this.persons = true;
        this.shops = false;
      } else {
        this.all = false;
        this.persons = false;
        this.shops = true;
      }
    },
    timeChange(type) {
      let today = Date.parse(new Date()),
        oneday = 1000 * 60 * 60 * 24;
      if (type == 1) {
        this.filters.startTime = today;
        this.filters.endTime = today + oneday;
      } else if (type == 2) {
        this.filters.startTime = today - oneday;
        this.filters.endTime = today;
      } else if (type == 3) {
        this.filters.startTime = today - 6 * oneday;
        this.filters.endTime = today + oneday;
      } else if (type == 4) {
        this.filters.startTime = Date.parse(new Date(new Date().getFullYear + '-01-01'));
        this.filters.endTime = today + oneday;
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
  margin-right: 20px;
}
.top-filter-btn-border {
  border-left: 1px solid #26a69a;
  border-right: 1px solid #26a69a;
}
.body {
  width: 100%;
  background: #ffffff;
  margin-top: 14px;
}
.body-btn {
  height: 40px;
  margin-bottom: 13px;
}
.all-top {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #ededed;
  display: flex;
  align-items: center;
}
.all-tab {
  height: 60px;
  width: 86px;
}
.all-top-line {
  width: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}
.top-body {
  display: flex;
  justify-content: space-between;
  height: 100px;
  padding: 20px 20px 10px 20px;
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
</style>
