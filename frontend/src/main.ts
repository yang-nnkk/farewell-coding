import { createApp } from "vue";
import pinia from "@/stores/index.ts";
import "@/styles/global.css";
// 引入路由鉴权
import "@/permission.ts";

import router from "@/router";
import App from "@/App.vue";
import { useThemeStore } from "@/stores/layoutStore/useThemeStore";

const app = createApp(App);

app.use(pinia);
app.use(router);

// 导入element-plus样式
import "element-plus/dist/index.css";

// DataV 延迟加载（不阻塞首屏渲染）
import("@kjgl77/datav-vue3").then((mod: any) => {
    app.use(mod.default);
});

// 初始化主题
const themeStore = useThemeStore();
themeStore.initSystemListener();

app.mount("#app");
