<template>
    <div class="brand-container">
        <el-card>
            <template #header>
                <el-button v-has="'btn.Trademark.add'" type="primary" @click="addBrand">添加</el-button>
            </template>

            <!-- 商品展示table -->
            <el-table height="600" virtual :data="brandArr" row-key="id">
                <el-table-column label="序号" align="center" width="100" type="index"></el-table-column>
                <el-table-column prop="tmName" label="品牌名称" align="center"></el-table-column>
                <el-table-column align="center" label="LOGO">
                    <template #="{ row, $index }">
                        <img :src="row.logoUrl" style="height: 50px;object-fit: cover;" loading="lazy">
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #="{ row, $index }">
                        <el-button v-has="'btn.Trademark.remove'" type="danger" size="small" @click="deleteBrand(row)">删除</el-button>
                        <el-button v-has="'btn.Trademark.update'" type="primary" size="small" @click="updateBrand(row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页工具 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :background="true" size="small"
                @update:current-page="getHasBrandmark" :total="total" style="margin-top: 20px;" />
        </el-card>


        <!-- 添加品牌 对话框-->
        <el-dialog v-model="dialogFormVisible" :title="actionTitle" width="500">
            <el-form style="width: 70%;" :model="brandFormdata" :rules="rules" ref="dialogFormRef"
                label-position="left">
                <el-form-item label="品牌名称" label-width="100" prop="tmName">
                    <el-input placeholder="请输入品牌名称" style="width: 200px;" v-model="brandFormdata.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :on-error="handleUploadError" :before-upload="beforeAvatarUpload"
                        :headers="{ Authorization: 'Bearer ', token: GET_TOKEN() }">
                        <img v-if="brandFormdata.logoUrl" :src="brandFormdata.logoUrl" class="avatar" />
                        <div v-else class="add-icon-container">
                            <span :class="['iconfont', 'icon-jia']" style="font-size: 50px;"></span>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="danger" size="small" @click="cancel">取消</el-button>
                <el-button type="primary" size="small" @click="dialogFormValidate(dialogFormRef)">确定</el-button>
            </template>
        </el-dialog>

        <!-- 删除品牌对话框 -->
        <el-dialog width="300" v-model="deleteDialogVisibles">
            <div class="title">确定要删除吗？</div>

            <div class="brand-name">
                <span class="desc">品牌名字</span>
                <span class="content">{{ brandFormdata.tmName }}</span>
            </div>
            <div class="logo-img">
                <div class="desc">品牌LOGO</div>
                <img :src="brandFormdata.logoUrl">
            </div>
            <div class="delete-action">
                <el-button type="primary" size="small" @click="deleteCancel">算了</el-button>
                <el-button type="danger" size="small" @click="deleteComfirm">删除</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue"
// 引入请求商品品牌的请求接口
import { reqAddOrUpdateBrandmark, reqDeleteBrandmark, reqHasBrandmark } from "@/api/products/brand/index.ts";
import type { Records, BrandmarkResponseData, Brand, DeleteBrandResponseDataForm } from "@/api/products/brand/type.ts";
import { ElMessage, type UploadProps, type FormRules, type FormInstance } from 'element-plus'
// 导入白名单
import { whiteName } from "@/whiteName";
import { GET_TOKEN } from "@/utils/token";


// 当前页码
let pageNo = ref<number>(1);
// 显示页数
let limit = ref<number>(8);
// 表格相关数据
const brandArr = ref<Records>([])
// 已有品牌数据总数
const total = ref<number>(0)
// 对话框标题
const actionTitle = ref()

// 控制对话框显示与隐藏
const dialogFormVisible = ref<boolean>(false)
const deleteDialogVisibles = ref<boolean>(false)

const dialogFormRef = ref<FormInstance>();
// 对话框数据类型
const brandFormdata = reactive<Brand>({
    tmName: "",
    logoUrl: ""
})
const rules = reactive<FormRules<Brand>>({
    tmName: [
        { required: true, message: "此项为必填", trigger: "blur" },
        { min: 2, message: "长度至少两个字符", trigger: "blur" }
    ],
    logoUrl: [
        { required: true, message: "品牌必须有LOGO", trigger: "blur" }
    ]
})

