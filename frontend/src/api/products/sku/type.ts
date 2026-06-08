// sku 请求相关的ts 类型
import type { BASE_DATA } from '@/api/products/baseType.ts';

// 平台属性
export interface skuAttrValue {
    attrId: string | number; // 平台属性id
    valueId: string | number;
    valueName?: string; // 属性值名称
}
// 销售属性
export interface skuSaleAttrValue {
    saleAttrId: string | number; // 属性的id
    saleAttrValueId: string | number; // 属性的值的id
    saleAttrValueName?: string;
}
// 图片列表
export interface SkuImageData {
    id: number;
    skuId: number;
    imgName: string;
    imgUrl: string;
    spuImgId: number;
    isDefault: string | number;
}

// 定义SKU数据类型
export interface SkuData {
    category3Id: string | number; // 三级分类的Id
    spuID: string | number; // 已有SPU的id
    tmId: string | number; // 已有品牌的id
    skuName: string; //sku 名字
    price: string | number; // 价格
    weight: string | number; // sku 重量
    skuDesc: string; // sku描述
    skuAttrValueList: skuAttrValue[]; // 平台属性手机
    skuSaleAttrValueList: skuSaleAttrValue[]; // 销售属性
    skuDefaultImg: string; // sku图片地址
    isSale?: boolean;
    id?: number | string;
    skuImageList?: SkuImageData[];
}

// 获取sku分页列表的返回数据类型
export interface skuListResponse extends BASE_DATA {
    data: {
        records: SkuData[];
        total: number;
        size: number;
        current: number;
        searchCount: boolean;
        pages: number;
    };
}

// 获取sku信息返回的数据类型
export interface SkuInfoResponse extends BASE_DATA {
    data: SkuData;
}
