// sku相关的请求
import request from '@/utils/request';
import type { SkuInfoResponse, skuListResponse } from './type.ts';
import type { BASE_DATA } from '../baseType.ts';

enum API {
    // sku分页列表url
    SKUCATEGORYLIST_URL = '/admin/product/list',
    // 上架sku
    LISTINGSKU_URL = '/admin/product/onSale',
    // 下架sku
    DELISTINGSKU_URL = '/admin/product/cancelSale',
    // 获取Sku信息
    SKUINFO_RUL = '/admin/product/getSkuInfo',
    // 获取SKU的SPU图片
    SKUIMAGE_URL = '/admin/product/spuImageList',
    // 删除sku
    DELETESKU_URL = '/admin/product/deleteSku',
}

// 获取sku 分页列表
export const reqSkulist = (page: number, limit: number) =>
    request.get<any, skuListResponse>(`${API.SKUCATEGORYLIST_URL}/${page}/${limit}`);

// 上架sku
export const reqListingSku = (id: number) => request.get<any, BASE_DATA>(`${API.LISTINGSKU_URL}/${id}`);
// 下架sku
export const reqDelistingSku = (id: number) => request.get<any, BASE_DATA>(`${API.DELISTINGSKU_URL}/${id}`);

// 获取sku信息
export const reqSkuInfo = (id: number) => request.get<any, SkuInfoResponse>(`${API.SKUINFO_RUL}/${id}`);
// 获取图片list
export const reqImageList = (id: number) => request.get<any, any>(`${API.SKUIMAGE_URL}/${id}`);
// 删除sku
export const reqDeleteSku = (id: number) => request.delete<any, any>(`${API.DELETESKU_URL}/${id}`);
