import type { BASE_DATA } from '../baseType';

export interface BaseResponseData {
    code: number;
    message: string;
    ok: boolean;
}

// 定义 SPU ts数据类型
export interface SpuData {
    id?: number;
    spuName: string;
    tmId: number | string;
    description: string;
    category3Id: number | string;
    spuSaleAttrList: null | SaleAttr[];
    spuImageList: null | SpuImg[];
}

export type Records = SpuData[];

export interface HasSpuResponseData extends BaseResponseData {
    data: {
        records: Records;
        total: number;
        size: number;
        current: number;
        searchCount: boolean;
        page: number;
    };
}

// 已有品牌数据类型
export interface Brandmark {
    id: number;
    tmName: string;
    logoUrl: string;
}

// 品牌接口返回的数据类型
export interface AllBrandmark extends BaseResponseData {
    data: Brandmark[];
}

// 商品图片的ts类型
export interface SpuImg {
    id?: number;
    spuId?: number;
    imgName: string;
    imgUrl: string;
    createTime?: string;
    updateTime?: string;
}
// 已有的SPU图片墙的数据类型
export interface SpuImgListResponse extends BaseResponseData {
    data: SpuImg[];
}

// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
    baseSaleAttrId: number;
    saleAttrValueName: string;

    id?: number;
    spuId?: number;
    saleAttrName?: string;
    isChecked?: null;
    createTime?: null;
    ipdateTime?: null;
}

// 销售属性的对象
export interface SaleAttr {
    baseSaleAttrId: number;
    saleAttrName: string;
    spuSaleAttrValueList: SaleAttrValue[];

    id?: number;
    spuId?: number;
    createTime?: null;
    ipdateTime?: null;
    flag?: boolean;
    saleAttrValue?: string;
    currentSaleAttrIdAndValueId?: string;
}
// Spu 销售属性的返回数据类型
export interface SaleAttrResponseData extends BASE_DATA {
    data: SaleAttr[];
}

// 已有的全部SPU的返回数据类型
export interface HasSaleAttr {
    id: number;
    name: string;
}
export interface HasSaleAttrResponseData extends BaseResponseData {
    data: HasSaleAttr[];
}

// 平台属性
export interface skuAttrValue {
    attrId: string | number; // 平台属性id
    valueId: string | number;
}
// 销售属性
export interface skuSaleAttrValue {
    saleAttrId: string | number; // 属性的id
    saleAttrValueId: string | number; // 属性的值的id
}
// 定义SKU数据类型
export interface SkuData {
    category3Id: string | number; // 三级分类的Id
    spuId: string | number; // 已有SPU的id
    tmId: string | number; // 已有品牌的id
    skuName: string; //sku 名字
    price: string | number; // 价格
    weight: string | number; // sku 重量
    skuDesc: string; // sku描述
    skuAttrValueList: skuAttrValue[]; // 平台属性手机
    skuSaleAttrValueList: skuSaleAttrValue[]; // 销售属性
    skuDefaultImg: string; // sku图片地址
}

// 获取SKU数据接口的 ts 类型
export interface SkuInfoDataResponse extends BASE_DATA {
    data: SkuData[];
}
