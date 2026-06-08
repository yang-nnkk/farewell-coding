// 导入request对象
import request from "@/utils/request.ts";
// 导入相关数据类型
import type { GetRoleListResponseData, GetRolePermissionResponseData, RoleData } from "./type";

enum API {
    // 获取角色列表
    GET_ROLE_LIST = "/admin/acl/role",
    // 新增角色
    ADD_ROLE_URL = "/admin/acl/role/save",
    // 获取角色权限列表（带 select 字段标识已分配的权限）
    GET_ROLE_PERMISSION_URL = "/admin/acl/permission/toAssign",
    // 角色新增权限接口
    ADD_ROLE_PERMISSION_URL = "/admin/acl/permission/doAssign",
    // 更新角色信息接口
    UPDATE_ROLE_INFO_URL = "/admin/acl/role/update",
    //  删除角色接口
    DELETE_ROLE_URL = "/admin/acl/role/remove",
}

// 获取角色列表或者者搜索角色列表接口
export const reqGetRoleList = (page: number, limit: number, roleName?: string) => {
    if (roleName) {
        return request.get<any, GetRoleListResponseData>(`${API.GET_ROLE_LIST}/${page}/${limit}`, {
            params: { roleName },
        });
    }
    return request.get<any, GetRoleListResponseData>(`${API.GET_ROLE_LIST}/${page}/${limit}`);
};

// 新增角色接口
export const reqAddRole = (roleData: RoleData) => {
    return request.post<any, any>(API.ADD_ROLE_URL, roleData);
};

// 获取指定角色的权限列表接口（传入 roleId 获取该角色的权限树，select 字段标识是否已分配）
export const reqGetRolePermission = (roleId: number) =>
    request.get<any, GetRolePermissionResponseData>(`${API.GET_ROLE_PERMISSION_URL}/${roleId}`);

// 角色新增权限接口
export const reqAssignRolePermission = (roleId: number, permissionId: number[]) => {
    return request.post<any, any>(API.ADD_ROLE_PERMISSION_URL, null, {
        params: { roleId, permissionId: permissionId.join(",") },
    });
};

// 更新角色的信息接口
export const reqUpdateRoleInfo = (roleInfo: RoleData) => request.put<any, any>(API.UPDATE_ROLE_INFO_URL, roleInfo);

// 删除角色的接口
export const reqDelteRole = (id: number) => request.delete<any, any>(`${API.DELETE_ROLE_URL}/${id}`);
