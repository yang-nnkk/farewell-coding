<template>
    <div class="sku-container">
        <el-card>
            <el-table virtual :data="hasSku" style="margin-bottom: 15px; height: 700px;">
                <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
                <el-table-column label="状态" align="center" width="80">
                    <template #="{ row, index }">
                        <span style="color: red;">{{ row.isSale ? "已上架" : "-" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="skuName" align="center" width="150"></el-table-column>
                <el-table-column label="描述" prop="skuDesc" header-align="center"
                    show-overflow-tooltip></el-table-column>
                <el-table-column label="图片" align="center">
                    <template #="{ row, index }">
                        <img :src="row.skuDefaultImg" style="height: 80px; object-fit: cover;">
                    </template>
                </el-table-column>
                <el-table-column label="重量/g" prop="weight" align="center" width="100"></el-table-column>
                <el-table-column label="价格/元" prop="price" align="center" width="100"></el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template #="{ row, index }">
                        <el-button v-has="'btn.Sku.updown'" :type="row.isSale ? 'info' : 'primary'" :title="row.isSale ? '下架' : '上架'"
                            size="small" @click="toggleSale(row)">
                            <span class="iconfont icon-shangjia"></span>
                        </el-button>
                        <el-button v-has="'btn.Sku.detail'" type="warning" size="small" @click="showDetail(row)">
                            <span class="iconfont icon-chakan"></span>
                        </el-button>
                        <el-popconfirm :title="`确定要删除 ${row.skuName.toString()} 吗？`" width="300" @calcel="cancel">
                            <template #reference>
                                <el-button v-has="'btn.Sku.remove'" type="danger" size="small">
                                    <span class="iconfont icon-shanchu"></span>
                                </el-button>
                            </template>
                            <template #actions="{ confirm, cancel }">
                                <el-button type="primary" size="small" @click="cancel">算了</el-button>
                                <el-button type="danger" size="small" @click="removeSku(row, confirm)">删除</el-button>
                            </template>
                        </el-popconfirm>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" v-model:page-size="limit" size="small" background
                layout="prev, pager, next,->,total" :total="total" class="mt-4" />
        </el-card>
        <el-drawer v-model="drawerShow" :modal="true" size="30%">
            <template #header>
                <h5 style="text-align: center;">SKU详情</h5>
            </template>
            <template #default>
                <el-row style="margin-bottom: 5px;">
                    <el-col :span="8"><span class="title">名字</span></el-col>
                    <el-col :span="16"><span class="desc">{{ detailSku.skuName }}</span></el-col>
                </el-row>
                <el-row style="margin-bottom: 5px;">
                    <el-col :span="8"><span class="title">价格</span></el-col>
                    <el-col :span="16"><span class="desc">{{ detailSku.price }}</span></el-col>
                </el-row>
                <el-row style="margin-bottom: 5px;">
                    <el-col :span="8"><span class="title">平台属性</span></el-col>
                    <el-col :span="16"><span class="desc">
                            <el-tag v-for="value in detailSku.skuAttrValueList" style="margin: 5px;">{{ value.valueName
                                }}</el-tag>
                        </span></el-col>
                </el-row>
                <el-row style="margin-bottom: 5px;">
                    <el-col :span="8"><span class="title">销售属性</span></el-col>
                    <el-col :span="16"><span class="desc">
                            <el-tag v-for="value in detailSku.skuSaleAttrValueList" style="margin: 5px;">{{
                                value.saleAttrValueName
                            }}</el-tag>
                        </span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><span class="title">SKU照片</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-carousel v-if="drawerShow" :interval="4000" type="card" style="width: 100%;" height="100px">
                            <el-carousel-item v-for="item in detailSku.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" alt="" style="width: 100%;height: 100%;object-fit: contain;">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary" size="small" @click="() => drawerShow = !drawerShow">了解</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { reqSkulist, reqListingSku, reqDelistingSku, reqSkuInfo, reqImageList, reqDeleteSku } from '@/api/products/sku/index.ts';
import type { SkuData, skuListResponse } from '@/api/products/sku/type.ts';
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';


// 当前页码
const currentPage = ref<number>(1)
// 总页数
const total = ref<number>(0)
// 每页显示多少条数据
const limit = ref<number>(15)
// 存储已有sku
const hasSku = ref<SkuData[]>([])
// 展示详情
const drawerShow = ref<boolean>(false)

// 气泡弹窗
const clicked = ref(false)

// 展示sku详情的数据
const detailSku = ref<SkuData>({
    category3Id: "",
    spuID: "",
    tmId: "",
    skuName: "",
    price: "",
    weight: "",
    skuDesc: "",
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuImageList: [],
    skuDefaultImg: "",
    isSale: false,
    id: ""
})

// 组件挂载，请求数据
onMounted(async () => {
    const skuLIstResponse: skuListResponse = await reqSkulist(currentPage.value, limit.value)
    if (skuLIstResponse.code === 200) {
        hasSku.value = skuLIstResponse.data.records
    }
})


// 商品上架/下架
const toggleSale = async (spu: SkuData) => {
    let saleFlag;
    let toggleSaleResponse;
    try {
        // 请求上架/下架

        if (spu.isSale) {
            // 商品下架
            toggleSaleResponse = await reqDelistingSku(spu.id as number)
            saleFlag = true
        }
        else {
            toggleSaleResponse = await reqListingSku(spu.id as number)
            saleFlag = false
        }
        if (toggleSaleResponse.code === 200) {
            ElMessage({
                type: "success",
                message: saleFlag ? "下架成功" : "上架成功"
            })
            spu.isSale = !spu.isSale
        }
        else {
            ElMessage({
                type: "error",
                message: saleFlag ? "下架失败请稍后重试" : "上架失败请稍后重试"
            })
        }
    } catch {
        ElMessage({
            type: "error",
            message: saleFlag ? "下架失败请稍后重试" : "上架失败请稍后重试"
        })
    }
}

// 展示详情函数
const showDetail = async (row: SkuData) => {
    try {
        // 收集数据
        const skuInfoResponse = await reqSkuInfo(row.id as number)
        const imageListResponse = await reqImageList(row.spuID as number)
        if (skuInfoResponse.code === 200) {
            detailSku.value = { ...skuInfoResponse.data }
            detailSku.value.skuImageList = imageListResponse.data
            // 显示

            drawerShow.value = true
        }
    } catch {
        ElMessage({
            type: "error",
            message: "获取失败稍后重试"
        })
    }

}

// 取消删除
const cancel = () => {
    clicked.value = true
}

// 删除sku
const removeSku = async (row: SkuData, confirm:()=>void) => {
    try {
        const removeResponse = await reqDeleteSku(row.id as number)
        if (removeResponse.code === 200) {
            ElMessage({
                type: "success",
                message: "删除成功"
            })
            hasSku.value = hasSku.value.filter(item => {
                return item.id !== row.id
            })
        }
        else {
            ElMessage({
                type: "error",
                message: "删除失败,请稍后重试"
            })
        }
    } catch {
        ElMessage({
            type: "error",
            message: "网络错误,请稍后重试"
        })
    }
    finally {
        confirm()
        clicked.value = true
    }
}


</script>

<style scoped>
.iconfont {
    font-size: 12px;
}

.title {
    color: #666;
    font-size: 14px;
}

.desc {
    font-size: 14px;
}


.el-carousel__item:nth-child(2n) {
    background-color: transparent;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: transparent;
}
</style>