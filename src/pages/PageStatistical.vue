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
        <q-input style="width:180px" type="date" outlined dense stack-label v-model="timeStart" clearable></q-input>
        <div class="all-top-line">-</div>
        <q-input
          style="width:180px;margin-right:20px"
          type="date"
          outlined
          dense
          stack-label
          v-model="timeEnd"
          clearable
        ></q-input>
        <q-btn class="top-filter-btn" color="secondary" label="查询" @click="timeChange(6)"></q-btn>
      </div>
      <div class="top-body row">
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">现金充值</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ total.rechargeSum || 0 }}</div>
        </div>
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">补贴</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ total.allowanceSum || 0 }}</div>
        </div>
        <div class="top-body-box row">
          <div class="card-body-box-xx-title">消费</div>
          <q-space></q-space>
          <div class="card-body-box-xx-money">￥{{ total.consumeSum || 0 }}</div>
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
        <table-statistical-person-pay ref="table21" :search="filters" v-show="tab2 == 'tab1'" />
        <table-statistical-person-subsidy ref="table22" :search="filters" v-show="tab2 == 'tab2'" />
        <table-statistical-consumption ref="table23" :search="filters" v-show="tab2 == 'tab3'" />
      </div>
    </div>
    <!--人员统计-->
    <div v-show="persons" class="body" :style="bodyheight">
      <div class="all-top row">
        <q-tabs v-model="tab5" align="left" active-color="secondary">
          <q-tab class="all-tab" name="tab1" label="今天" @click="timeChange3(1)" />
          <q-tab class="all-tab" name="tab2" label="昨天" @click="timeChange3(2)" />
          <q-tab class="all-tab" name="tab3" label="近7日" @click="timeChange3(3)" />
          <q-tab class="all-tab" name="tab4" label="近30日" @click="timeChange3(4)" />
          <q-tab class="all-tab" name="tab5" label="今年" @click="timeChange3(5)" />
        </q-tabs>
        <q-space></q-space>
        <q-input style="width:180px" type="date" outlined dense stack-label v-model="timeStart3" clearable></q-input>
        <div class="all-top-line">-</div>
        <q-input
          style="width:180px;margin-right:20px"
          type="date"
          outlined
          dense
          stack-label
          v-model="timeEnd3"
          clearable
        ></q-input>
        <q-btn class="top-filter-btn" color="secondary" label="查询" @click="timeChange3(6)"></q-btn>
      </div>
      <div class="all-top row">
        <q-tabs v-model="tab3" align="left" active-color="secondary">
          <q-tab class="all-tab" name="tab1" label="现金充值" />
          <q-tab class="all-tab" name="tab2" label="补贴" />
          <q-tab class="all-tab" name="tab3" label="消费" />
        </q-tabs>
      </div>
      <div style="padding:20px">
        <table-statistical-person-pay ref="table31" v-show="tab3 == 'tab1'" :search="filters3" />
        <table-statistical-person-subsidy ref="table32" v-show="tab3 == 'tab2'" :search="filters3" />
        <table-statistical-consumption ref="table33" v-show="tab3 == 'tab3'" :search="filters3" />
      </div>
    </div>
    <!--门店统计-->
    <div v-show="shops" class="body" :style="bodyheight">
      <div class="all-top row">
        <q-tabs v-model="tab4" align="left" active-color="secondary">
          <q-tab class="all-tab" name="tab1" label="今天" @click="timeChange2(1)" />
          <q-tab class="all-tab" name="tab2" label="昨天" @click="timeChange2(2)" />
          <q-tab class="all-tab" name="tab3" label="近7日" @click="timeChange2(3)" />
          <q-tab class="all-tab" name="tab4" label="近30日" @click="timeChange2(4)" />
          <q-tab class="all-tab" name="tab5" label="今年" @click="timeChange2(5)" />
        </q-tabs>
        <q-space></q-space>
        <q-input style="width:180px" type="date" outlined dense stack-label v-model="timeStart2" clearable></q-input>
        <div class="all-top-line">-</div>
        <q-input
          style="width:180px;margin-right:20px"
          type="date"
          outlined
          dense
          stack-label
          v-model="timeEnd2"
          clearable
        ></q-input>
        <q-btn class="top-filter-btn" color="secondary" label="查询" @click="timeChange2(6)"></q-btn>
      </div>
      <div style="padding:20px">
        <table-statistical-shops ref="tableshop" :search="filters2" />
      </div>
    </div>
  </div>
</template>
<script>
import TableAll from 'src/tables/TableAll.vue';
import TableStatisticalPersonSubsidy from 'src/tables/TableStatisticalPersonSubsidy.vue';
import TableStatisticalConsumption from 'src/tables/TableStatisticalConsumption.vue';
import TableStatisticalPersonPay from 'src/tables/TableStatisticalPersonPay.vue';
import TableStatisticalShops from 'src/tables/TableStatisticalShops.vue';
import { date } from 'quasar';
import { http } from '../utils/luch-request/index.js';

