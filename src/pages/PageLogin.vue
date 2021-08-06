<template>
  <div class="app" :style="conheight">
    <div class="body row" :style="conheight">
      <q-img class="img1" src="../assets/login1.png"></q-img>
      <q-img class="img2" src="../assets/login2.png"></q-img>
      <q-img class="img3" src="../assets/login3.png"></q-img>
      <q-img class="img4" src="../assets/login4.png"></q-img>
      <q-img class="img5" src="../assets/login5.png"></q-img>
      <q-img class="img6" src="../assets/login6.png"></q-img>
      <q-img class="img7" src="../assets/login7.png"></q-img>
      <q-img class="line1" src="../assets/line1.png"></q-img>
      <q-img class="line2" src="../assets/line2.png"></q-img>
      <q-img class="line3" src="../assets/line3.png"></q-img>
      <q-img class="line4" src="../assets/line4.png"></q-img>
      <div class="body-main">
        <div class="body-main-box">
          <div class="body-main-box-title">
            消费管理系统后台
          </div>
          <q-form @submit="login">
            <div style="margin-top:16px">
              <q-input
                class="body-main-box-input"
                outlined
                v-model="username"
                placeholder="请输入账号"
                :rules="[(v) => !!v]"
              />
            </div>
            <div style="margin-top:40px">
              <q-input
                class="body-main-box-input"
                outlined
                type="password"
                v-model="password"
                placeholder="请输入密码"
                :rules="[(v) => !!v]"
              />
            </div>
            <q-btn class="body-main-box-btn" type="submit" color="primary" label="登录" />
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';
import { tokenKey } from '../../config.js';
import { http } from '../utils/luch-request/index.js';

export default {
  name: '',
  mixins: [MixinCommon],
  data() {
    return {
      //屏幕高度
      conheight: {
        height: '',
      },
      username: '',
      password: '',
    };
  },
  created() {
    window.addEventListener('resize', this.getHeight);
    this.getHeight();
  },

  methods: {
    async login() {
      let params = new FormData();
      params.append('username', this.username);
      params.append('password', this.password);
      const token = await http.post('/system/login', params);
      localStorage.setItem(tokenKey, token.data);
      this.$router.replace(localStorage.to ? localStorage.to : '/home');
    },
    getHeight() {
      this.conheight.height = window.innerHeight + 'px';
    },
  },
  mounted() {
    localStorage.removeItem('logout');
  },
};
</script>

<style scoped>
.app {
  width: 100%;
  min-width: 1440px;
  height: 1020px;
  background: url('../assets/background.png');
  background-color: #01979d;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 900px;
  height: 100%;
}
.body {
  width: 100%;
  min-width: 1440px;
  height: 1020px;
  background: url('../assets/bottom.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position-y: bottom;
  min-height: 900px;
  height: 100%;
}
.body-main {
  width: 700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}
.body-main-box {
  width: 700px;
  height: 480px;
  background: #ffffff;
  border-radius: 25px;
}
.body-main-box-title {
  position: relative;
  bottom: 117px;
  text-align: center;
  font-size: 60px;
  font-weight: 600;
  color: #ffffff;
  line-height: 84px;
}
.body-main-box-input {
  width: 500px;
  height: 60px;
  margin: 0 auto;
}
.body-main-box-btn {
  width: 500px;
  height: 60px;
  margin: 80px 100px;
}
.img1 {
  width: 147px;
  height: 147px;
  top: 240px;
  left: 192px;
  position: absolute;
  z-index: 0;
}
.img2 {
  width: 126px;
  height: 126px;
  top: 490px;
  left: 65px;
  position: absolute;
  z-index: 0;
}
.img3 {
  width: 141px;
  height: 141px;
  top: 484px;
  left: 360px;
  position: absolute;
  z-index: 0;
}
.img4 {
  width: 140px;
  height: 140px;
  top: 635px;
  left: 227px;
  position: absolute;
  z-index: 0;
}
.img5 {
  width: 133px;
  height: 133px;
  top: 332px;
  right: 337px;
  position: absolute;
  z-index: 0;
}
.img6 {
  width: 137px;
  height: 137px;
  top: 500px;
  right: 101px;
  position: absolute;
  z-index: 0;
}
.img7 {
  width: 133px;
  height: 133px;
  top: 603px;
  right: 396px;
  position: absolute;
  z-index: 0;
}
.line1 {
  width: 63px;
  height: 114px;
  top: 369px;
  left: 153px;
  position: absolute;
  z-index: 0;
}
.line2 {
  width: 61px;
  height: 56px;
  top: 612px;
  left: 175px;
  position: absolute;
  z-index: 0;
}
.line3 {
  width: 112px;
  height: 102px;
  top: 438px;
  right: 235px;
  position: absolute;
  z-index: 0;
}
.line4 {
  width: 153px;
  height: 55px;
  top: 593px;
  right: 242px;
  position: absolute;
  z-index: 0;
}
</style>
