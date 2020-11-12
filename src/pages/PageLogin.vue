<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10 bg-white">
              <img src="../assets/avatar.svg" style="width: 80px;" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                登录
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="login" class="q-gutter-md">
              <q-input
                label="用户名"
                v-model="username"
                type="text"
                :rules="[(v) => !!v || '']"
                hide-bottom-space
                outlined
                stack-label
                lazy-rules
                filled
              />
              <q-input
                label="密码"
                v-model="password"
                type="password"
                :rules="[(v) => !!v || '']"
                hide-bottom-space
                outlined
                stack-label
                lazy-rules
                filled
              />
              <div>
                <q-btn type="submit" color="primary" label="登录" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';

export default {
  name: '',
  mixins: [MixinCommon],
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      const token = await this.exchangeToken({
        username: this.username,
        password: this.password,
      });
      if (!token) {
        this.$q.notify({
          message: '登录失败',
        });
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
.q-layout {
  background: rgb(50, 154, 236);
  background: linear-gradient(
    135deg,
    rgba(50, 154, 236, 1) 0%,
    rgba(89, 125, 242, 1) 33%,
    rgba(62, 119, 238, 1) 67%,
    rgba(35, 209, 246, 1) 100%
  );
}
</style>
