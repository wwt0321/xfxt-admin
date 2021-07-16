<template>
  <q-select v-bind="$attrs" v-on="$listeners" :options="filteredOptions" @filter="filter" use-input />
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';

export default {
  name: 'ComponentCombobox',
  mixins: [MixinCommon],
  data() {
    return {
      filteredOptions: [],
    };
  },

  methods: {
    filter(val, update, abort) {
      const options = this.$attrs.options;
      console.log(options);
      if (!options) return abort();

      update(() => {
        if (!val) {
          this.filteredOptions = options;
          return;
        }

        const filterFn = this.$attrs.emitValue ? (v) => v.label.indexOf(val) >= 0 : (v) => v.indexOf(val) >= 0;

        this.filteredOptions = options.filter(filterFn);
      });
    },
  },
};
</script>
