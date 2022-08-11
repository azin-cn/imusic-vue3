import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const Recom = () => import("@/views/recom.vue");
const Search = () => import("@/views/search.vue");
const Singer = () => import("@/views/singer.vue");
const Top = () => import("@/views/top.vue");

// 其他页面
const SingerDetail = () => import("@/views/singer-detail.vue");

const routes = [
  {
    path: "/",
    redirect: "/recom",
  },
  {
    path: "/recom",
    component: Recom,
  },
  {
    path: "/search",
    component: Search,
  },
  {
    path: "/singer",
    component: Singer,
    children: [
      {
        path: ":id",
        component: SingerDetail,
      },
    ],
  },
  {
    path: "/top",
    component: Top,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
