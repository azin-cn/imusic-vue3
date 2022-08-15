import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const Recom = () => import("@/views/recom.vue");
const Search = () => import("@/views/search.vue");
const Singer = () => import("@/views/singer.vue");
const Top = () => import("@/views/top.vue");

// 其他页面
const SingerDetail = () => import("@/views/singer-detail.vue");
const RecomAlbum = () => import("@/views/recom-album.vue");
const TopDetail = () => import("@/views/top-detail");

const routes = [
  {
    path: "/",
    redirect: "/recom",
  },
  {
    path: "/recom",
    component: Recom,
    children: [
      {
        path: ":id",
        component: RecomAlbum,
      },
    ],
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
    children: [
      {
        path: ":id",
        component: TopDetail,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
