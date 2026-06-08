<template>
    <div class="spu-container">
        <!-- 三级分类 -->
        <Category :forbiden="categoryForbiden" />

        <el-card style="margin: 5px 0; width: 100%">
            <div v-show="secen === 0">
                <el-button
                    type="primary"
                    size="small"
                    style="margin: 10px 0"
                    :disabled="categoryStore.c3Id ? false : true"
                    @click="addSpu"
                >
                    添加SPU
                </el-button>
                <el-table :data="records" border virtual style="height: 600px">
                    <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
                    <el-table-column prop="spuName" label="SPU" align="center" width="200"></el-table-column>
                    <el-table-column
                        prop="description"
                        label="SPU描述"
                        align="center"
                        show-overflow-tooltip
                        header-align="center"
                    ></el-table-column>
                    <el-table-column label="操作" align="center" width="250">
                        <template #="{ row, index }">
                            <el-button size="small" type="primary" @click="addSku(row)">
                                <span class="iconfont icon-tianjiajiahaowubiankuang" style="font-size: 10px"></span>
                            </el-button>
                            <el-button size="small" type="warning" @click="updateSpu(row)">
                                <span class="iconfont icon-xiugai" style="font-size: 10px"></span>
                            </el-button>
                            <el-button size="small" type="success" @click="lookSku(row)">
                                <span class="iconfont icon-chakan" style="font-size: 10px"></span>
                            </el-button>
                            <el-popconfirm
                                :title="`你确定要删除${row.spuName}吗?`"
                                @confirm="sureRemoveSpu(row)"
                                @cancel="cancelRemoveSpu"
                            >
                                <template #reference>
                                    <el-button size="small" type="danger">
                                        <span class="iconfont icon-shanchu" style="font-size: 10px"></span>
                                    </el-button>
                                </template>
                                <template #action> </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页工具 -->
                <el-pagination
                    v-model:current-page="pageNo"
                    v-model:page-size="limit"
                    :total="total"
                    background
                    size="small"
                    @change="getHasSpu"
                    style="margin-top: 20px"
                    layout="prev, pager, next,->,total"
                />
            </div>
            <div v-show="secen === 1">
                <SpuForm ref="SpuFormRef" @secen="chnageSecen" :secen="secen"></SpuForm>
            </div>
            <div v-show="secen === 2">
                <SkuForm ref="SkuFormRef" @secen="chnageSecen"></SkuForm>
            </div>
            <el-dialog v-model="skuShow">
                <el-table border :data="currentSku">
                    <el-table-column label="SKU名字" prop="skuName" align="center"></el-table-column>
                    <el-table-column label="SKU价格" prop="price" align="center"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight" align="center"></el-table-column>
                    <el-table-column label="SKU图片" align="center">
                        <template #="{ row, index }">
                            <img :src="row.skuDefaultImg" style="height: 50px; object-fit: cover" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import Category from "@/components/Category/index.vue";
import { defineAsyncComponent } from "vue";
const SpuForm = defineAsyncComponent(() => import("./SpuForm.vue"));
const SkuForm = defineAsyncComponent(() => import("./SkuForm.vue"));

import { computed, onMounted, ref, watch, onBeforeUnmount } from "vue";
import { reqDeleteSpu, reqHasSpu, reqSkuList } from "@/api/products/spu/index.ts";
import type { HasSpuResponseData, Records, SkuData, SpuData } from "@/api/products/spu/type.ts";

// 场景值 falg
const secen = ref(0);
const categoryForbiden = computed(() => {
    return secen.value !== 0;
});

// 引入分类仓库
import useCategoryStore from "@/stores/modules/category";
import { ElMessage } from "element-plus";
const categoryStore = useCategoryStore();

// 当前页数
const pageNo = ref<number>(1);
// 一页展示几条数据
const limit = ref<number>(15);
// spu 列表
let records = ref<Records>();
// 存储已有的spu总数
const total = ref<number>(0);

const SpuFormRef = ref();
const SkuFormRef = ref();

// 存储SKU数据
const currentSku = ref<SkuData[]>([]);
// 是否显示sku
const skuShow = ref<boolean>(false);

// 获取某一个三级分类下的已有的 SPU
const getHasSpu = async (page = 1) => {
    const response: HasSpuResponseData = await reqHasSpu(page, limit.value, categoryStore.c3Id);
    if (response.code === 200) {
        records.value = response.data.records;
        total.value = response.data.total;
    }
};

onMounted(() => {
    if (categoryStore.c3Id) {
        getHasSpu();
    }
});

watch(
    () => categoryStore.c3Id,
    () => {
        // 确保c3Id存在才发请求
        if (categoryStore.c3Id) {
            getHasSpu(pageNo.value);
        }
    },
);

const addSpu = () => {
    SpuFormRef.value.initSpuParams(categoryStore.c3Id);
    secen.value = 1;
};

const updateSpu = (row: SpuData) => {
    SpuFormRef.value.initHasSPuData(row);
    secen.value = 1;
};

const addSku = (row: SpuData) => {
    secen.value = 2;
    SkuFormRef.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
};

// 查看相对应的SKU
const lookSku = async (row: SpuData) => {
    try {
        const skuListResponse = await reqSkuList(row.id as number);
        if (skuListResponse.code === 200) {
            currentSku.value = skuListResponse.data;
            skuShow.value = true;
        }
    } catch {
        ElMessage({
            type: "error",
            message: "请求出错了",
        });
    }
};

// 取消删除SPU
const cancelRemoveSpu = () => {
    skuShow.value = false;
};

// 删除SPU
const sureRemoveSpu = async (row: SpuData) => {
    try {
        const deleteSpuResonce = await reqDeleteSpu(row.id as number);
        if (deleteSpuResonce.code === 200) {
            ElMessage({ type: "success", message: "删除成功" });
            getHasSpu();
        }
    } catch {
        ElMessage({ type: "error", message: "删除失败请稍后重试" });
    }
    skuShow.value = false;
};

const chnageSecen = (option: any) => {
    secen.value = option.flag;
    if (option.params === "update") {
        // 更新就留在当前页面
        getHasSpu(pageNo.value);
    } else {
        // 删除或者添加都是跳到尾页
        if (total.value && limit.value) {
            pageNo.value = Math.ceil(total.value / limit.value);
        }
        getHasSpu(pageNo.value);
    }
};

// 销毁之前清除数据
onBeforeUnmount(() => {
    categoryStore.$reset();
});
</script>

<style scoped>
.spu-conatiner {
    width: 100%;
}
</style>
