import { helperGuard } from '../mixins/MixinTokenWechat.js';

const guard = process.env.DEV
  ? helperGuard('wx2cdfbcfbc6d5a939', 'http://127.0.0.1:7001', 'customer')
  : helperGuard('wxb8914a29f4062f01', location.origin, 'customer');

const routes = [
  {
    path: '/auth/:code',
    component: () => import('pages/PageAuth.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/LayoutNone.vue'),
    children: [{ path: '', component: () => import('pages/PageIndex.vue') }],
    beforeEnter: guard,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
