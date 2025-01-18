const routes = [
  {
    path: "/dashboard",
    component: () => import("/src/layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("src/pages/main/IndexPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/AllDevices",
        name: "AllDevices",
        component: () => import("src/pages/main/AllDevice.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/detail_device",
        name: "detail_device",
        component: () => import("src/pages/main/DeviceDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/Device01",
        name: "Device01",
        component: () => import("src/pages/main/DeviceN01.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/Device02",
        name: "Device02",
        component: () => import("src/pages/main/DeviceN02.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/DevicesHistory",
        name: "DevicesHistory",
        component: () => import("src/pages/main/DevicesHistory.vue"),
        meta: { requiresAuth: true },
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
