<template>
    <div class="visualization-container">
        <div class="visualization-box">
            <Header />
            <div class="main-container">
                <div class="left">
                    <Left />
                </div>
                <div class="center">
                    <Map />
                </div>
                <div class="right">
                    <Right />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, defineAsyncComponent } from "vue";
import Header from "./header/index.vue";
const Left = defineAsyncComponent(() => import("./left/index.vue"));
const Map = defineAsyncComponent(() => import("./map/index.vue"));
const Right = defineAsyncComponent(() => import("./right/index.vue"));

function getScale(w = 1920, h = 1080) {
    const window_w = window.innerWidth;
    const window_h = window.innerHeight;
    const scale_w = window_w / w;
    const scale_h = window_h / h;
    return Math.min(scale_w, scale_h);
}

function init() {
    const box = document.querySelector(".visualization-box") as HTMLDivElement;
    const scale = getScale();
    box.style.transform = `scale(${scale}) translate(-50%, -50%)`;
}

const debounce = (func: Function, delay: number) => {
    let timer: number | null = null;
    const that = this;
    const debouncedFunction = function (...args: any[]) {
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
            func.apply(that, args);
        }, delay);
    };

    debouncedFunction.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debouncedFunction;
};

const debouncedInit = debounce(init, 100);

onMounted(() => {
    init();
    window.addEventListener("resize", debouncedInit);
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", debouncedInit);
    // Cancel any pending debounced calls
    debouncedInit.cancel();
});
</script>

<style scoped>
.visualization-container {
    width: 100vw;
    height: 100vh;
    background-image: url("/visualiaztion-bg.jpg");
    background-size: cover;
    position: relative;
}

.visualization-box {
    width: 1920px;
    height: 1080px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: top left;

    .main-container {
        width: 100%;
        height: 980px;
        margin-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        .left,
        .right {
            flex: 2;
            height: 100%;
        }
        .center {
            flex: 5;
            height: 100%;
        }
    }
}
</style>
