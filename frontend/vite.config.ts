import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
// Element Plus 解析器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import { viteMockServe } from 'vite-plugin-mock';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    // 获取相对应的环境
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver({ importStyle: 'css' })],
            }),
            command === 'serve' && vueDevTools(),
            viteMockServe({
                mockPath: 'src/mock', // 存放 mock 接口的文件夹（当前在 src/mock）
                enable: false, // 关闭 mock，使用真实后端
            }),
        ].filter(Boolean),
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/variable.scss" as *;`,
                },
            },
        },
        server: {
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    // 获取数据的服务器地址
                    target: env.VITE_SERVER,
                    // 是否开启代理
                    changeOrigin: true,
                    // 路径重写, 因为真实的服务器前缀没有/api， 所以替换掉
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    };
});