// 获取数据函数
const getHasBrandmark = async () => {
    const response: BrandmarkResponseData = await reqHasBrandmark(pageNo.value, limit.value)
    if (response.code === 200) {
        total.value = response.data.total
        brandArr.value = response.data.records
    }
}
// 挂载的时候默认加载第一次
onMounted(async () => {
    getHasBrandmark()
})


// 表单验证
const dialogFormValidate = async (Form: FormInstance | undefined) => {
    if (!Form) return
    await Form.validate((valid, fields) => {
        if (valid) {
            // 如果验证成功那么就 请求添加或修改品牌
            confirm()
        }
        else {
            ElMessage({
                type: "error",
                message: "请注意表单要求"
            })
        }
    })
}

// 添加品牌按钮
const addBrand = () => {
    dialogFormVisible.value = true
    actionTitle.value = "添加品牌"
    // 清空上一次数据
    brandFormdata.logoUrl = ""
    brandFormdata.tmName = ""
    brandFormdata.id = undefined
}

// 修改品牌信息
const updateBrand = (row: Brand) => {
    dialogFormVisible.value = true
    actionTitle.value = "修改品牌"
    // 在对话框中显示信息
    brandFormdata.id = row.id
    brandFormdata.logoUrl = row.logoUrl
    brandFormdata.tmName = row.tmName
}

// 添加或修改品牌的对话框取消
const cancel = () => {
    dialogFormVisible.value = false
}

// 添加或修改品牌的对话框确定
const confirm = async () => {
    // 如果有id就是修改没有就是添加， 在api/product中处理过
    const response: any = await reqAddOrUpdateBrandmark(brandFormdata)
    if (response.code === 200) {
        ElMessage({ type: "success", message: "添加成功" })
        // 重新拉取数据
        getHasBrandmark()
    }
    else {
        ElMessage({
            type: "error",
            message: actionTitle.value + "失败"
        })
    }
    // 关闭对话框
    dialogFormVisible.value = false
}

// 上传文件成功之前
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rowfile) => {
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
// 上传文件成功之后
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    brandFormdata.logoUrl = response.data
}
// 上传文件失败
const handleUploadError: UploadProps['onError'] = () => {
    ElMessage({ type: 'error', message: '文件上传失败，请检查文件格式和大小' })
}


// 点击删除品牌按钮
const deleteBrand = (row: Brand) => {
    // 显示对话框
    deleteDialogVisibles.value = true
    brandFormdata.id = row.id
    brandFormdata.tmName = row.tmName
    brandFormdata.logoUrl = row.logoUrl
}

const deleteCancel = () => {
    // 取消删除，关闭删除对话框
    deleteDialogVisibles.value = false
}
const deleteComfirm = () => {
    // 点击确定删除， 那么就发送删除请求
    sureDeleteBrand(brandFormdata.id as number)
    deleteDialogVisibles.value = false
}

// 删除品牌
const sureDeleteBrand = async (id: number) => {

    // 向服务器发送请求
    const response: DeleteBrandResponseDataForm = await reqDeleteBrandmark(id)
    if (response.code === 200) {
        ElMessage({
            type: "success",
            message: "删除成功"
        })
        // 删除本地
        brandArr.value = brandArr.value.filter((item) => {
            return item.id !== id
        })
    }
    else {
        ElMessage({
            type: "error",
            message: "删除失败，请稍后重试"
        })
    }
}



</script>

<style scoped lang="scss">
.brand-container {
    width: 100%;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.add-icon-container {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.5px rgb(211, 211, 211) dashed;
    border-radius: 10px;
}

.title {
    height: 50px;
    font-size: 20px;
    font-weight: bold;
    color: rgb(231, 23, 23);
    margin-top: -20px;
}

.desc {
    font-size: 14px;
    color: #999;
    margin-right: 50px;
}

.brand-name {
    width: 100%;
    height: 50px;
}

.logo-img {
    width: 100%;
    height: 100px;
    overflow: hidden;
    margin-bottom: 30px;

    img {
        margin-left: 90px;
        width: 80px;
        height: 80px;
        object-fit: cover;
    }
}

.delete-action {
    width: 100%;
    display: flex;
    align-items: center;
    flex-flow: row-reverse;
    column-gap: 20px;
}
</style>
