// 商品品牌管理模块接口地址

import request from '@/utils/request';
import type { BrandmarkResponseData, Brand, AddOrUpdateBrandResponse, DeleteBrandResponseDataForm } from './type.ts';

enum API {
    BRANDMAR_URL = '/admin/product/baseTrademark/',
    ADDBRANDMARK_URL = '/admin/product/baseTrademark/save',
    UPDATABRANDMARK_URL = '/admin/product/baseTrademark/update',
    DELETEBRANDMARK_URL = '/admin/product/baseTrademark/remove',
}

// 获取已有品牌的接口方法
/**
 * page: 获取第几页， 默认1
 * limit： 显示页数
 */
export const reqHasBrandmark = (page: number, limit: number) =>
    request.get<any, BrandmarkResponseData>(API.BRANDMAR_URL + `${page}/${limit}`);

// 添加与修改品牌的接口
export const reqAddOrUpdateBrandmark = (data: Brand) => {
    // 如果有id表示修改品牌数据
    if (data.id) {
        return request.put<any, AddOrUpdateBrandResponse>(API.UPDATABRANDMARK_URL, data);
    }
    // 如果没有id表示新增品牌
    else {
        return request.post<any, AddOrUpdateBrandResponse>(API.ADDBRANDMARK_URL, data);
    }
};

// 删除品牌的接口
export const reqDeleteBrandmark = (data: number) =>
    request.delete<any, DeleteBrandResponseDataForm>(`${API.DELETEBRANDMARK_URL}/${data}`);
