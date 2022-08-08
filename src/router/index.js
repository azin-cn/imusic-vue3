import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const Recom = () => import("@/views/recom.vue");
const Search = () => import("@/views/search.vue");
const Singer = () => import("@/views/singer.vue");
const Top = () => import("@/views/top.vue");

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
