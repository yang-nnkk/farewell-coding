import request from "@/utils/request.ts";
import type { MenuListResponseData, MenuItem } from "./type";

enum API {
    // 获取菜单列表
    GET_MENU_LIST = "/admin/acl/permission",
    // 删除菜单接口
    DELETE_MENU = "/admin/acl/permission/remove",
    // 新增菜单接口， post
    ADD_MENU = "/admin/acl/permission/save",
    // 更新菜单接口， put
    UPDATE_MENU = "/admin/acl/permission/update",
}

// 获取菜单列表
export const reqMenuList = () => request.get<any, MenuListResponseData>(API.GET_MENU_LIST);

// 删除菜单接口
export const reqDeleteMenu = (id: number) => request.delete<any, any>(`${API.DELETE_MENU}/${id}`);

// 新增或更新菜单接口
export const reqAddOrUpdateMenu = (menu: MenuItem) => {
    if (menu.id) {
        return request.put<any, any>(API.UPDATE_MENU, menu);
    } else {
        return request.post<any, any>(API.ADD_MENU, menu);
    }
};
