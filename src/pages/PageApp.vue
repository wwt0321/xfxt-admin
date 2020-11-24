<template>
  <div class="q-ma-md">
    <!-- 数据列表 -->
    <q-table
      color="primary"
      row-key="id"
      :columns="columns"
      :data="rows"
      :loading="loading > 0"
      :rows-per-page-options="[10, 20, 50]"
      :pagination.sync="pagination"
      selection="multiple"
      :selected.sync="selected"
      @request="request"
    >
      <!-- 自定义头部：筛选查询、操作、添加等 -->
      <template v-slot:top-left>
        <q-btn-toggle v-model="type" toggle-color="primary" :options="dicts.appTypes || []" @click="refresh" />
      </template>
      <template v-slot:top-right>
        <q-btn flat :disable="loading > 0" icon="add" @click="showCreate" />
        <q-btn flat :disable="loading > 0 || selected.length == 0" icon="delete" @click="showDeleteRows" />
      </template>

      <!-- 自定义列：需要特殊展示方式的列 -->
      <q-td slot="body-cell-icon" slot-scope="{ row }">
        <q-img :src="row.icon" style="width: 32px; height: 32px;" />
      </q-td>

      <!-- 操作列，固定需要此列，以便快速编辑 -->
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <q-btn label="编辑" @click="showEdit(row)" />
      </q-td>
    </q-table>

    <!-- 添加与编辑 -->
    <q-dialog v-model="modeEdit" no-backdrop-dismiss>
      <q-card style="width:640px;">
        <q-form @submit="save">
          <q-card-section>
            <div class="text-h6">{{ edata[fieldId] ? '修改' : '添加' }}</div>
            <q-select
              outlined
              dense
              stack-label
              v-model="edata.typeId"
              label="类型"
              :options="dicts.appTypes"
              :rules="[(v) => !!v]"
              emit-value
              map-options
            />
            <q-input outlined dense stack-label v-model="edata.title" label="名称" :rules="[(v) => !!v]" />
            <q-input outlined dense stack-label v-model="edata.icon" label="图标" :rules="[(v) => !!v]" />
            <q-input outlined dense stack-label v-model="edata.url" label="地址" :rules="[(v) => !!v]" />
            <q-input outlined dense stack-label v-model.number="edata.sort" label="排序" :rules="[(v) => !!v]" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat @click="modeEdit = false" label="关闭" />
            <q-btn type="submit" :loading="mutating > 0" :disabled="mutating > 0" :label="edata.id ? '保存' : '添加'" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { MixinCRUD } from '../mixins/MixinCRUD';

export default {
  name: 'PageApp',
  mixins: [MixinCRUD],
  data() {
    return {
      // 主键字段和名称字段
      fieldId: 'id',
      fieldName: 'title',

      // 改动数据的接口名称
      gqlCreate: 'app.create',
      gqlUpdate: 'app.update',
      gqlDelete: 'app.delete',

      // 表格列设置
      columns: [
        { name: 'type', label: '类型', field: 'type', align: 'left', format: (v) => v.name, style: 'width: 80px;' },
        { name: 'title', label: '名称', field: 'title', align: 'left', style: 'width: 100px;' },
        { name: 'icon', label: '图标', field: 'icon', align: 'left', style: 'width: 60px;' },
        {
          name: 'url',
          label: '地址',
          field: 'url',
          align: 'left',
          style: 'max-width: 500px; overflow: hidden; text-overflow: ellipsis; ',
        },
        { name: 'sort', label: '排序', field: 'sort', style: 'width: 60px;' },
        { name: 'operation', label: '操作' },
      ],

      // 添加的默认值与编辑的范围
      edata: {
        id: '',
        typeId: 1,
        title: '',
        icon: '',
        url: '',
        sort: 1,
      },

      // 其他变量
      type: 1,
    };
  },

  mounted() {
    this.refresh();
  },

  methods: {
    async refresh() {
      const { apps } = await this.grequest('apps', { typeId: this.type, ...this.paginationParams });
      this.pagination.rowsNumber = apps.totalCount;
      this.rows = apps.nodes;
      this.selected = [];
    },
  },
};
</script>
