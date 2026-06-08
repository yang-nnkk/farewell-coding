<template>
    <div class="breadcrumb-container">
        <el-breadcrumb :separator-icon="ArrowRight" style="font-size: 13px; color: var(--theme-text-regular);">
            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path" :to="item.path">
                <template v-if="item.path !== '/'">
                    <span :class="['iconfont', item.meta.icon_path]"></span>
                    <span style="margin: 0 7px;">{{ item.meta.title }}</span>
                </template>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';

const $route = useRoute();
</script>

<style scoped></style>