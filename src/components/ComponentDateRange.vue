<template>
  <q-input outlined dense :value="range && `${range.from} — ${range.to}`" style="width: 220px;" readonly>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy">
          <q-date v-model="dateRange" range mask="YYYY-MM-DD" @input="updateValue" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';

const alwaysRange = (dateRange) => {
  if (typeof dateRange == 'string') {
    return { from: dateRange, to: dateRange };
  }
  return dateRange;
};

export default {
  name: '',
  mixins: [MixinCommon],
  props: {
    value: Object,
  },
  data() {
    return {
      dateRange: {
        from: '',
        to: '',
      },
    };
  },
  computed: {
    range() {
      return alwaysRange(this.dateRange);
    },
  },
  watch: {
    value: function(nv, ov) {
      if (nv != ov) {
        this.dateRange = nv;
      }
    },
  },
  methods: {
    updateValue(val) {
      this.$emit('input', alwaysRange(val));
    },
  },
  created() {
    this.dateRange = this.value;
  },
  mounted() {},
};
</script>

<style></style>
