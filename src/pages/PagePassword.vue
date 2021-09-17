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
        style="margin:20px 0;"
        dense
        outlined
        stack-label
        v-model="newPasswordRepeat"
        label="再次输入新密码"
        type="password"
        :rules="[(v) => v == newPassword || '两次输入密码不同']"
      />
      <q-btn label="修改密码" type="submit" color="primary" :loading="loading > 0" class="full-width" />
    </q-form>
  </div>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';
import { http } from '../utils/luch-request/index.js';
export default {
  name: 'PagePassword',
  mixins: [MixinCommon],
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      loading: 0,
    };
  },
  methods: {
    async onSubmit() {
      this.loading++;
      let user = JSON.parse(localStorage.user);
      const res = await http.put(`/system/updatePwd?id=${user.id}&pwd=${this.newPassword}`);
      console.log(res);
      if (res.res) {
        this.alert('密码修改成功');
      } else {
        this.alert('密码修改失败');
      }
      this.loading--;
    },
  },
};
</script>
