<template>
    <div class="layout-container">
        <div class="navigation">
            <!-- logo -->
            <logo></logo>
            <!-- 菜单 -->
            <el-scrollbar class="menu-scrollbar">
                <el-menu :router="true" :default-active="$route.path">
                    <Menu :menuRoutes="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <div
            class="tab-bar"
            :style="{
                transition: 'all .5s ease',
                'grid-row': '1/2',
                'grid-column': expand ? '2/-1' : '4/-1',
                'z-index': expand ? 2 : 1,
                'background-color': 'var(--theme-sidebar-bg)',
            }"
        >
            <TableBar>
                <div @click="expand = !expand">
                    <span :class="['expand', 'iconfont', expand ? 'icon-right' : 'icon-left']">{{
                        expand ? "展开" : "收起"
                    }}</span>
                </div>
            </TableBar>
        </div>
        <div
            class="content"
            :style="{
                transition: 'all .5s ease',
                'grid-column': expand ? '2/-1' : '4/-1',
                'grid-row': '2/-1',
                'z-index': expand ? 2 : 1,
                'background-color': 'var(--theme-bg)',
            }"
        >
            <Main />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import Logo from "@/layout/logo/index.vue";
import Menu from "@/layout/menu/index.vue";
import TableBar from "@/layout/tablebar/index.vue";
import Main from "@/layout/main/index.vue";

// 用户相关的数据仓库
import useUserStore from "@/stores/modules/user.ts";
const userStore = useUserStore();
const $route = useRoute();

const expand = ref(false);
</script>

<style scoped lang="scss">
.layout-container {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-template-rows: repeat(20, 1fr);
    column-gap: 5px;
    background-color: $base-bg-color;

    .navigation {
        min-width: $base-menu-width;
        grid-column: 1 / 4;
        grid-row: 1 / -1;
        background-color: $base-menu-bg-color;
        border-right: 0.5px solid $base-border-color;
        box-shadow: 1px 0 5px var(--theme-shadow);
        user-select: none;
        overflow: hidden;
        text-overflow: ellipsis;
        position: fixed;
        top: 0;
        left: 0;

        .menu-scrollbar {
            max-height: 70%;
            width: 90%;
            :deep(.el-menu) {
                border-right: none;
                background-color: $base-menu-bg-color;
            }
        }
    }

    .tab-bar {
        min-height: $base-header-height;
        min-width: $base-header-width;
        grid-column: 4 / -1;
        grid-row: 1 / 2;
        background-color: $base-menu-bg-color;
        align-content: center;
        border-bottom: 0.5px solid $base-border-color;
        user-select: none;

        .expand {
            font-size: 14px;
            color: var(--theme-text-placeholder);
            display: flex;
            align-items: center;
            transition: all 0.5s ease;

            &:hover {
                color: var(--theme-text);
            }
        }
    }

    .content {
        min-width: $base-main-width;
        grid-column: 4 / -1;
        grid-row: 2 / -1;
        background-color: $base-menu-bg-color;
    }
}
</style>
