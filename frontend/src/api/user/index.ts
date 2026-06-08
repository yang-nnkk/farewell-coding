// 统一管理用户相关的 API 请求
import request from '@/utils/request';
import type { loginFormData, loginResponseData, userInfoResponseData } from './type';

// 系统中用户相关的接口

enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout',
}

// 登录请求接口
// 泛型第二个参数是约束返回的数据类型
export const reqLogin = (data: loginFormData) => request.post<any, loginResponseData>(API.LOGIN_URL, data);

// 获取用户信息接口
export const reqUserInfo = () => request.get<any, userInfoResponseData>(API.USERINFO_URL);

// 用户退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);
