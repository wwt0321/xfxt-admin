<template>
  <q-page :style-fn="getPageBox">
    <iframe v-if="src" :src="src" class="fit" style="border: 0"></iframe>
  </q-page>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';

export default {
  name: '',
  mixins: [MixinCommon],
  data() {
    return {};
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
      return {
        height: `${height - offset}px`,
      };
    },
  },
  mounted() {},
};
</script>

<style></style>
