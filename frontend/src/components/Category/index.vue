<template>
    <div>
        <el-card class="card-header">
            <el-form inline>
                <el-form-item label="一级菜单">
                    <el-select style="width: 200px;" placeholder="请选择" v-model="categoryStore.c1Id"
                        @change="handlerChangeC1" :disabled="props.forbiden">
                        <el-option :label="c1.name" v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id"
                            :value="c1.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级菜单">
                    <el-select style="width: 200px;" placeholder="请选择" v-model="categoryStore.c2Id"
                        @change="handlerChangeC2" :disabled="props.forbiden">
                        <el-option :label="c2.name" v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id"
                            :value="c2.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="三级菜单">
                    <el-select style="width: 200px;" placeholder="请选择" v-model="categoryStore.c3Id"
                        :disabled="props.forbiden">
                        <el-option :label="c3.name" v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id"
                            :value="c3.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, type PropType } from 'vue';
// 从仓库中获取商品分类数据
import useCategoryStore from '@/stores/modules/category';
const categoryStore = useCategoryStore()

const props = defineProps({
    forbiden: {
        required: true,
        type: Boolean as PropType<boolean>
    }
})


// 获取一级分类方法
const getCategoryC1 = () => {
    categoryStore.getC1()
}

// 组件挂载的时候从仓库中获取一级分类数据
onMounted(() => {
    getCategoryC1()
})

// c1 分类value变化
const handlerChangeC1 = () => {
    categoryStore.getC2()
    // 清理 c2 c3
    categoryStore.clearByC1()
}
// c2分类value变化
const handlerChangeC2 = () => {
    categoryStore.getC3()
    categoryStore.clearByC2()
}

</script>

<style scoped></style>