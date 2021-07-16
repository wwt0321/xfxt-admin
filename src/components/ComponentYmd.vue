<template>
  <q-input
    v-bind="$attrs"
    v-on="listeners"
    type="text"
    mask="####-##-##"
    placeholder="年-月-日(月日可选填)"
    v-model="ymd"
    @input="input"
    :rules="[validate || '日期错误']"
  />
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';
import { dateRangeYmd, validateYmd } from '../js/date';

export default {
  name: 'ComponentYmd',
  mixins: [MixinCommon],
  data() {
    return {
      ymd: '',
      listeners: {},
    };
  },
  props: ['value'],
  methods: {
    validate(v) {
      if (!v) {
        return true;
      }
      return validateYmd(...v.split('-'));
    },
    input(v) {
      console.log('input');
      this.$emit('input', [this.ymd, ...dateRangeYmd(v)]);
    },
  },
  mounted() {
    const { input, ...listeners } = this.$listeners;
    this.listeners = listeners;
    this.ymd = this.value[0];
  },
};
</script>

<style></style>
