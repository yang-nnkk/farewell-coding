import request from "@/utils/request";
import type { UserInfoResponse, AddUserDataForm, AllRolesResponse, setRoleData } from "./type.ts";

enum API {
    // 获取全部已有的账户信息
    ALLUSERINFO_URL = "/admin/acl/user",
    // 添加新用户
    ADDUER_URL = "/admin/acl/user/save",
    // 修改用户信息
    EDITUSER_URL = "/admin/acl/user/update",
    // 删除一个用户接口
    DELETESINGLEUSER_URL = "/admin/acl/user/remove",
    // 批量删除账号
    DELETEMULTIPLEUSER_URL = "/admin/acl/user/batchRemove",
    // 为用户分配角色接口
    ALLOCATEROLE_URL = "/admin/acl/user/doAssignRole",
    // 获取所有、当前用户拥有的角色列表接口
    ALLROLE_URL = "/admin/acl/user/toAssign",
}

// 获取用户分页列表
export const reqUserInfo = (page: number, limit: number, username?: string) =>
    request.get<any, UserInfoResponse>(`${API.ALLUSERINFO_URL}/${page}/${limit}`, { params: { username } });

// 新增用户信息
export const reqAddOrEditUser = (userInfo: AddUserDataForm) => {
    if (userInfo.id) {
        // 有id说明不是新增用户
        return request.put<any, any>(API.EDITUSER_URL, userInfo);
    } else {
        return request.post<any, any>(API.ADDUER_URL, userInfo);
    }
};

// 删除用户
export const reqDeleteUser = (userIdList: number[]) => {
    if (userIdList.length === 1) {
        return request.delete<any, any>(`${API.DELETESINGLEUSER_URL}/${userIdList[0]}`);
    } else {
        return request.delete<any, any>(API.DELETEMULTIPLEUSER_URL, { data: userIdList });
    }
};

// 分配用户角色
export const reqSetRole = (setRoleData: setRoleData) => request.post<any, any>(API.ALLOCATEROLE_URL, setRoleData);

// 获取当前用户拥有的角色列表
export const reqAllRole = (userId: number | string) =>
    request.get<any, AllRolesResponse>(`${API.ALLROLE_URL}/${userId}`);
