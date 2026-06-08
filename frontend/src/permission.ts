// 路由鉴权---> 规定项目中的某一个路由什么条件下可以访问/不可以访问
import router from "@/router/index";
import pinia from "@/stores";
import useUserStore from "@/stores/modules/user";
import settings from "@/settings";
import { GET_TOKEN, REMOVE_TOKEN } from "@/utils/token.ts";

// 获取仓库内部的 token 数据用来判断用户是否登录
const userStore = useUserStore(pinia);

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    // to: 目标路由， from: 源路由， next: 放行函数

    document.title = settings.webTitle + "-" + to.meta.title;
    const token = userStore.token;
    const local_token = GET_TOKEN();
    // 判断是否登录
    if (token && token === local_token) {
        const username = userStore.username;
        const local_token = GET_TOKEN();
        // 获取用户信息相关
        if (to.path === "/login") {
            next({ path: "/home" });
        }
        // 登录了，但是访问的不是login而是其他页面
        else {
            // 此时需要获取用户的username、avatar
            if (username) {
                next();
            } else {
                try {
                    await userStore.getUserInfo();
                    next();
                } catch {
                    // 说明获取不到用户信息， token可能过期或无效
                    // 直接清除本地 token 并跳转到登录页
                    userStore.token = "";
                    userStore.username = "";
                    userStore.avatar = "";
                    REMOVE_TOKEN();
                    next({ path: "/login" });
                }
            }
        }
    } else {
        if (to.path === "/login") {
            next();
        } else {
            next({ path: "/login" });
        }
    }
});

// 全局后置守卫
router.afterEach((to, from) => {});

// 路由鉴权
// 全部路由组件： 404、首页、权限管理(3)、商品管理(4)、登录页、任意路由、数据可视化页
// 用户未登录可以方位 登录页login， 其余路由页面均不可以访问
// 用户登录成功，不可以访问login， 指向首页， 其余根据用户路由权限决定是否可以访问
