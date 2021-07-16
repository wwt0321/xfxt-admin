<template>
  <div class="flex">
    <q-btn icon="arrow_left" flat padding="none" @click="prev" />
    <q-input outlined dense :value="month" readonly mask="####-##" style="width: 120px;">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="monthPicker">
            <q-date minimal default-view="Years" v-model="date" mask="YYYY-MM" @input="updateValue" emit-immediately />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-btn icon="arrow_right" flat padding="none" @click="next" />
  </div>
</template>

<script>
import { MixinCommon } from '../mixins/MixinCommon';
import { date } from 'quasar';

const month = (date) => {
  return date.substring(0, 7);
};

export default {
  name: '',
  mixins: [MixinCommon],
  props: {
    value: '',
  },
  data() {
    return {
      date: '',
    };
  },
  computed: {
    month() {
      return month(this.date);
    },
  },
  watch: {
    value: function(nv, ov) {
      if (nv != ov) {
        this.date = nv;
      }
    },
  },
  methods: {
    updateValue(val, reason) {
      console.log(arguments);
      if (reason == 'month') {
        this.$refs.monthPicker.hide();
        this.$emit('input', month(val));
      }
    },
    prev() {
      this.date = date.formatDate(date.subtractFromDate(this.date, { month: 1 }), 'YYYY-MM-DD');
    },
    next() {
      this.date = date.formatDate(date.addToDate(this.date, { month: 1 }), 'YYYY-MM-DD');
      console.log(this.date);
    },
  },
  created() {
    this.date = this.value + '-01';
  },
  mounted() {},
};
</script>

<style></style>
