import Layout from "@/layout/index.vue";

// const routes = [
//     // 登录模块
//     {
//         path: "/login",
//         name: "login",
//         component: () => import("@/views/login/index.vue"),
//         meta: {
//             title: "登录",
//             hidden: true,
//         },
//     },

//     // 首页模块
//     {
//         path: "/",
//         name: "layout",
//         component: Layout,
//         meta: {
//             title: "layout",
//         },
//         redirect: "/home",
//         children: [
//             {
//                 path: "/home",
//                 name: "home",
//                 component: () => import("@/views/home/index.vue"),
//                 meta: {
//                     icon_path: "icon-shouye",
//                     title: "首页",
//                 },
//             },
//         ],
//     },
//     // 数据可视化模块
//     {
//         path: "/visualization",
//         name: "visualization",
//         component: () => import("@/views/visualization/index.vue"),
//         meta: {
//             icon_path: "icon-shujukeshihua",
//             title: "数据可视化",
//         },
//     },

//     // 权限管理模块
//     {
//         path: "/acl",
//         name: "acl",
//         component: Layout,
//         meta: {
//             icon_path: "icon-zhanghaoquanxianguanli",
//             title: "权限管理",
//         },
//         redirect: "/acl/user",
//         children: [
//             {
//                 path: "/acl/user",
//                 name: "acl_user",
//                 component: () => import("@/views/acl/user/index.vue"),
//                 meta: {
//                     icon_path: "icon-User",
//                     title: "用户管理",
//                 },
//             },
//             {
//                 path: "/acl/role",
//                 name: "acl_role",
//                 component: () => import("@/views/acl/role/index.vue"),
//                 meta: { icon_path: "icon-menu_role", title: "角色管理" },
//             },
//             {
//                 path: "/acl/permission",
//                 name: "acl_permission",
//                 component: () => import("@/views/acl/permission/index.vue"),
//                 meta: { icon_path: "icon-caidan", title: "菜单管理" },
//             },
//         ],
//     },

//     // 商品管理模块
//     {
//         path: "/product",
//         name: "product",
//         component: Layout,
//         meta: {
//             icon_path: "icon-shangpinguanli1",
//             title: "商品管理",
//         },
//         redirect: "/product/sku",
//         children: [
//             {
//                 path: "/product/sku",
//                 name: "product_sku",
//                 component: () => import("@/views/product/sku/index.vue"),
//                 meta: {
//                     icon_path: "icon-SKUguanli",
//                     title: "SKU管理",
//                 },
//             },
//             {
//                 path: "/product/spu",
//                 name: "product_spu",
//                 component: () => import("@/views/product/spu/index.vue"),
//                 meta: {
//                     icon_path: "icon-SKUguanli",
//                     title: "SPU管理",
//                 },
//             },
//             {
//                 path: "/product/brand",
//                 name: "product_brand",
//                 component: () => import("@/views/product/brand/index.vue"),
//                 meta: {
//                     icon_path: "icon-shangpinguanli",
//                     title: "品牌管理",
//                 },
//             },
//             {
//                 path: "/product/attr",
//                 name: "product_attr",
//                 component: () => import("@/views/product/attr/index.vue"),
//                 meta: {
//                     icon_path: "icon-goujianshuxingguanli",
//                     title: "属性管理",
//                 },
//             },
//         ],
//     },

//     // 一下是一些特殊路由，放在最后面
//     {
//         path: "/not_found",
//         name: "NotFound",
//         component: () => import("@/views/notFound/index.vue"),
//         meta: {
//             title: "页面未找到",
//             hidden: true,
//         },
//     },
//     {
//         path: "/:pathMatch(.*)*",
//         redirect: "/not_found",
//         name: "any",
//         meta: {
//             title: "任意路径",
//             hidden: true,
//         },
//     },
// ];

