import request from '@/utils/request';
import type {
    HasSpuResponseData,
    SpuImgListResponse,
    SaleAttrResponseData,
    HasSaleAttrResponseData,
    SpuData,
    SkuData,
    SkuInfoDataResponse,
} from './type';
import type { AllBrandmark } from './type';

enum API {
    // 获取已有的SPU的数据
    HASSPU_RUL = '/admin/product/',
    // 获取全部品牌数据
    ALLBRANDMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    // 获取某一个SPU下的全部售卖商品的信息
    IMAGELIST_URL = '/admin/product/spuImageList/',
    // 获取某一个SPU下的销售属性
    SPUSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    // 获取整个项目下的全部销售属性列表 【颜色、版本、尺码】
    ALLSALEATTR_RUL = '/admin/product/baseSaleAttrList',
    // 更新SPU
    UPDATESPU_RUL = '/admin/product/updateSpuInfo',
    // 添加新的SPU
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    // 追加一个新的 SKU 的请求地址
    ADDSKU_RUL = '/admin/product/saveSkuInfo',
    // 查看某一个已有的SPU下的SKU
    SKU_URL = '/admin/product/findBySpuId/',
    // 删除已有SPU
    REMOVESPU_RUL = '/admin/product/deleteSpu/',
}

// 获取 SPU 分页列表
export const reqHasSpu = (page: number, limit: number, categoryC3Id: number | string) =>
    request.get<any, HasSpuResponseData>(`${API.HASSPU_RUL}${page}/${limit}?category3Id=${categoryC3Id}`);

// 获取所有品牌的信息
export const reqBrandmark = () => request.get<any, AllBrandmark>(API.ALLBRANDMARK_URL);

// 获取某一个SPU下的全部售卖商品的图片
export const reqSpuImgList = (id: number) => request.get<any, SpuImgListResponse>(`${API.IMAGELIST_URL}${id}`);

// 获取某一个SPU下的销售属性
export const reqSpuSaleAttr = (id: number) => request.get<any, SaleAttrResponseData>(`${API.SPUSALEATTR_URL}${id}`);

// 获取所有销售属性列表
export const reqAllSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_RUL);

// 添加新的SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
    // data 为新增的SPU或者已有的SPU
    if (data.id) {
        // 有id 说明是更新已有的SPU
        return request.post<any, any>(API.UPDATESPU_RUL, data);
    } else {
        // 没有id说明是新增的
        return request.post<any, any>(API.ADDSPU_URL, data);
    }
};

// 文档参数有问题
// {
//     category3Id: "" // 三级分类的Id
//     spuId: ""  // 已有SPU的id
//     tmId: ""  // 已有品牌的id
//     skuName: ""  //sku 名字
//     price: ""  // 价格
//     weight: ""  // sku 重量
//     skuDesc: ""  // sku描述
//     // 平台属性手机
//     skuAttrValueList: [
//         {
//             // 平台属性的id
//             attrId: "",
//             // 平台属性的值的id
//             valueId: "",
//          }
//     ]
//     // 销售属性
//     skuSaleAttrValueList: [
//         {
//             // 属性id
//             saleAttrId: "",
//             //
//             saleAttrValueId:""
//         }
//     ]
//     skuDefaultImg:""  // sku图片地址
// }

// 追加一个新的SKU
export const reqAddSku = (data: SkuData) => request.post<any, any>(API.ADDSKU_RUL, data);

// 获取某一个SPU的所有SKU
export const reqSkuList = (id: number | string) => request.get<any, SkuInfoDataResponse>(`${API.SKU_URL}${id}`);

// 删除已有PSU
export const reqDeleteSpu = (id: number | string) => request.delete<any, any>(`${API.REMOVESPU_RUL}${id}`);
