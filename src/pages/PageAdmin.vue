<template>
  <div class="q-ma-md">
    <!-- 数据列表 -->
    <q-table
      color="primary"
      :row-key="fieldId"
      :columns="columns"
      :data="rows"
      :loading="loading > 0"
      :rows-per-page-options="[10, 20, 50]"
      :pagination.sync="pagination"
      selection="multiple"
      :selected.sync="selected"
      @request="request"
    >
      <template v-slot:top>
        <q-space />
        <div class="flex operations">
          <q-btn outline color="primary" icon="add" @click="showCreate" :disable="loading > 0" />
          <q-btn
            outline
            color="red"
            icon="clear"
            @click="showDeleteRows"
            :disable="loading > 0 || selected.length === 0"
          />
        </div>
      </template>
      <q-td slot="body-cell-operation" slot-scope="{ row }">
        <q-btn v-if="row.id != 1" @click="resetPassword(row)" label="重置密码" />
        <q-btn label="编辑" @click="showEdit(row)" />
      </q-td>
    </q-table>

    <!-- 添加与编辑 -->
    <q-dialog v-model="modeEdit" no-backdrop-dismiss>
      <q-card style="width: 640px">
        <q-form @submit="save">
          <q-card-section>
            <div class="text-h6">{{ edata.id ? '修改' : '添加' }}</div>
            <q-input dense outlined stack-label label="账号" v-model="edata.name" :rules="[(v) => !!v]" />
            <q-select
              dense
              outlined
              stack-label
              label="类型"
              v-model="edata.roleId"
              :options="dicts.roles"
              emit-value
              map-options
              :rules="[(v) => !!v || '请选择一个角色']"
            />
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
  name: 'PageAdmin',
  mixins: [MixinCRUD],
  data() {
    return {
      // 主键字段和名称字段
      fieldId: 'id',
      fieldName: 'name',

      // 改动数据的接口名称
      gqlCreate: 'admin.create',
      gqlUpdate: 'admin.update',
      gqlDelete: 'admin.delete',

      // 表格列设置
      columns: [
        { name: 'name', label: '账号', field: 'name', align: 'left' },
        { name: 'role', label: '类型', field: 'role', align: 'left', format: (v) => v?.name || '无' },
        { name: 'tzCreate', label: '创建时间', field: 'tzCreate', align: 'left' },
        { name: 'parent', label: '上级', field: 'parent', align: 'left', format: (v) => v?.name || '无' },
        { name: 'operation', label: '操作', style: 'width: 100px', align: 'right' },
      ],
      edata: {
        name: '',
        roleId: '',
      },
    };
  },

  mounted() {
    this.refresh();
  },

  methods: {
    async refresh() {
      const { admins } = await this.grequest('admins', {
        ...this.paginationParams,
      });
      this.pagination.rowsNumber = admins.totalCount;
      this.rows = admins.nodes;
      this.selected = [];
    },
    async resetPassword({ id, name }) {
      const isConfirm = await this.confirm(`重置${name}的密码吗？`);
      console.log(isConfirm);
      if (!isConfirm) {
        return;
      }

      const { resetPassword } = await this.grequest('resetPassword', {
        id,
      });
      console.log(resetPassword.plain);
      this.alert({ title: '请记住新密码', message: resetPassword.plain });
    },

    preSave() {
      this.edata.parentId = this.token().uuid;
    },
  },
};
</script>
