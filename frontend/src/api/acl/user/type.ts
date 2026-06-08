// 定义acl相关的数据类型
import type { BASE_DATA } from '../baseType';

export interface User {
    roleName: string;
    phone: null;

    id?: number;
    name?: string;
    username: string;
    createTime?: string;
    updateTime?: string;
}

// 获取所有用户信息返回的数据类型
export interface UserInfoResponse extends BASE_DATA {
    data: {
        records: User[];
        total: number;
        size: number;
        current: number;
        pages: number;
    };
}

// 收集用户信息
export interface AddUserDataForm {
    id?: number | string;
    username: string;
    name: string;
    password: string;
}
// 分配角色时收集的数据类型
export interface AllocateRoleData {
    id: number | string;
    username: string;
}

// 代表一个职位的ts类型
export interface Role {
    id?: number | string,
    roleName: string,
    remark?: string,
    createTime?: string,
    updateTime?: string

}

// 获取当前用户拥有的角色列表返回的数据类型
export interface AllRolesResponse extends BASE_DATA {
    data: {
        allRolesList: Role[];
        assignRoles: Role[];
    };
}

// 为用户分配角色
export interface setRoleData {
    userId: number | string;
    roleIdList: number[];
}