export default {
  components: {
    TableAll,
    TableStatisticalPersonSubsidy,
    TableStatisticalConsumption,
    TableStatisticalPersonPay,
    TableStatisticalShops,
  },
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
      tab5: 'tab1',
      //顶部的切换
      all: true,
      persons: false,
      shops: false,
      //人员统计
      subsidy: true,
      consumption: false,
      filters: {},
      timeStart: '',
      timeEnd: '',
      filters2: {},
      timeStart2: '',
      timeEnd2: '',
      filters3: {},
      timeStart3: '',
      timeEnd3: '',
      total: {
        allowanceSum: 0,
        rechargeSum: 0,
        consumeSum: 0,
      },
    };
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },
  mounted() {
    this.timeChange(1);
    this.timeChange2(1);
    this.timeChange3(1);
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
        setTimeout(() => {
          this.$refs.table31.refresh();
          this.$refs.table32.refresh();
          this.$refs.table33.refresh();
        });
      } else {
        this.all = false;
        this.persons = false;
        this.shops = true;
      }
    },
    async timeChange(type) {
      let today = date.formatDate(new Date(), 'YYYY-MM-DD'),
        oneday = 1000 * 60 * 60 * 24;
      today = Date.parse(today);
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
        this.filters.startTime = today - 29 * oneday;
        this.filters.endTime = today + oneday;
      } else if (type == 5) {
        this.filters.startTime = Date.parse(new Date(new Date().getFullYear + '-01-01'));
        this.filters.endTime = today + oneday;
      } else if (type == 6) {
        this.filters.startTime = Date.parse(new Date(this.timeStart));
        this.filters.endTime = Date.parse(new Date(this.timeEnd)) + oneday;
        this.tab = '';
      }
      if (type != 6) {
        this.timeStart = '';
        this.timeEnd = '';
      }
      let url = `/statistics/overview?startTime=${this.filters.startTime}&endTime=${this.filters.endTime}`;
      const data = await http.get(url);
      this.total = data.data;
      setTimeout(() => {
        this.$refs.table21.refresh();
        this.$refs.table22.refresh();
        this.$refs.table23.refresh();
      });
    },
    async timeChange2(type) {
      let today = date.formatDate(new Date(), 'YYYY-MM-DD'),
        oneday = 1000 * 60 * 60 * 24;
      today = Date.parse(today);
      if (type == 1) {
        this.filters2.startTime = today;
        this.filters2.endTime = today + oneday;
      } else if (type == 2) {
        this.filters2.startTime = today - oneday;
        this.filters2.endTime = today;
      } else if (type == 3) {
        this.filters2.startTime = today - 6 * oneday;
        this.filters2.endTime = today + oneday;
      } else if (type == 4) {
        this.filters2.startTime = today - 29 * oneday;
        this.filters2.endTime = today + oneday;
      } else if (type == 5) {
        this.filters2.startTime = Date.parse(new Date(new Date().getFullYear + '-01-01'));
        this.filters2.endTime = today + oneday;
      } else if (type == 6) {
        if (!this.timeStart2) {
          return alert('请选择开始时间');
        }
        if (!this.timeEnd2) {
          return alert('请选择结束时间');
        }
        this.filters2.startTime = Date.parse(new Date(this.timeStart2));
        this.filters2.endTime = Date.parse(new Date(this.timeEnd2)) + oneday;
        this.tab4 = '';
      }
      if (type != 6) {
        this.timeStart2 = '';
        this.timeEnd2 = '';
      }
      setTimeout(() => {
        this.$refs.tableshop.refresh();
      });
    },
    async timeChange3(type) {
      let today = date.formatDate(new Date(), 'YYYY-MM-DD'),
        oneday = 1000 * 60 * 60 * 24;
      today = Date.parse(today);
      if (type == 1) {
        this.filters3.startTime = today;
        this.filters3.endTime = today + oneday;
      } else if (type == 2) {
        this.filters3.startTime = today - oneday;
        this.filters3.endTime = today;
      } else if (type == 3) {
        this.filters3.startTime = today - 6 * oneday;
        this.filters3.endTime = today + oneday;
      } else if (type == 4) {
        this.filters3.startTime = today - 29 * oneday;
        this.filters3.endTime = today + oneday;
      } else if (type == 5) {
        this.filters3.startTime = Date.parse(new Date(new Date().getFullYear + '-01-01'));
        this.filters3.endTime = today + oneday;
      } else if (type == 6) {
        if (!this.timeStart3) {
          return alert('请选择开始时间');
        }
        if (!this.timeEnd3) {
          return alert('请选择结束时间');
        }
        this.filters3.startTime = Date.parse(new Date(this.timeStart3));
        this.filters3.endTime = Date.parse(new Date(this.timeEnd3)) + oneday;
        this.tab5 = '';
      }
      if (type != 6) {
        this.timeStart3 = '';
        this.timeEnd3 = '';
      }
      setTimeout(() => {
        this.$refs.table31.refresh();
        this.$refs.table32.refresh();
        this.$refs.table33.refresh();
      });
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
