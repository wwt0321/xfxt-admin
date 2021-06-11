import { MixinRequest } from './MixinRequest';
import { MixinTokenAdmin } from './MixinTokenAdmin';
import { MixinUtils } from './MixinUtils';
import { date } from 'quasar';

export const MixinCommon = {
  mixins: [MixinRequest, MixinTokenAdmin, MixinUtils],
  computed: {
    dicts() {
      return this.$store.state.dicts;
    },
    configs() {
      return this.$store.state.configs;
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
  },
};
