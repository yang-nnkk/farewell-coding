// 角色接口相关数据类型
import type { BASE_DATA } from "../baseType.ts";

// 角色数据类型
export interface RoleData {
    id?: number;
    roleName: string;
    remark: string;
    createTime?: string;
    updateTime?: string;
}

// 获取角色列表接口返回数据类型
export interface GetRoleListResponseData extends BASE_DATA {
    data: {
        records: RoleData[];
        total: number;
        size: number;
        current: number;
        pages: number;
        searchCount: boolean;
    };
}

export interface PermissionData {
    createTime: string;
    updateTime: string;
    id: number;
    name: string;
    pid: number;
    code: string;
    toCode: string;
    type: number;
    status: number;
    level: number;
    children?: PermissionData[];
    select: boolean; // 是否被选中，表示该权限是否已经分配给当前角色
}

export interface GetRolePermissionResponseData extends BASE_DATA {
    data: PermissionData[];
}
