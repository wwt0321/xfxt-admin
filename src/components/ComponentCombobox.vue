<template>
  <q-select v-bind="$attrs" v-on="$listeners" :options="filteredOptions" @filter="filter" use-input>
    <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          没有匹配的选项
        </q-item-section>
      </q-item>
    </template>
  </q-select>
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

        const filterFn = (v) =>
          v.label ? v.label.indexOf(val) >= 0 : v.name ? v.name.indexOf(val) >= 0 : v.indexOf(val) >= 0;

        this.filteredOptions = options.filter(filterFn);
      });
    },
  },

  mounted() {
    // 初始化过滤后的选项，否则当直接设置控件值时，会出现没有匹配项，直接显示 value 的情况
    this.filteredOptions = this.$attrs.options;
  },
};
</script>
