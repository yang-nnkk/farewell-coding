// 创建用户相关的小仓库

import { defineStore } from "pinia";
import type { UserState } from "./type/type.ts";
import { SET_TOKEN, REMOVE_TOKEN } from "@/utils/token.ts";
import { asyncRoutes, constantRoutes, notFoundRoute, resetRouter } from "@/router/routes.ts";
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user/index.ts";
// 引入用户接口返回的相关数据类型
import type { loginResponseData, userInfoResponseData, loginFormData } from "@/api/user/type.ts";

const useUserStore = defineStore("User", {
    // 数据
    state: (): UserState => {
        return {
            token: localStorage.getItem("token"),
            menuRoutes: [], // 菜单路由数据，后续会根据用户权限进行过滤
            username: "",
            avatar: "",
            buttons: [],
        };
    },

    // 异步 | 逻辑
    actions: {
        // 用户登录
        async userLogin(data: loginFormData) {
            const response: loginResponseData = await reqLogin(data);

            const code = response.code;
            const response_data = response.data;
            // code 为 200 说明正确
            if (code === 200) {
                // 仓库存储
                this.token = response_data;
                // 本地存储
                SET_TOKEN(response_data);
                return true;
            } else {
                return Promise.reject("用户名或密码错误");
            }
        },

        // 获取用户信息
        async getUserInfo() {
            const response: userInfoResponseData = await reqUserInfo();
            // 根据用户信息对异步路由进行过滤，常量路由和404路由不需要过滤
            const userAsyncRoutes = resetRouter(asyncRoutes, (response.data.routes ?? []) as string[]);
            this.menuRoutes = [...constantRoutes, ...userAsyncRoutes, ...notFoundRoute];

            if (response.code === 200) {
                this.username = response.data.name;
                this.avatar = response.data.avatar;
                this.buttons = response.data.buttons ?? [];
                return true;
            } else {
                return Promise.reject(new Error(response.message));
            }
        },

        // 用户退出登录
        async userLogout() {
            // 先清除本地数据，无论 API 调用是否成功
            this.username = "";
            this.token = "";
            this.avatar = "";
            this.buttons = [];
            REMOVE_TOKEN();

            // 异步调用后端 API（不阻塞跳转）
            reqLogout().catch(() => {
                // API 调用失败也不影响退出登录
            });
        },
    },

    // getter
    getters: {},
});

export default useUserStore;
