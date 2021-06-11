<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="print-hide">
      <q-toolbar style="padding-left: 0">
        <q-img v-show="minidrawer" src="~assets/logo.png" style="width: 56px; height: 50px" contain />
        <q-img v-show="!minidrawer" src="~assets/banner.png" style="width: 200px; height: 50px" contain />
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="minidrawer = !minidrawer" />

        <q-toolbar-title>
          {{ $q.title }}
        </q-toolbar-title>

        <q-chip @click="logout" clickable>
          <q-avatar size="28px">
            <img src="~assets/avatar.svg" style="width: 28px; height: 28px" class="bg-white" />
          </q-avatar>
          Admin
          <!-- @TODO 当前登录用户，展开更多菜单 -->
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer :mini="minidrawer" show-if-above content-class="bg-grey-1" :breakpoint="1000" class="print-hide" bordered>
      <q-scroll-area class="fit">
        <div v-if="minidrawer" style="height: 8px" />
        <q-list>
          <q-expansion-item
            v-for="f1 in functions.nodes"
            :key="f1.id"
            :icon="f1.icon"
            :label="f1.name"
            group="f1"
            :content-inset-level="1"
            expand-separator
          >
            <template v-for="f2 in f1.functions.nodes">
              <q-item v-if="f2.route" :to="f2.route" :key="f2.id"> {{ f2.name }} </q-item>
              <template v-else>
                <q-expansion-item
                  :key="f2.id"
                  :label="f2.name"
                  :content-inset-level="0.5"
                  dense-toggle
                  expand-separator
                >
                  <q-item :header-inset-level="1" v-for="f3 in f2.functions.nodes" :to="f3.route" :key="f3.id">
                    {{ f3.name }}
                  </q-item>
                </q-expansion-item>
              </template>
            </template>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { map, prop, fromPairs } from 'rambda';
import { MixinCommon } from '../mixins/MixinCommon';

export default {
  name: 'LayoutAdmin',
  mixins: [MixinCommon],
  data() {
    return {
      minidrawer: false,
      functions: [],
    };
  },
  methods: {
    logout() {
      console.log('logout');
      this.token('');
      this.$router.push('/login');
    },
  },
  async mounted() {
    const { functions } = await this.grequest('functions');
    this.functions = functions;

    const data = await this.grequest('dicts');
    let dicts = map(prop('nodes'), data);

    // 需要特殊呈现的字典 @TODO，下方是例子
    // const { units } = await this.grequest('units');
    // dicts.treeUnits = units.nodes.map((v, i, a) => {
    //   return {
    //     value: v.id,
    //     label: (v.order.length > 5 ? (a[i + 1]?.order?.length > 5 ? '┣ ' : '┗ ') : '') + v.name,
    //   };
    // });

    this.$store.commit('dicts/set', dicts);

    const { configs } = await this.grequest('configs');
    const pairs = configs.nodes.map((v) => [v.key, { value: v.value, comment: v.comment }]);
    const configData = fromPairs(pairs);
    this.$store.commit('configs/set', configData);
  },
};
</script>
