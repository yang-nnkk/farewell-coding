<template>
    <div class="attr-container">
        <!-- 三级分类全局组件 -->
        <Category :forbiden="categoryForbiden" class="card-header"></Category>
        <el-card class="card-main">
            <div v-if="secne === 1">
                <div class="add-attr">
                    <el-button v-has="'btn.Attr.add'" type="primary" size="small" :disabled="!categoryStore.c3Id"
                        @click="addAttr">添加属性</el-button>
                </div>
                <el-table :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
                    <el-table-column label="属性名" align="center" prop="attrName"></el-table-column>
                    <el-table-column label="属性值" align="center">
                        <template #="{ row, index }">
                            <el-tag effect="dark" disable-transitions :color="getRandomColor()"
                                v-for="item in row.attrValueList" :key="item.id" style="margin: 5px;">{{
                                    item.valueName
                                }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template #="{ row, index }">
                            <el-button v-has="'btn.Attr.remove'" type="danger" size="small" @click="deleteAttr(row)">删除</el-button>
                            <el-button v-has="'btn.Attr.update'" type="primary" size="small" @click="updateAttr(row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 新增/修改属性 -->
            <div v-else-if="secne === 0">
                <el-button type="default" size="small" @click="cancel" style="margin-bottom: 20px;">
                    <span class="iconfont icon-left" style="font-size: 12px;">返回</span>
                </el-button>
                <el-form :inline="true" ref="addAttrFormRef" :rules="rules" :model="attrParams">
                    <el-form-item label="属性名" prop="attrName">
                        <el-input placeholder="输入属性值" maxlength="200" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                    <div>
                        <el-button type="primary" size="small" :disabled="!attrParams.attrName.trim()"
                            @click="pushNewAttrValue">添加属性值</el-button>
                    </div>
                    <el-table style="margin: 20px 0;" :data="attrParams.attrValueList">
                        <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
                        <el-table-column label="属性值" align="center">
                            <template #="{ row, index }">
                                <el-input placeholder="请输入属性值" v-model="row.valueName"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" type="index" align="center" width="200">
                            <template #="{ row, index }">
                                <el-button type="danger" size="small" @click="deleteAttrValue(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="cancel">取消</el-button>
                        <el-button type="primary" size="small"
                            @click="confirm(addAttrFormRef, undefined, action.confirmAddOrUpdate, undefined)">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 删除当前的某个属性 -->
            <div v-else-if="secne === 2">
                <div class="attrname">
                    <el-button type="default" size="small" @click="cancel" style="margin-bottom: 20px;">
                        <span class="iconfont icon-left" style="font-size: 12px;">返回</span>
                    </el-button>
                    <el-table style="margin: 20px 0;" :data="attrParams.attrValueList">
                        <el-table-column label="id" prop="id" align="center" width="200"></el-table-column>
                        <el-table-column label="valueName" prop="valueName" align="center"></el-table-column>
                        <el-table-column label="attrId" prop="attrId" align="center" width="200"></el-table-column>
                    </el-table>

                    <el-button type="primary" size="small" @click="cancel">取消</el-button>
                    <el-button type="danger" size="small"
                        @click="confirm(undefined, attrParams.id as number, undefined, action.confirmDelete)">删除</el-button>

                </div>
            </div>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
import Category from '@/components/Category/index.vue';
import useCategoryStore from '@/stores/modules/category';
import type { AttrAndValueDataForm, AttrAndValueResponseDataForm, ValueListDataForm } from '@/api/products/attr/type';
import { reqAttrAndValue, reqAddorUpdateAttr, reqDeleteAttr } from '@/api/products/attr';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const categoryStore = useCategoryStore()
const attrArr = ref<AttrAndValueDataForm[]>([])
const secne = ref<number>(1)
const categoryForbiden = computed(() => {
    return secne.value !== 1
})
const addAttrFormRef = ref<FormInstance>()
enum action {
    confirmAddOrUpdate = "confirmAddOrUpdate",
    confirmDelete = "confirmDelete",
}

let attrParams = reactive<AttrAndValueDataForm>({
    attrName: "",
    attrValueList: [],
    categoryId: "",
    categoryLevel: 3
})

const attrNameValitator = (rule: any, value: any, callback: any) => {
    if (!value.trim()) {
        callback(new Error("属性值不能式空白字符"))
    }
    else {
        callback()
    }
}

// 新增属性校验
const rules = reactive<FormRules<AttrAndValueDataForm>>({
    attrName: [
        { required: true, message: "属性为必选项", trigger: "blur" },
        { min: 2, message: "属性至少为两个字符且不能是空格", trigger: "blur" },
        { validator: attrNameValitator, trigger: "blur" }
    ]
})



enum color {
    '#939fcc',       // 深雾蓝（原#bfcfff 深度暗化）
    '#9dc0c5',       // 深雾霾青（原#c8e7ed 深度暗化）
    '#d4b8c4',       // 深温柔粉（原#ffe6f2 深度暗化）
    '#c9d07a',       // 深嫩芽黄（原#f3f798 深度暗化）
    '#bf8acb',       // 深香芋紫（原#eab4f8 深度暗化）
    '#d0a382',       // 深暖杏色（原#fad1ad 深度暗化）
    '#d6d0c9',       // 深奶油白（原#f5eee6 深度暗化）
    '#9dd3dd',       // 深薄荷青（原#c7f5fe 深度暗化）
    '#d09ed0',       // 深樱花粉（原#fcc8f8 深度暗化）
    '#c7c79f'        // 深奶黄（原#f0f4c3 深度暗化）
}
const getRandomColor = () => {
    return color[Math.floor(Math.random() * 4)]
}
// 获取已有属性与属性值方法
const getAttrAndValue = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    if (c3Id) {
        const response: AttrAndValueResponseDataForm = await reqAttrAndValue(c1Id, c2Id, c3Id)
        if (response.code === 200) {
            attrArr.value = response.data
        }
    }

}

