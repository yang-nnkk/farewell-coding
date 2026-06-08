import axios from 'axios';
import { ElMessage } from 'element-plus';
import useUserStore from '@/stores/modules/user';
import router from '@/router';

// 创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 50000,
});

// 定义request拦截器
request.interceptors.request.use((config) => {
    // 使用仓库
    const userStore = useUserStore();
    // 获取token
    const token = userStore.token;
    if (token) {
        config.headers.token = token;
    }
    return config;
});

// 定义响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (err) => {
        let msg = '请求失败';
        if (err && err.response) {
            const status_code = err.response.status;
            switch (status_code) {
                case 400:
                    msg = '请求参数错误';
                    break;
                case 401:
                    msg = '登录已过期，请重新登录';
                    // 清除 token 并跳转登录页
                    const userStore = useUserStore();
                    userStore.userLogout();
                    router.push('/login');
                    ElMessage({ type: 'error', message: msg });
                    return Promise.reject(msg);
                case 403:
                    msg = '没有权限访问资源';
                    break;
                case 404:
                    msg = '请求地址不存在';
                    break;
                case 500:
                    msg = '服务器内部错误';
                    break;
                default:
                    msg = err.response.data?.message || `请求错误：${status_code}`;
            }
        } else {
            msg = err.message || '网络连接失败';
        }
        return Promise.reject(msg);
    }
);

export default request;
