<template>
    <div class="header-container">
        <div class="left">
            <span @click="handleBack">返 回</span>
            <dv-decoration8 style="position: absolute; left: 0; bottom: -20px; width: 280px; height: 30px" />
        </div>
        <div class="center">
            基于Vue3+TypeScript的智慧旅游可视化大屏
            <dv-decoration5
                :dur="2"
                style="
                    width: 730px;
                    height: 40px;
                    position: absolute;
                    left: 50%;
                    bottom: -40px;
                    transform: translateX(-50%);
                "
            />
        </div>
        <div class="right">
            <span @click="handleRefresh">刷 新</span>
            <dv-decoration8
                :reverse="true"
                style="position: absolute; right: 0; bottom: -20px; width: 280px; height: 30px"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const handleBack = () => {
    // Handle back button click
    router.push("/home"); // Navigate to the home page
};

const handleRefresh = () => {
    // Handle refresh button click
    router.go(0); // Refresh the current page
};
</script>

<style scoped lang="scss">
* {
    color: #fff;
}

.header-container {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    // border-bottom: 1px solid #fff;
    .left {
        height: 100%;
        flex: 1;
        text-align: center;
        align-content: center;
        position: relative;
        font-size: 20px;
        text-shadow: 0 0 15px #fff;

        span {
            display: block;
            transition: all 0.3s ease;
            &:hover {
                cursor: pointer;
                transform: scale(1.5);
                letter-spacing: 5px;
            }
        }
    }
    .center {
        height: 100%;
        flex: 4;
        text-align: center;
        align-content: center;
        position: relative;
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 5px;
    }
    .right {
        height: 100%;
        flex: 1;
        text-align: center;
        align-content: center;
        position: relative;
        font-size: 20px;
        text-shadow: 0 0 15px #fff;

        span {
            display: block;
            transition: all 0.3s ease;
            &:hover {
                cursor: pointer;
                transform: scale(1.5);
                letter-spacing: 5px;
            }
        }
    }
}
</style>
