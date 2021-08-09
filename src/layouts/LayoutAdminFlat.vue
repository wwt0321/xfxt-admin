<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="print-hide" style="height:60px;">
      <q-toolbar style="height:60px;padding:0px">
        <div class="toolbar row">
          <q-img src="~assets/logo.png" style="width: 50px; height: 50px;margin-left:20px" contain />
          <div v-show="!minidrawer" style="margin-left:2px">
            <div class="logo-title">慈溪市龙山医院</div>
            <div class="logo-text">LONGSHAN HOSPITAL OF CIXI</div>
          </div>
          <div class="toolbar-title">
            消费系统管理平台
          </div>
        </div>
        <div style="position:absolute;z-index: -1;width:100%">
          <div class="toolbar-time">{{ date }}</div>
        </div>
        <q-space></q-space>
        <q-avatar style="width:30px;height:30px">
          <!--<img src="https://cdn.quasar.dev/img/avatar.png" />-->
          <q-icon style="font-size:30px" name="person_outline" />
        </q-avatar>
        <div class="toolbar-back" style="margin-left:10px">管理员，你好！</div>
        <div class="row" style="cursor: pointer;margin-left:13px" @click="logout">
          <q-img class="toolbar-image" src="../assets/back.svg"></q-img>
          <div class="toolbar-back" src="../assets/back.svg">退出登录</div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="221"
      :mini="minidrawer"
      show-if-above
      content-class="bg-grey-1"
      :breakpoint="1000"
      class="print-hide"
      bordered
    >
      <q-scroll-area class="fit">
        <div v-if="minidrawer" style="height: 8px" />
        <q-list>
          <q-item
            :class="index == click ? 'itemClick' : 'item'"
            clickable
            v-for="(v, index) in functions.nodes"
            :to="v.route"
            :key="v.id"
            @click="change(index)"
          >
            <q-icon class="layout-icon" size="xs" :name="v.icon" :color="index == click ? 'primary' : 'white'" />
            <div class="layout-name" :style="index == click ? 'color: #01979d;' : 'color: #ffffff;'">{{ v.name }}</div>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view v-if="loaded" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar';
import { map, prop, fromPairs } from 'rambda';
import { MixinCommon } from '../mixins/MixinCommon';
import { tokenKey } from '../../config';

export default {
  name: 'LayoutAdmin',
  mixins: [MixinCommon],
  data() {
    return {
      click: 0,
      date: '',
      minidrawer: false,
      functions: [],
      loaded: true,
    };
  },
  methods: {
    logout() {
      console.log('logout');
      let res = confirm('确认退出登录?');
      if (res) {
        //this.token('');
        localStorage.removeItem(tokenKey);
        localStorage.removeItem('jwtTime');
        this.$router.push('/login');
      }
    },
    change(index) {
      this.click = index;
      console.log(2333, this.click);
    },
  },
  async mounted() {
    //日期
    this.date = date.formatDate(new Date(), 'YYYY年M月D日 dddd');

    /*const { functions } = await this.grequest('functions');
    this.functions = functions;*/
    this.functions = {
      nodes: [
        {
          id: 10100,
          name: '首页',
          icon: 'https',
          route: '/home',
          parentId: '11000',
        },
        {
          id: 10200,
          name: '用户管理',
          icon: 'https',
          route: '/person',
          parentId: '11000',
        },
        {
          id: 10300,
          name: '角色管理',
          icon: 'https',
          route: '/role',
          parentId: '11000',
        },
        {
          id: 10400,
          name: '商户管理',
          icon: 'https',
          route: '/shop',
          parentId: '11000',
        },
        {
          id: 10500,
          name: '补贴方案设置',
          icon: 'https',
          route: '/subsidy',
          parentId: '11000',
        },
        {
          id: 10600,
          name: '补贴记录',
          icon: 'https',
          route: '/record',
          parentId: '11000',
        },
        {
          id: 10700,
          name: '统计报表',
          icon: 'https',
          route: '/statistical',
          parentId: '11000',
        },
      ],
    };

    //const data = await this.grequest('dicts');
    //let dicts = map(prop('nodes'), data);

    // 需要特殊呈现的字典 @TODO，下方是例子
    // const { units } = await this.grequest('units');
    // dicts.treeUnits = units.nodes.map((v, i, a) => {
    //   return {
    //     value: v.id,
    //     label: (v.order.length > 5 ? (a[i + 1]?.order?.length > 5 ? '┣ ' : '┗ ') : '') + v.name,
    //   };
    // });

    //this.$store.commit('dicts/set', dicts);
    //
    //const enums = await this.grequest('enums');
    //this.$store.commit('enums/set', enums);
    //
    //const { configs } = await this.grequest('configs');
    //const pairs = configs.nodes.map((v) => [v.key, { value: v.value, comment: v.comment }]);
    //const configData = fromPairs(pairs);
    //this.$store.commit('configs/set', configData);
    this.loaded = true;
  },
};
</script>
<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding: 0px;
  position: absolute;
  z-index: 1;
}
.toolbar-time {
  text-align: center;
  margin: 0 auto;
}
.drawer {
  background-color: #00696d;
}
.toolbar-title {
  width: 200px;
  height: 28px;
  opacity: 1;
  font-size: 20px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: Bold;
  text-align: left;
  color: #ffffff;
  line-height: 28px;
  padding-left: 10px;
}
.logo-title {
  width: 112px;
  height: 22px;
  opacity: 1;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: Normal;
  text-align: left;
  color: #ffffff;
  line-height: 22px;
}
.logo-text {
  line-height: 12px;
  font-size: 8px;
  font-weight: 100;
}
.toolbar-back {
  margin-right: 30px;
  line-height: 60px;
  font-size: 14px;
}
.toolbar-image {
  width: 20px;
  height: 20px;
  margin: 20px 11px 20px 20px;
}
.q-scrollarea {
  background: #00696d;
}
.layout-name {
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Normal;
  font-weight: Normal;
  text-align: left;
  line-height: 50px;
}
.layout-icon {
  width: 18px;
  height: 18px;
  margin: 16px 10px 16px 30px;
}
.item {
  height: 50px;
  padding: 0;
  margin-top: 10px;
  margin-left: 20px;
  border-top-left-radius: 50px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 0px;
}
.itemClick {
  margin-left: 20px;
  height: 50px;
  padding: 0;
  margin-top: 10px;
  border-top-left-radius: 50px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 0px;
  background: #ffffff;
  border-right: 5px solid #ffc300;
}
</style>
