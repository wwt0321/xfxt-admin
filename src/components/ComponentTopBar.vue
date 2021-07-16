<template>
  <div :style="'height:' + height + 'px;'">
    <q-page-sticky class="top-bar" position="top" expand>
      <div ref="topbar" class="flex bar-box">
        <div class="title">
          <slot name="title"></slot>
        </div>
        <q-space />
        <div class="flex operations q-ma-sm" :style="height > 60 ? margintop : ''">
          <slot name="operations"></slot>
        </div>
      </div>
    </q-page-sticky>
  </div>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';

export default {
  name: 'ComponentTopBar',
  mixins: [MixinCommon],
  props: ['title'],
  data() {
    return {
      height: 56,
      margintop: 'margin-top:-10px;',
    };
  },
  methods: {},
  mounted() {
    setTimeout(() => {
      let height = this.$refs.topbar.offsetHeight + 1;
      this.height = height > 60 ? height - 20 : height;
    });
  },
};
</script>

<style lang="scss" scoped>
.top-bar {
  border-bottom: 1px solid #ccc;
  background: #fff;
  z-index: 2;
}
.bar-box {
  width: 100%;
  justify-content: center;
}
.title {
  color: $primary;
  font-size: 14px;
  line-height: 22px;
  font-weight: bold;
  padding: 16px;
}
.operations > * {
  margin-right: 8px;
}
</style>
