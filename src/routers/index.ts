import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "homePage",
    component: () => import("@/pages/home/index.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("@/pages/calendar/index.vue"),
    redirect: "/calendar/home",
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/pages/calendar/home/index.vue"),
        meta: {
          title: "日历视角",
        },
      },
      {
        path: "quadrant",
        name: "quadrant",
        component: import("@/pages/calendar/quadrant/index.vue"),
        meta: {
          title: "时间四象限",
        },
      },
      {
        path: "todoBox",
        name: "todoBox",
        component: import("@/pages/calendar/todoBox/index.vue"),
        meta: {
          title: "任务箱",
        },
      },
    ],
  },
  {
    path: "/setting",
    name: "setting",
    component: () => import("@/pages/setting/index.vue"),
    meta: {
      title: "设置",
    },
  },
  // 不识别的路由自动跳 home 页
  {
    path: "/:catchAll(.*)",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  routes,
});

export default router;
