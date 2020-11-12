import { MixinRequest } from './MixinRequest';
import { MixinTokenAdmin } from './MixinTokenAdmin';

export const MixinCommon = {
  mixins: [MixinRequest, MixinTokenAdmin],
  computed: {
    config() {
      return this.$q.localStorage.getItem('config') || {};
    },
  },
};
