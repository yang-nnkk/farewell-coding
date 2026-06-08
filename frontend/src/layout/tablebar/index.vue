<template>
    <div class="tablebar-container">
        <div class="tablebar-left">
            <div>
                <slot></slot>
            </div>
            <div>
                <Breadcrumb />
            </div>
        </div>
        <div class="tablebar-right">
            <RightEdit />
        </div>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import RightEdit from './rightedit/index.vue'

</script>

<style scoped lang="scss">
.tablebar-container {
    width: 100%;
    height: 100%;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tablebar-left {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .tablebar-right {
        display: flex;
        align-items: center;
    }
}
</style>