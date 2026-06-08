<template>
    <div>
        <el-form label-width="150" mode="left">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入品牌名称" style="max-width:300px" v-model="spuParama.spuName"></el-input>
            </el-form-item>
            <el-form-item label="SPU品牌">
                <el-select placeholder="请选择" style="max-width:150px" v-model="spuParama.tmId">
                    <el-option :label="item.tmName" v-for="(item, index) in allSpuData" :key="item.id"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" style="min-width: 200px;" v-model="spuParama.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload"
                    :headers="{ Authorization: 'Bearer ', token: GET_TOKEN() }" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                    :before-upload="handlerBeforeUpload" :on-success="handleUploadSuccess"
                    :on-error="handleUploadError">
                    <span class="iconfont icon-tianjiajiahaowubiankuang" style="font-size: 20px;"></span>
                </el-upload>
                <el-dialog v-model="dialogVisible" style="width: 300px;height: 300px;position: relative;">
                    <img w-full :src="dialogImageUrl" alt="Preview Image"
                        style="width: 80%;position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);object-fit: cover;" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="SPU销售属性">
                <el-select style="max-width:150px;margin-right: 20px;"
                    :placeholder="nothaveAttr.length ? `还有${nothaveAttr.length}个未选择` : '无'" v-model="selectNothaveAttr">
                    <el-option :label="item.name" v-for="(item, index) in nothaveAttr" :key="item.id"
                        :value="`${item.id}:${item.name}`"></el-option>
                </el-select>
                <el-button type="primary" size="small" :disabled="selectNothaveAttr ? false : true"
                    @click="handelerAddSaleAttr">添加属性值</el-button>
                <el-table virtual border :data="currentSpuSaleAttr" style="margin-top: 10px;">
                    <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" align="center" width="300">
                    </el-table-column>
                    <el-table-column label="属性值" align="center">
                        <template #="{ row, index }">
                            <el-tag closable @close="row.spuSaleAttrValueList.splice($index, 1)"
                                v-for="(item, $index) in row.spuSaleAttrValueList" style="margin: 0 5px;">{{
                                    item.saleAttrValueName }}</el-tag>
                            <el-input @blur="toLook(row)" type="text" v-if="row.flag" size="small"
                                v-model="row.saleAttrValue"></el-input>
                            <el-button type="primary" size="small" @click="toEdit(row)">
                                <span class="iconfont icon-jia" style="font-size: 10px;"></span>
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                        <template #="{ row, $index }">
                            <el-button type="danger" size="small" @click="() => currentSpuSaleAttr.splice($index, 1)">
                                <span class="iconfont icon-shanchu" style="font-size: 10px;"></span>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="cancel">取消</el-button>
                <el-button type="primary" size="small" @click="confirm"
                    :disabled="currentSpuSaleAttr.length > 0 ? false : true">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType, onUnmounted } from "vue"
import { reqAllSaleAttr, reqSpuImgList, reqSpuSaleAttr, reqBrandmark, reqAddOrUpdateSpu } from "@/api/products/spu/index"
import type { AllBrandmark, SpuImgListResponse, HasSaleAttrResponseData, SaleAttrResponseData, SpuData, Brandmark, SpuImg, SaleAttr, HasSaleAttr, SaleAttrValue } from "@/api/products/spu/type"
import { GET_TOKEN } from "@/utils/token.ts"
import { ElMessage, type UploadProps } from 'element-plus'
import { whiteName } from "@/whiteName";

const props = defineProps({
    secen: {
        required: true,
        type: Number as PropType<number>
    }
})

interface imgData {
    url: string,
    name: string
}


// 存储已有品牌的SPU数据
const allSpuData = ref<Brandmark[]>([])
const imgList = ref<imgData[]>([])
const currentSpuSaleAttr = ref<SaleAttr[]>([])
const allSpuSaleAttr = ref<HasSaleAttr[]>([])

const spuParama = ref<SpuData>({
    category3Id: "",
    description: "",
    spuName: "",
    tmId: "",
    spuImageList: [],
    spuSaleAttrList: []
})
const initSpuParams = async (c3Id: number | string) => {
    // 清空spuParams数据
    Object.assign(spuParama.value, {
        id: undefined,
        category3Id: "",
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: []

    })
    // 清空照片
    imgList.value = []
    // 清空当前销售属性
    currentSpuSaleAttr.value = []
    // 清空所有的attr
    allSpuSaleAttr.value = []


    // 存储三级分类id
    spuParama.value.category3Id = c3Id
    // 获取全部品牌
    const response: AllBrandmark = await reqBrandmark()
    allSpuData.value = response.data
    // 获取所有的销售属性
    const allSaleAttrResponse: HasSaleAttrResponseData = await reqAllSaleAttr()
    allSpuSaleAttr.value = allSaleAttrResponse.data
}

