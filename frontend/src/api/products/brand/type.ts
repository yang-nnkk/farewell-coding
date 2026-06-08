// 定义商品请求接口相关的数据类型
import type { BASE_DATA } from '../baseType';

// 已有品牌的ts数据类型
export interface Brand {
    id?: number;
    tmName: string;
    logoUrl: string;
}

// 包含全部品牌数据的ts类型
export type Records = Brand[];

// 获取的已有全部品牌的数据类型
export interface BrandmarkResponseData extends BASE_DATA {
    data: {
        records: Records;
        total: number;
        size: number;
        current: number;
        searchCount: boolean;
        pages: number;
    };
}

//修改或者新增品牌的响应数据ts类型
export interface AddOrUpdateBrandResponse extends BASE_DATA {
    data: string;
}

// 删除品牌的数据类型
export interface DeleteBrandDataForm {
    id: number;
}
// 删除品牌的响应数据类型
export interface DeleteBrandResponseDataForm extends BASE_DATA {
    data: string;
}
