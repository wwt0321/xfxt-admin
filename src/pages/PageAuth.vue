<template>
  <div style="margin: 200px 0; text-align: center;">
    <q-circular-progress indeterminate size="50px" color="lime" class="q-ma-md" />
    <h6>正在完成自动登录</h6>
  </div>
</template>

<script>
import { MixinTokenWechat } from '../mixins/MixinTokenWechat.js';

export default {
  name: 'PageAuth',
  mixins: [MixinTokenWechat], // 通过混入不同的 token 规则解决各种授权方式和存储
  mounted() {
    this.exchangeToken();
  },
};
</script>
