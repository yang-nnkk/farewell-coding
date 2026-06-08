// 封装本地存储数据于读取数据的方法

export const SET_TOKEN = (token: string) => {
    localStorage.setItem('token', token);
};

export const GET_TOKEN = (): string | null => {
    return localStorage.getItem('token');
};

export const REMOVE_TOKEN = () => {
    localStorage.removeItem('token');
};
