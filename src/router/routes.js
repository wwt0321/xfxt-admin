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
      { path: '', component: () => import('pages/PageIndex.vue') },
      { path: '/dashboard', component: () => import('pages/PageIndex.vue') },
      { path: '/iframe/:url', component: () => import('pages/PageIframe.vue') },
      { path: '/metabase/:url', component: () => import('pages/PageMetabase.vue') },
    ],
    // beforeEnter: helperGuard,
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
