// 用户列表
const userList = [
    {
        userID: 1,
        avatar: '/621fbff49639diYN.gif',
        username: 'admin',
        password: '123456',
        desc: '管理员',
        roles: ['admin'],
        buttons: ['add', 'edit', 'delete'],
        routes: ['dashboard', 'user', 'permission'],
        token: 'mock-token-admin',
    },
    {
        userID: 2,
        avatar: 'https://i.pravatar.cc/150?img=2',
        username: 'editor',
        password: '123456',
        desc: '编辑',
        roles: ['editor'],
        buttons: ['add', 'edit'],
        routes: ['dashboard', 'user'],
        token: 'mock-token-editor',
    },
    {
        userID: 3,
        avatar: 'https://i.pravatar.cc/150?img=3',
        username: 'viewer',
        password: '123456',
        desc: '游客',
        roles: ['viewer'],
        buttons: [],
        routes: ['dashboard'],
        token: 'mock-token-viewer',
    },
];

export default [
    // 登录接口
    {
        url: '/api/admin/acl/index/login',
        method: 'post',
        response({ body }: { body: { username: string; password: string } }) {
            const { username, password } = body;

            const checkUser = userList.find((item) => item.username === username && item.password === password);

            if (!checkUser) {
                return { code: 201, data: { message: '账号或密码不正确' } };
            }

            const token = checkUser.token;
            return { code: 200, data: { token } };
        },
    },
    // 获取用户信息接口
    {
        url: '/api/admin/acl/index/info',
        method: 'get',
        response: (request: any) => {
            const token = request.headers.token;
            const checkUser = userList.find((item) => item.token === token);

            if (!checkUser) {
                return { code: 201, data: { message: '获取用户信息失败' } };
            }

            return {
                code: 200,
                data: {
                    checkUser,
                },
            };
        },
    },
    // 退出登录接口
    {
        url: '/api/admin/acl/index/logout',
        method: 'post',
        response: () => {
            return { code: 200, data: { message: '退出成功' } };
        },
    },
];