// 还没有选择的所有销售属性
const nothaveAttr = computed(() => {
    return allSpuSaleAttr.value.filter(item => {
        return currentSpuSaleAttr.value.every(item1 => {
            return item.name !== item1.saleAttrName
        })
    })
})
// 通过下拉选择了的还没有的销售属性
const selectNothaveAttr = ref<string>("")

const emits = defineEmits(["secen"])

const initHasSPuData = async (spu: SpuData) => {

    spuParama.value = spu

    // 获取全部品牌的属性
    const response: AllBrandmark = await reqBrandmark()

    // 获取某一个品牌旗下的某一个售卖商品的图片
    const imgResponse: SpuImgListResponse = await reqSpuImgList(spu.id as number)

    // 已有的spu的销售属性
    const saleAttrResponse: SaleAttrResponseData = await reqSpuSaleAttr(spu.id as number)

    // 获取所有的销售属性
    const allSaleAttrResponse: HasSaleAttrResponseData = await reqAllSaleAttr()
    // 存储全部品牌的数据
    allSpuData.value = response.data
    imgList.value = imgResponse.data.map(item => {
        return { name: item.imgName, url: item.imgUrl }
    })
    currentSpuSaleAttr.value = saleAttrResponse.data
    allSpuSaleAttr.value = allSaleAttrResponse.data
}


const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
    imgList.value = imgList.value.filter(item => item.url !== uploadFile.url)
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
}
// 上传之前
const handlerBeforeUpload: UploadProps['beforeUpload'] = (rowfile) => {
    // 判断是否为白名单文件类型
    if ((rowfile.type in whiteName) && (rowfile.size / 1024 / 1024 < 3)) {
        return true
    }
    else {
        ElMessage({
            type: "error",
            message: "只能上传jpg、png、gif文件, 并且 < 3M"
        })
        return false
    }
}
// 上传成功之后
const handleUploadSuccess: UploadProps['onSuccess'] = (response, file, fileList) => {
    dialogImageUrl.value = response.data
    file.url = response.data

}
// 上传失败
const handleUploadError: UploadProps['onError'] = () => {
    ElMessage({ type: 'error', message: '文件上传失败，请检查文件格式和大小' })
}


// 添加销售属性的方法
const handelerAddSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = selectNothaveAttr.value.split(":")
    const newAttr: SaleAttr = {
        baseSaleAttrId: Number(baseSaleAttrId),
        saleAttrName: saleAttrName as string,
        spuSaleAttrValueList: []
    }
    // 追加到现有属性
    currentSpuSaleAttr.value.push(newAttr)
    selectNothaveAttr.value = ""
}

// 属性的value的添加和编辑input的互换显示
const toEdit = (row: SaleAttr) => {
    row.flag = true
    row.saleAttrValue = ""
}
const toLook = (row: SaleAttr) => {
    // 收集attr销售value信息
    const {
        baseSaleAttrId,
        saleAttrValue
    } = row

    const newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue as string
    }
    // 属性的valueName不能为空, 判断属性值是否在数组中
    if (!saleAttrValue?.trim()) {
        ElMessage({
            type: "error",
            message: "不能为空"
        })
    }
    else if (row.spuSaleAttrValueList.find(item => item.saleAttrValueName === saleAttrValue)) {
        ElMessage({
            type: "error",
            message: "不能重复"
        })

    }
    else {
        row.spuSaleAttrValueList.push(newSaleAttrValue)
    }
    row.flag = false
}

const cancel = () => {
    emits("secen", { flag: 0, params: "update" })
}

const confirm = async () => {
    // 整理收集的图片强参数
    spuParama.value.spuImageList = imgList.value.map(item => {
        return {
            imgName: item.name,
            imgUrl: item.url
        }
    })
    // 整理销售属性
    spuParama.value.spuSaleAttrList = currentSpuSaleAttr.value
    // 发送请求
    const response = await reqAddOrUpdateSpu(spuParama.value)
    if (response.code === 200) {
        ElMessage({
            type: "success",
            message: spuParama.value.id ? "修改成功" : "添加成功"
        })
    }
    else {
        ElMessage({
            type: "error",
            message: spuParama.value.id ? "修改失败" : "添加失败"
        })
    }
    emits("secen", { flag: 0, params: spuParama.value.id ? "update" : "add" })
}

defineExpose({ initHasSPuData, initSpuParams })

</script>

<style scoped></style>