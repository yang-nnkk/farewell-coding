<template>
    <div class="menu-container">
        <template v-for="(item, index) in props.menuRoutes" :key="item.path">

            <!-- 没有子路由 -->
            <template v-if="!item.children">
                <el-menu-item v-if="!item.meta?.hidden" :index="item.path">
                    <template #title>
                        <span :class="['iconfont', item.meta?.icon_path]"></span>
                        <span>{{ item.meta?.title }}</span>
                    </template>
                </el-menu-item>
            </template>



            <!-- 根布局路由只有一个子路由时，直接显示子路由（如 首页） -->
            <template v-else-if="item.path === '/' && item.children.length === 1">
                <el-menu-item v-if="!item.children[0]?.meta?.hidden" :index="item.children[0]?.path">
                    <template #title>
                        <span :class="['iconfont', item.children[0]?.meta?.icon_path]"></span>
                        <span>{{ item.children[0]?.meta?.title }}</span>
                    </template>
                </el-menu-item>
            </template>

            <!-- 其他有子路由的情况，保留层级 -->
            <el-sub-menu v-else :index="item.path">
                <template #title>
                    <span :class="['iconfont', item.meta?.icon_path]"></span>
                    <span>{{ item.meta?.title }}</span>
                </template>
                <Menu :menuRoutes="item.children"></Menu>
            </el-sub-menu>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';
import Menu from "@/layout/menu/index.vue"

const props = defineProps({
    menuRoutes: {
        type: Array as () => RouteRecordRaw[],
        required: true
    }
});

</script>
<style scoped>
.iconfont {
    font-size: 16px;
    margin-right: 8px;
}
</style>