// 常量路由
const constantRoutes = [
    // 登录模块
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/login/index.vue"),
        meta: {
            title: "登录",
            hidden: true,
        },
    },

    // 首页模块
    {
        path: "/",
        name: "layout",
        component: Layout,
        meta: {
            title: "layout",
        },
        redirect: "/home",
        children: [
            {
                path: "/home",
                name: "home",
                component: () => import("@/views/home/index.vue"),
                meta: {
                    icon_path: "icon-shouye",
                    title: "首页",
                },
            },
        ],
    },
    // 数据可视化模块
    {
        path: "/visualization",
        name: "visualization",
        component: () => import("@/views/visualization/index.vue"),
        meta: {
            icon_path: "icon-shujukeshihua",
            title: "数据可视化",
        },
    },
];

// 异步路由
const asyncRoutes = [
    // 权限管理模块
    {
        path: "/acl",
        name: "Acl",
        component: Layout,
        meta: {
            icon_path: "icon-zhanghaoquanxianguanli",
            title: "权限管理",
        },
        redirect: "/acl/user",
        children: [
            {
                path: "/acl/user",
                name: "User",
                component: () => import("@/views/acl/user/index.vue"),
                meta: {
                    icon_path: "icon-User",
                    title: "用户管理",
                },
            },
            {
                path: "/acl/role",
                name: "Role",
                component: () => import("@/views/acl/role/index.vue"),
                meta: { icon_path: "icon-menu_role", title: "角色管理" },
            },
            {
                path: "/acl/permission",
                name: "Permission",
                component: () => import("@/views/acl/permission/index.vue"),
                meta: { icon_path: "icon-caidan", title: "菜单管理" },
            },
        ],
    },

    // 商品管理模块
    {
        path: "/product",
        name: "Product",
        component: Layout,
        meta: {
            icon_path: "icon-shangpinguanli1",
            title: "商品管理",
        },
        redirect: "/product/sku",
        children: [
            {
                path: "/product/sku",
                name: "Sku",
                component: () => import("@/views/product/sku/index.vue"),
                meta: {
                    icon_path: "icon-SKUguanli",
                    title: "SKU管理",
                },
            },
            {
                path: "/product/spu",
                name: "Spu",
                component: () => import("@/views/product/spu/index.vue"),
                meta: {
                    icon_path: "icon-SKUguanli",
                    title: "SPU管理",
                },
            },
            {
                path: "/product/brand",
                name: "Trademark",
                component: () => import("@/views/product/brand/index.vue"),
                meta: {
                    icon_path: "icon-shangpinguanli",
                    title: "品牌管理",
                },
            },
            {
                path: "/product/attr",
                name: "Attr",
                component: () => import("@/views/product/attr/index.vue"),
                meta: {
                    icon_path: "icon-goujianshuxingguanli",
                    title: "属性管理",
                },
            },
        ],
    },
];

// 404 路由
const notFoundRoute = [
    // 一下是一些特殊路由，放在最后面
    {
        path: "/not_found",
        name: "NotFound",
        component: () => import("@/views/notFound/index.vue"),
        meta: {
            title: "页面未找到",
            hidden: true,
        },
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/not_found",
        name: "any",
        meta: {
            title: "任意路径",
            hidden: true,
        },
    },
];

export function resetRouter(asyncRoutes: any[], targetRouter: any[]): any[] {
    // 根据用户拥有的路由名称，递归过滤异步路由表
    return asyncRoutes.reduce((acc: any[], route) => {
        // 递归过滤子路由
        const filteredChildren = route.children?.length ? resetRouter(route.children, targetRouter) : [];
        // 当前路由 name 在目标列表中，或者有匹配的子路由，就保留
        if (targetRouter.includes(route.name) || filteredChildren.length > 0) {
            acc.push({ ...route, children: filteredChildren.length ? filteredChildren : undefined });
        }
        return acc;
    }, []);
}

export { constantRoutes, asyncRoutes, notFoundRoute };
