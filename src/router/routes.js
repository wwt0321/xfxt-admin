import { helperGuard } from '../mixins/MixinTokenAdmin.js';

const routes = [
  {
    path: '/login',
    component: () => import('pages/PageLogin.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/LayoutAdmin.vue'),
    children: [
      // 管理端自带功能
      { path: '/iframe/:url', component: () => import('pages/PageIframe.vue') },
      { path: '/metabase/:url', component: () => import('pages/PageMetabase.vue') },
      { path: '/password', component: () => import('pages/PagePassword.vue') },
      { path: '/admin', component: () => import('pages/PageAdmin.vue') },

      // @TODO 默认路径
      // {
      //   path: '',
      //   redirect: '/metabase/',
      // },
    ],
    beforeEnter: helperGuard,
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
