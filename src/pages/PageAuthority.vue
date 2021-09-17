<template>
  <div>
    <div class="q-pa-md body">
      <div style="border: solid 1px rgba(0, 0, 0, 0.12);width:20%;min-width:200px;height:800px">
        <div class="title1">系统角色</div>
        <q-tree
          :nodes="simple"
          node-key="value"
          selected-color="primary"
          :selected.sync="selectedTree"
          :expanded.sync="expanded"
          @update:selected="goFunction"
        />
      </div>
      <q-space></q-space>
      <div style="width:79%;border: solid 1px rgba(0, 0, 0, 0.12);">
        <div class="top row">
          <span class="title">分配权限-{{ name }}</span>
          <q-space />
          <q-btn class="btn" label="保存" color="secondary" :disable="loading > 0" @click="goSave" />
        </div>
        <div class="q-pa-md row">
          <q-table
            class="functions"
            color="primary"
            row-key="id"
            :columns="columns"
            :data="rows"
            :loading="loading > 0"
            :rows-per-page-options="[99]"
            separator="cell"
            flat
          >
            <!-- 自定义列-->
            <q-td style="text-align:center;width:25%;" slot="body-cell-check" slot-scope="{ row }">
              <q-checkbox v-model="row.checked" @input="$forceUpdate()" />
            </q-td>
          </q-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MixinCommon } from '../mixins/MixinCommon';
import { http } from '../utils/luch-request/index.js';
export default {
  mixins: [MixinCommon],
  data() {
    return {
      edata: {},
      rows: [],
      columns: [
        {
          name: 'id',
          label: '功能ID',
          field: 'id',
          align: 'center',
        },
        {
          name: 'name',
          label: '功能名称',
          field: 'name',
          align: 'left',
          format: (v, r) => (r.parent ? '├' + v : v),
        },
        {
          name: 'check',
          label: '权限分配',
          field: 'check',
          align: 'center',
        },
      ],

      loading: 0,
      name: '',
      urolename: '',
      selectedTree: 1,
      simple: [],
      expanded: [],
      ufdataold: [],
      roles: [],
    };
  },
  async mounted() {
    this.refresh();
  },
  methods: {
    async refresh() {
      this.simple = [];
      let url = `/role/get?limit=${999}&page=${1}`;
      const roles = await http.get(url);
      roles.data.list.forEach((v) => {
        v.value = v.id;
        v.label = v.name;
      });
      this.roles = [...roles.data.list];
      this.simple = [...roles.data.list];
      //const { functions } = await this.grequest('functionsAll');
      this.rows = [
        {
          id: 10100,
          name: '首页',
          icon: 'https',
          route: '/home',
          parent: '10000',
        },
        {
          id: 10200,
          name: '用户管理',
          icon: 'https',
          route: '/person',
          parent: '10000',
        },
        {
          id: 10300,
          name: '角色管理',
          icon: 'https',
          route: '/role',
          parent: '10000',
        },
        {
          id: 10400,
          name: '商户管理',
          icon: 'https',
          route: '/shop',
          parent: '10000',
        },
        {
          id: 10500,
          name: '补贴方案设置',
          icon: 'https',
          route: '/subsidy',
          parent: '10000',
        },
        {
          id: 10600,
          name: '补贴记录',
          icon: 'https',
          route: '/record',
          parent: '10000',
        },
        {
          id: 10700,
          name: '统计报表',
          icon: 'https',
          route: '/statistical',
          parent: '10000',
        },
        {
          id: 20100,
          name: '菜单管理',
          icon: 'https',
          route: '/statistical',
          parent: '10000',
        },
        {
          id: 20200,
          name: '账号管理',
          icon: 'https',
          route: '/admin',
          parent: '10000',
        },
        {
          id: 20300,
          name: '权限管理',
          icon: 'https',
          route: '/authority',
          parent: '10000',
        },
      ];
      this.$forceUpdate();
      this.selectedTree = this.simple[0].value;
      this.goFunction(0);
    },
    async goFunction() {
      let role = this.roles.find((v) => v.id == this.selectedTree);
      this.name = role.name;
      //const { uroleFunctions } = await this.grequest('urolefunctions', {
      //  condition: {
      //    roleId: this.selectedTree,
      //  },
      //});
      //let ufdata = uroleFunctions.nodes;
      //this.ufdataold = [];
      //this.rows.forEach((v) => {
      //  v.checked = false;
      //  for (let i = 0; i < ufdata.length; i++) {
      //    if (v.id == ufdata[i].functionId) {
      //      v.checked = true;
      //      this.ufdataold.push(v.id);
      //      ufdata.splice(i, 1);
      //      i--;
      //    }
      //  }
      //});
      this.$forceUpdate();
    },
    async goSave() {
      this.loading++;
      let updata = [];
      this.rows.forEach((v) => {
        if (v.checked) {
          updata.push(v.id);
        }
      });
      this.loading--;
      await this.alert('保存成功');
      this.goFunction();
    },
  },
};
</script>

<style scoped>
.body {
  display: flex;
}
.btn {
  margin: 8px;
}
.top {
  height: 57px;
  border-bottom: 1px solid #ccc;
  background: #fff;
}
.title1 {
  padding-top: 13px;
  padding-left: 5px;
  height: 50px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
  color: rgb(90, 89, 72);
  background-color: #d1eee1;
  font-size: 15px;
}
.title {
  color: #225e56;
  font-size: 14px;
  line-height: 22px;
  font-weight: bold;
  padding: 16px;
}
td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.functions {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.find {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
