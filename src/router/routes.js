const routes = [
  {
    path: "/dashboard",
    component: () => import("/src/layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("src/pages/main/IndexPage.vue"),
      },
      {
        path: "/AllDevices",
        name: "AllDevices",
        component: () => import("src/pages/main/AllDevice.vue"),
      },
      {
        path: "/detail_device",
        name: "detail_device",
        component: () => import("src/pages/main/DeviceDetail.vue"),
      },
      {
        path: "/SeeAll",
        name: "SeeAll",
        component: () => import("src/pages/main/SeeAll.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("/src/layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        name: "login",
        component: () => import("src/pages/access/LoginPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
