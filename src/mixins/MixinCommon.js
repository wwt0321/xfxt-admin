import { MixinRequest } from './MixinRequest';
import { MixinTokenAdmin } from './MixinTokenAdmin';

export const MixinCommon = {
  mixins: [MixinRequest, MixinTokenAdmin],
  computed: {
    dicts() {
      return this.$store.state.dicts;
    },
    configs() {
      return this.$store.state.configs;
    },
  },
};
