<template>
  <div class="q-ma-md" style="max-width: 200px">
    <q-form @submit="onSubmit">
      <!-- @TODO 增加专用接口校验旧密码来更改密码
      <q-input
        v-model="oldPassword"
        label="原密码"
        type="password"
        :rules="[v => v.length || '请输入原密码']"
      />
      -->
      <q-input
        dense
        outlined
        stack-label
        v-model="newPassword"
        label="新密码"
        type="password"
        :rules="[(v) => v.length || '请输入新密码']"
      />
      <q-input
        dense
        outlined
        stack-label
        v-model="newPasswordRepeat"
        label="再次输入新密码"
        type="password"
        :rules="[(v) => v == newPassword || '两次输入密码不同']"
      />
      <q-btn label="修改密码" type="submit" color="primary" class="full-width" />
    </q-form>
  </div>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';

export default {
  name: 'PagePassword',
  mixins: [MixinCommon],
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
    };
  },
  methods: {
    async onSubmit() {
      const { uuid } = this.token();
      await this.grequest('admin.update', {
        id: uuid,
        patch: {
          password: this.newPassword,
        },
      });

      this.alert('密码已修改');
    },
  },
};
</script>
