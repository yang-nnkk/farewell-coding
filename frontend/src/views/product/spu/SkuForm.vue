<template>
    <div class="sku-container">
        <el-form label-width="100" label-position="left">
            <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" style="width: 300px;" v-model="skuParams.skuName"></el-input>
            </el-form-item>

            <el-form-item label="SKU价格(元)">
                <el-input placeholder="SKU价格(元)" style="width: 300px;" v-model="skuParams.price"></el-input>
            </el-form-item>
            <el-form-item label="重量(g)">
                <el-input placeholder="输入重量(g)" style="width: 300px;" v-model="skuParams.weight"></el-input>
            </el-form-item>
            <el-form-item label="SKU描述">
                <el-input placeholder="输入SKU描述" style="max-width: 600px;" v-model="skuParams.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性" style="margin: 30px 0;">
                <el-form inline>
                    <el-form-item v-for="attrItem in attrAndValue" :label="attrItem.attrName" label-position="left"
                        label-width="100px" style="margin: 10px 35px;">
                        <el-select style="width: 150px;" placeholder="请选择" v-model="attrItem.attrIdAndValueId">
                            <el-option v-for="attrValue in attrItem.attrValueList" :key="attrValue.id"
                                :label="attrValue.valueName" :value="`${attrItem.id}:${attrValue.id}`"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性" style="margin: 30px 0;">
                <el-form inline>
                    <el-form-item v-for="currentAttr in currentSpuAttr" :label="currentAttr.saleAttrName"
                        label-position="left" label-width="100px" style="margin: 10px 35px;">
                        <el-select style="width: 150px;" placeholder="请选择"
                            v-model="currentAttr.currentSaleAttrIdAndValueId">
                            <el-option v-for="currentSaleAttr in currentAttr.spuSaleAttrValueList"
                                :label="currentSaleAttr.saleAttrValueName"
                                :value="`${currentAttr.id}:${currentSaleAttr.id}`"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="展示">
                <el-table border :data="currentSpuImgs" ref="tableRef">
                    <el-table-column type="selection" align="center" width="80"></el-table-column>
                    <el-table-column label="图片" align="center">
                        <template #="{ row, $index }">
                            <img :src="row.imgUrl" style="height: 80px;object-fit: cover;" loading="lazy">
                        </template>
                    </el-table-column>
                    <el-table-column label="图片名" prop="imgName" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" width="120px">
                        <template #="{ row, index }">
                            <el-button type="warning" size="small" @click="handlerSetDeault(row)">设为默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item style="margin: 20px 0;">
                <el-button type="primary" size="small" @click="cancel">取消</el-button>
                <el-button type="primary" size="small" @click="confirm">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import type { SpuData, SpuImg, SaleAttr, SkuData, skuSaleAttrValue, skuAttrValue } from '@/api/products/spu/type.ts'
import { reqAddSku, reqSpuImgList, reqSpuSaleAttr } from '@/api/products/spu/index.ts'
import { reqAttrAndValue } from '@/api/products/attr'
import type { AttrAndValueDataForm } from "@/api/products/attr/type.ts"
import { ElMessage, type TableInstance } from "element-plus"

const $emit = defineEmits(["secen"])
const tableRef = ref<TableInstance>()

const skuParams = reactive<SkuData>({
    // 父组件传递就可以
    category3Id: "",
    spuId: "",
    tmId: "",
    // v-model
    skuName: "",
    price: "",
    weight: "",
    skuDesc: "",
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: ''
})

const attrAndValue = ref<AttrAndValueDataForm[]>([])
const currentSpuAttr = ref<SaleAttr[]>([])
const currentSpuImgs = ref<SpuImg[]>([])

const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: SpuData) => {


    skuParams.category3Id = spu.category3Id
    skuParams.spuId = spu.id as number
    skuParams.tmId = spu.tmId

    // 获取c1Id/c2Id/c3Id 所有销售属性和销售value
    const attrAndValueResponse = await reqAttrAndValue(c1Id, c2Id, spu.category3Id)
    attrAndValue.value = attrAndValueResponse.data

    // 获取对应SPU的 销售属性
    const currentSpuAttrResponse = await reqSpuSaleAttr(spu.id as number)
    currentSpuAttr.value = currentSpuAttrResponse.data

    // 获取对应的spu的 照片组
    const currentSpuImgResponse = await reqSpuImgList(spu.id as number)
    currentSpuImgs.value = currentSpuImgResponse.data
}

const handlerSetDeault = (row: SpuImg) => {
    // 先取消所有的勾选状态
    tableRef.value?.clearSelection()
    // 再勾选当前row
    tableRef.value?.toggleRowSelection(row, true)
    // 设置skuParams
    skuParams.skuDefaultImg = row.imgUrl
}


const cancel = () => {
    $emit("secen", { flag: 0, params: "" })
}


// 函数封装，平台销售属性和当前SPU销售属性的数据映射
function myReduce(data: SaleAttr[] | AttrAndValueDataForm[]): skuAttrValue[] | skuSaleAttrValue[] {
    return data.reduce((acc: any[], obj: SaleAttr | AttrAndValueDataForm) => {
        if ("currentSaleAttrIdAndValueId" in obj && obj.currentSaleAttrIdAndValueId) {
            const idArray = obj.currentSaleAttrIdAndValueId.split(":")
            acc.push({
                saleAttrId: idArray[0],
                saleAttrValueId: idArray[1]
            })
        }
        else if ("attrIdAndValueId" in obj && obj.attrIdAndValueId) {
            const idArray = obj.attrIdAndValueId.split(":")
            acc.push({
                attrId: idArray[0],
                valueId: idArray[1]
            })
        }
        return acc
    }, [])
}



// 保存按钮方法
const confirm = async () => {
    // 表单验证
    if (!skuParams.skuName) {
        ElMessage.warning("请输入SKU名称")
        return
    }
    if (!skuParams.price) {
        ElMessage.warning("请输入SKU价格")
        return
    }
    if (!skuParams.weight) {
        ElMessage.warning("请输入重量")
        return
    }
    if (!skuParams.skuDesc) {
        ElMessage.warning("请输入SKU描述")
        return
    }

    // 整理参数
    skuParams.skuAttrValueList = myReduce(attrAndValue.value) as skuAttrValue[]
    skuParams.skuSaleAttrValueList = myReduce(currentSpuAttr.value) as skuSaleAttrValue[]

    try {
        // 发送请求
        const addSkuResponse = await reqAddSku(skuParams)

        // 成功
        if (addSkuResponse.code === 200) {
            ElMessage({
                type: "success",
                message: "添加成功"
            })
            $emit("secen", { flag: 0, params: "" })
        }
        // 失败
        else {
            ElMessage({
                type: "error",
                message: addSkuResponse.message || "添加失败"
            })
        }
    } catch (error) {
        ElMessage({
            type: "error",
            message: "请求失败，请检查网络连接"
        })
    }
}


defineExpose({ initSkuData })

</script>

<style scoped></style>