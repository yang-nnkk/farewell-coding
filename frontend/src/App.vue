<template>
    <div class="app">
        <router-view v-slot="{ Component }">
            <transition name="view" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.app {
    width: 100%;
    height: 100%;
}

.view-enter-active,
.view-leave-active {
    transition: opacity .3s ease;
}

.view-enter-from,
.view-leave-to {
    opacity: 0;
}

.view-enter-to {
    opacity: 1;
}
</style>