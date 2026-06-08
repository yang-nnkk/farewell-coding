// 定义用户相关的类型

// 用户登录接口携带的参数
export interface loginFormData {
    username: string;
    password: string;
}

interface responseBaseData {
    code: number;
    message: string;
    ok: boolean;
}

// 用户登录接口返回的数据
export interface loginResponseData extends responseBaseData {
    data: string;
}

// 请求用户数返回的数据类型
export interface userInfoResponseData extends responseBaseData {
    data: { routes: string[]; buttons: string[]; roles: string[]; name: string; avatar: string };
}
