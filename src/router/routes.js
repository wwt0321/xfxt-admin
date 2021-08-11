import { helperGuard } from '../mixins/MixinTokenAdmin.js';

const routes = [
  {
    path: '/login',
    component: () => import('pages/PageLogin.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/LayoutAdminFlat.vue'),
    children: [
      // 管理端自带功能
      { path: '/iframe/:url', component: () => import('pages/PageIframe.vue') },
      { path: '/metabase/:url', component: () => import('pages/PageMetabase.vue') },
      { path: '/password', component: () => import('pages/PagePassword.vue') },
      { path: '/admin', component: () => import('pages/PageAdmin.vue') },
      { path: '/code', component: () => import('pages/PageCode.vue') },
      { path: '/authority', component: () => import('pages/PageAuthority.vue') },
      { path: '/function', component: () => import('pages/PageFunction.vue') },
      // @TODO 默认路径
      // {
      //   path: '',
      //   redirect: '/metabase/',
      // },

      //消费系统
      {
        path: '/home',
        component: () => import('src/pages/PageHome.vue'),
      },
      {
        path: '/person',
        component: () => import('src/pages/PagePerson.vue'),
      },
      {
        path: '/role',
        component: () => import('src/pages/PageRole.vue'),
      },
      {
        path: '/shop',
        component: () => import('src/pages/PageShop.vue'),
      },
      {
        path: '/subsidy',
        component: () => import('src/pages/PageSubsidy.vue'),
      },
      {
        path: '/record',
        component: () => import('src/pages/PageRecord.vue'),
      },
      {
        path: '/statistical',
        component: () => import('src/pages/PageStatistical.vue'),
      },
    ],
    beforeEnter: helperGuard,
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
