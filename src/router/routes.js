const routes = [
  {
    path: "/",
    component: () => import("layouts/LayoutMain.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  // {
  //   path: '/',
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') }
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