// 清空 attrParams
const clearAttrParams = () => {
    attrParams = reactive<AttrAndValueDataForm>({
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3
    })
}

// 监听 c3id， 如果有那么就在表格中显示
watch(() => categoryStore.c3Id, (newVal) => {
    if (!categoryStore.c3Id) {
        attrArr.value = []
        return
    }
    getAttrAndValue()

})
// 组件移除的时候
onMounted(() => {
    // 判断是否有c3Id
    if (categoryStore.c3Id) {
        getAttrAndValue()
    }
})


// 新增属性
const addAttr = () => {
    secne.value = 0
    // 这个按钮可以点击说明三级分类的id有了
    attrParams.categoryId = categoryStore.c3Id
}
// 添加新的属性值
const pushNewAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: "",
    })
}

// 在新增获得修改过程中移除属性的某个value
const deleteAttrValue = async (row: ValueListDataForm) => {
    attrParams.attrValueList = attrParams.attrValueList.filter(item => item.id !== row.id)
}

const reqSaveattr = async () => {
    const response: any = await reqAddorUpdateAttr(attrParams)
    // 判断是否成功
    if (response.code === 200) {
        // 刷新属性列表
        getAttrAndValue()
        // 关闭对话框
        ElMessage({
            type: "success",
            message: attrParams.id ? "修改成功" : "新增成功"
        })
    }
    else {
        ElMessage({
            type: "error",
            message: attrParams.id ? "修改失败" : "新增失败"
        })
    }
    // 重置attrParams
    clearAttrParams()
    secne.value = 1
}
// 保存新增的属性
const saveAttr = async (Form: FormInstance | undefined) => {
    if (!Form) return
    await Form.validate(async (valid, fields) => {
        if (valid) {
            reqSaveattr()
        }
    })

}

// 获取当前行的属性相关数据
const flushAttrInfo = (row: AttrAndValueDataForm) => {
    attrParams.attrName = row.attrName
    attrParams.id = row.id
    attrParams.categoryId = row.categoryId
    attrParams.categoryLevel = row.categoryLevel
    attrParams.attrValueList = row.attrValueList
}

// 修改属性按钮
const updateAttr = (row: AttrAndValueDataForm) => {
    // 获取当前属性
    flushAttrInfo(row)
    secne.value = 0
}
// 删除属性按钮
const deleteAttr = (row: AttrAndValueDataForm) => {
    // 获取要删除的那个属性的信息
    flushAttrInfo(row)
    // 弹出删除对话框
    secne.value = 2
}
// 删除函数
const reqDelete = async (attrId: number) => {
    const response = await reqDeleteAttr(attrId)
    if (response.code === 200) {
        // 重新获取
        getAttrAndValue()
        ElMessage({ type: "success", message: "删除成功" })

    }
    else {
        ElMessage({ type: "error", message: "删除失败请稍后重试" })
    }
    // 重置attrParams
    clearAttrParams()
    secne.value = 1
}

// 通用取消
const cancel = () => {
    // 取消新增、取消修改、取消删除不用做什么请求
    // 只需要重置 attrParams
    clearAttrParams()
    secne.value = 1
}

// 通用确定
const confirm = (Form: FormInstance | undefined = undefined, attrId: number | undefined = undefined, confirmAddOrUpdate: action | undefined = undefined, confirmDelete: action | undefined = undefined) => {
    if (confirmAddOrUpdate) {
        if (Form) {
            // 请求保存
            saveAttr(Form)
        }
    }
    else if (confirmDelete) {
        // 请求删除
        if (attrId) {
            reqDelete(attrId)
        }

    }
}

// 销毁之前清除数据
onBeforeUnmount(() => {
    clearAttrParams()
})


</script>

<style scoped>
.attr-container {
    padding: 10px;

    .card-header {
        margin-bottom: 3px;
    }

    .card-main {
        width: 100%;

        .add-attr {
            margin: 20px 0;
        }
    }


}
</style>