<template>
    <div class="trend-section">
        <div class="section-title">本周访问趋势</div>
        <div class="trend-chart" ref="trendRef"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import useThemeStore from "@/stores/layoutStore/useThemeStore";

echarts.use([CanvasRenderer, GridComponent, TooltipComponent, LineChart, LegendComponent]);

const themeStore = useThemeStore();
const trendRef = ref<HTMLDivElement>();
let trendChart: echarts.ECharts | null = null;

function getCssVar(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function initTrendChart() {
    trendChart = echarts.init(trendRef.value);
    const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const pv = [820, 932, 901, 1234, 1290, 1530, 1320];
    const uv = [320, 402, 451, 534, 590, 730, 620];

    const primary = getCssVar("--theme-primary") || "#389BB7";
    const textSecondary = getCssVar("--theme-text-secondary") || "#909399";
    const textPlaceholder = getCssVar("--theme-text-placeholder") || "#c0c4cc";
    const borderLight = getCssVar("--theme-border-light") || "#ebeef5";
    const cardBg = getCssVar("--theme-card-bg") || "#ffffff";
    const textColor = getCssVar("--theme-text") || "#303133";

    const option: echarts.EChartsCoreOption = {
        tooltip: {
            trigger: "axis",
            backgroundColor: cardBg,
            borderColor: borderLight,
            textStyle: { color: textColor },
        },
        legend: {
            data: ["页面浏览", "独立访客"],
            textStyle: { color: textSecondary, fontSize: 12 },
            right: 20,
            top: 5,
        },
        grid: { left: 50, right: 30, top: 35, bottom: 25 },
        xAxis: {
            type: "category",
            data: days,
            axisLine: { lineStyle: { color: borderLight } },
            axisLabel: { color: textPlaceholder },
            axisTick: { show: false },
        },
        yAxis: {
            type: "value",
            axisLine: { show: false },
            axisLabel: { color: textPlaceholder },
            splitLine: { lineStyle: { color: borderLight } },
        },
        series: [
            {
                name: "页面浏览",
                type: "line",
                data: pv,
                smooth: true,
                symbol: "circle",
                symbolSize: 6,
                lineStyle: { color: primary, width: 2 },
                itemStyle: { color: primary },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: primary + "4D" },
                        { offset: 1, color: primary + "00" },
                    ]),
                },
            },
            {
                name: "独立访客",
                type: "line",
                data: uv,
                smooth: true,
                symbol: "circle",
                symbolSize: 4,
                lineStyle: { color: "#f5a623", width: 1.5 },
                itemStyle: { color: "#f5a623" },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(245, 166, 35, 0.2)" },
                        { offset: 1, color: "rgba(245, 166, 35, 0)" },
                    ]),
                },
            },
        ],
    };
    trendChart.setOption(option);
}

function handleResize() {
    trendChart?.resize();
}

watch(
    () => [themeStore.isDark, themeStore.presetName, themeStore.customColor, themeStore.themeMode],
    () => {
        trendChart?.dispose();
        initTrendChart();
    },
);

onMounted(() => {
    initTrendChart();
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
    trendChart?.dispose();
});
</script>

<style scoped>
.trend-section {
    padding: 20px;
    border-radius: 14px;
    background: var(--theme-card-bg);
    border: 1px solid var(--theme-border-light);
    backdrop-filter: blur(10px);
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--theme-text);
    letter-spacing: 1px;
}

.trend-chart {
    width: 100%;
    height: 200px;
    margin-top: 10px;
}
</style>
