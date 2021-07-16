<template>
  <q-td style="width: 80px;">
    <q-badge
      outline
      color="primary"
      style="font-family: roboto mono; cursor: pointer"
      @click="copy"
      class="text-uppercase"
    >
      {{ shorted }}
      <q-tooltip color="primary" anchor="center right" self="center left" :offset="[0, 0]">
        <span class="text-uppercase">
          {{ value }}
        </span>
      </q-tooltip>
    </q-badge>
  </q-td>
</template>

<script>
import { copyToClipboard } from 'quasar';

export default {
  name: 'ComponentCellUUID',
  props: {
    value: String,
  },
  computed: {
    shorted() {
      return [this.value.substring(0, 4), this.value.substring(32, 36)].join('****');
    },
  },
  methods: {
    copy() {
      copyToClipboard(this.value).then(() => {
        this.$q.notify({
          color: 'green',
          position: 'top',
          message: '已复制到剪贴板',
          timeout: 2000,
        });
      });
    },
  },
  created() {},
  mounted() {},
};
</script>
