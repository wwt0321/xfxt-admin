<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="print-hide">
      <q-toolbar style="padding-left: 0;">
        <q-img v-show="minidrawer" src="~assets/logo.png" style="width: 56px; height: 50px;" contain />
        <q-img v-show="!minidrawer" src="~assets/banner.png" style="width: 200px; height: 50px;" contain />
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="minidrawer = !minidrawer" />

        <q-toolbar-title>
          {{ $q.title }}
        </q-toolbar-title>

        <q-chip @click="logout" clickable>
          <q-avatar size="28px">
            <img src="~assets/avatar.svg" style="width: 28px; height: 28px;" class="bg-white" />
          </q-avatar>
          Admin
          <!-- @TODO 当前登录用户，展开更多菜单 -->
        </q-chip>
      </q-toolbar>
    </q-header>

    <q-drawer
      :mini="minidrawer"
      show-if-above
      content-class="bg-grey-1"
      :width="200"
      :breakpoint="1000"
      class="print-hide"
      bordered
    >
      <q-scroll-area class="fit">
        <div v-if="minidrawer" style="height: 8px;" />
        <div v-for="group in groups.nodes" :key="group.id">
          <q-item-label header dense>{{ group.name }}</q-item-label>
          <q-item v-for="func in group.functions.nodes" :to="func.route" :key="func.id" dense>
            <q-tooltip
              v-if="minidrawer"
              anchor="center right"
              self="center left"
              :offset="[0, 0]"
              transition-show="fade"
              transition-hide="fade"
              content-style="border-top-left-radius: 0; border-bottom-left-radius: 0"
            >
              <span style="font-size: 18px; line-height: 19px;">
                {{ func.name }}
              </span>
            </q-tooltip>
            <q-item-section avatar>
              <q-icon :name="func.icon" size="xs" />
            </q-item-section>
            <q-item-section>{{ func.name }}</q-item-section>
          </q-item>
          <q-separator spaced v-if="minidrawer" />
        </div>
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
      groups: [],
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
    const { groups } = await this.grequest('functions');
    this.groups = groups;

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
