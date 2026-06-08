// 属性管理接口
import request from '@/utils/request';
import type { CategoryResponseData, AttrAndValueResponseDataForm, AttrAndValueDataForm } from './type';

enum API {
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    // 获取已有的属性与属性值
    ATTRANDVALUE_RUL = '/admin/product/attrInfoList/',
    // 新增或者修改属性
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    DELETEATTR_URL = '/admin/product/deleteAttr/',
}

// 获取一级分类的接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);
// 获取二级分类的接口
export const reqC2 = (id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + `${id}`);
// 获取三级分类的接口
export const reqC3 = (id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + `${id}`);

// 获取分离下已有属性与属性值
export const reqAttrAndValue = (c1id: number | string, c2id: number | string, c3id: number | string) =>
    request.get<any, AttrAndValueResponseDataForm>(`${API.ATTRANDVALUE_RUL}${c1id}/${c2id}/${c3id}`);

// 新增属性或者修改属性
export const reqAddorUpdateAttr = (data: AttrAndValueDataForm) => request.post<any, any>(API.ADDORUPDATEATTR_URL, data);

// 删除已有属性
export const reqDeleteAttr = (attrId: number) => request.delete<any, any>(`${API.DELETEATTR_URL}${attrId}`);
