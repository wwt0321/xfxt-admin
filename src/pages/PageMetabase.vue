<template>
  <q-page :style-fn="getPageBox">
    <iframe v-if="src" :src="src" :style="{ height: frameHeight }" style="border: 0; width: 100%;"></iframe>
  </q-page>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';

export default {
  name: '',
  mixins: [MixinCommon],
  data() {
    return {
      frameHeight: '100%',
    };
  },
  computed: {
    src() {
      try {
        return decodeURIComponent(this.$route.params.url);
      } catch (e) {
        return '';
      }
    },
  },
  methods: {
    getPageBox(offset, height) {
      this.frameHeight = `${height - offset + 61}px`;
      return {
        height: `${height - offset}px`,
        overflow: 'hidden',
      };
    },
  },
  mounted() {},
};
</script>

<style></style>
