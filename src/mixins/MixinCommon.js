import { MixinRequest } from './MixinRequest';
import { MixinTokenAdmin } from './MixinTokenAdmin';
import { MixinUtils } from './MixinUtils';
import { date } from 'quasar';

export const MixinCommon = {
  mixins: [MixinRequest, MixinTokenAdmin, MixinUtils],
  computed: {
    configs() {
      return this.$store.state.configs;
    },
    dicts() {
      return this.$store.state.dicts;
    },
    enums() {
      return this.$store.state.enums;
    },
    defaults() {
      return {
        date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        ym: date.formatDate(new Date(), 'YYYY-MM'),
        fdom: date.formatDate(new Date(), 'YYYY-MM-01'),
        ldom: date.formatDate(
          date.addToDate(date.formatDate(new Date(), 'YYYY-MM-01'), { month: 1, days: -1 }),
          'YYYY-MM-DD',
        ),
        now: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      };
    },
    attrs() {
      return {
        formField: {
          outlined: true,
          stackLabel: true,
          dense: true,
          hideBottomSpace: true,
          class: 'q-my-sm',
        },
        formFieldSelect: {
          outlined: true,
          stackLabel: true,
          dense: true,
          hideBottomSpace: true,
          class: 'q-my-sm',
          mapOptions: true,
          emitValue: true,
          clearable: true,
        },
        filterField: {
          outlined: true,
          stackLabel: true,
          dense: true,
          hideBottomSpace: true,
          clearable: true,
        },
        filterFieldSelect: {
          outlined: true,
          stackLabel: true,
          dense: true,
          hideBottomSpace: true,
          mapOptions: true,
          emitValue: true,
        },
      };
    },
  },
};
