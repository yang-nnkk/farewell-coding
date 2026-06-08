import { createRouter, createWebHistory } from "vue-router";
import { constantRoutes, notFoundRoute, asyncRoutes } from "./routes";

const router = createRouter({
    history: createWebHistory(),
    routes: [...constantRoutes, ...asyncRoutes, ...notFoundRoute],
});

export default router;
