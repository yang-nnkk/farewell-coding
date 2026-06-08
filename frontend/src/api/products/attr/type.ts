// 商品属性管理相关ts数据类型
import type { BASE_DATA } from '../baseType';

interface CategoryDataObj {
    name: string;
    id: number | string;
    category1Id?: number;
    category2Id?: number;
}

export interface CategoryResponseData extends BASE_DATA {
    data: CategoryDataObj[];
}

export interface ValueListDataForm {
    id?: number | string;
    valueName: string;
    attrId?: number | string;
}

export interface CategoryState {
    c1Arr: CategoryDataObj[];
    c2Arr: CategoryDataObj[];
    c3Arr: CategoryDataObj[];
    c1Id: number | string;
    c2Id: number | string;
    c3Id: number | string;
}

export interface AttrAndValueDataForm {
    id?: number | string;
    attrName: string;
    categoryId: number | string;
    categoryLevel: number;
    attrValueList: ValueListDataForm[];
    attrIdAndValueId?: string;
}

// {
//   "ID": 0,
//   "attrName": "string",
//   "attrValueList": [
//     {
//       "attrId": 0,
//       "id": 0,
//       "valueName": "string"
//     }
//   ],
//   "categoryId": 0,
//   "categoryLevel": 0,
//   "createTime": {
//     "time.Time": "string"
//   },
//   "id": 0,
//   "updateTime": {
//     "time.Time": "string"
//   }
// }

// 已有属性的属性获取响应
export interface AttrAndValueResponseDataForm extends BASE_DATA {
    data: AttrAndValueDataForm[];
}
