<template>
    <div class="logo-container">
        <div class="logo" v-show="logoshow">
            <img :src="themeStore.isDark ? '/public/logo1.svg' : logo">
        </div>
        <div class="title">{{ title }}</div>
    </div>
</template>

<script setup lang="ts">
import settings from "@/settings"
import useThemeStore from "@/stores/layoutStore/useThemeStore"

const themeStore = useThemeStore()
const { logo, title, logoshow } = settings

</script>

<style scoped lang="scss">

.logo-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
    padding: 10px 0;
    .logo {
        width: 20%;
        aspect-ratio: 1;
        border-radius: 50%;
        margin-right: 10px;
        overflow: hidden;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
    }
    .title {
        width: 150px;
        font-size: 20px;
        color: var(--theme-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

}

</style>