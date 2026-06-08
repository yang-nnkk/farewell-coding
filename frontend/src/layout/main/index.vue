<template>
    <div class="main-container">
        <router-view v-slot="{ Component }">
            <transition name="main-content" mode="out-in">
                <component :is="Component" v-if="flag" />
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue';
import useLayoutSetting from '@/stores/layoutStore/useLyoutSetting';

// 引入仓库刷新状态
const layoutSettingStore = useLayoutSetting();

const flag = ref(true);


watch(() => layoutSettingStore.refresh, () => {
    flag.value = false;
    nextTick(() => {
        flag.value = true;
    });

});


</script>

<style scoped>
.main-container {
    overflow: hidden;
}

.main-content-enter-active,
.main-content-leave-active {
    transition: opacity .3s ease-in;
}

.main-content-enter-from,
.main-content-leave-to {
    opacity: 0;
}

.main-content-enter-to {
    opacity: 1;
}
</style>