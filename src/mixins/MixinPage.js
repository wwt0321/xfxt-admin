import { MixinUtils } from './MixinUtils';
import { MixinCommon } from './MixinCommon';

export const MixinPage = {
  mixins: [MixinUtils, MixinCommon],
  data() {
    return {
      isShow: {
        help: false,
      },
    };
  },
};
