import type { BASE_DATA } from "@/api/acl/baseType.ts";

// 菜单列表项
export interface MenuItem {
    createTime?: string;
    updateTime?: string;
    id?: number;
    name: string;
    pid: number;
    code: string;
    toCode?: string;
    type?: number;
    status?: number;
    level: number;
    children?: MenuItem[];
    selected?: boolean;
}

// 菜单列表响应数据
export interface MenuListResponseData extends BASE_DATA {
    data: [MenuItem];
}
