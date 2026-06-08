import { defineStore } from 'pinia';
import { reqC1, reqC2, reqC3 } from '@/api/products/attr';
import type { CategoryResponseData, CategoryState, ValueListDataForm } from '@/api/products/attr/type';

// 商品分类全局组件仓库
const useCategoryStore = defineStore('CateGory', {
    state: (): CategoryState => {
        return {
            c1Arr: [],
            c2Arr: [],
            c3Arr: [],
            c1Id: '',
            c2Id: '',
            c3Id: '',
        };
    },
    actions: {
        // 获取c1分类
        async getC1() {
            const response: CategoryResponseData = await reqC1();
            if (response.code === 200) {
                // 存储数据
                this.c1Arr = response.data;
            }
        },
        async getC2() {
            const response: CategoryResponseData = await reqC2(this.c1Id);
            if (response.code === 200) {
                this.c2Arr = response.data;
            }
        },
        async getC3() {
            const response: CategoryResponseData = await reqC3(this.c2Id);
            if (response.code === 200) {
                this.c3Arr = response.data;
            }
        },

        updateValuelist(newData: ValueListDataForm) {},

        async clearAll() {
            this.c3Arr = [];
            this.c2Arr = [];
            this.c1Arr = [];
            this.c3Id = '';
            this.c2Id = '';
            this.c1Id = '';
        },
        async clearByC1() {
            this.c3Arr = [];
            this.c2Arr = [];
            this.c3Id = '';
            this.c2Id = '';
        },
        async clearByC2() {
            this.c3Arr = [];
            this.c3Id = '';
        },
    },
    getters: {},
});

export default useCategoryStore;
