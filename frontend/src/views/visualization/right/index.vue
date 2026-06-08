<template>
    <div class="right-container">
        <div class="top">
            <div class="title"><span>热门景区排行</span></div>
            <div class="chart" ref="chartDom1"></div>
        </div>
        <div class="center">
            <div class="title"><span>年度游客量对比</span></div>
            <div class="chart" ref="chartDom2"></div>
        </div>
        <div class="bottom">
            <div class="title"><span>预约渠道数据统计</span></div>
            <div class="chart" ref="chartDom3"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";

echarts.use([CanvasRenderer, GridComponent, TooltipComponent, LegendComponent, BarChart, LineChart, PieChart]);

const chartDom1 = ref<HTMLDivElement>();
const chartDom2 = ref<HTMLDivElement>();
const chartDom3 = ref<HTMLDivElement>();
let chart1: echarts.ECharts | null = null;
let chart2: echarts.ECharts | null = null;
let chart3: echarts.ECharts | null = null;

// Top - 热门景区排行
function initChart1() {
    chart1 = echarts.init(chartDom1.value);

    const scenicNames = ["故宫博物院", "长城八达岭", "西湖景区", "张家界", "九寨沟", "黄山", "鼓浪屿", "布达拉宫"];
    const scenicValues = [98, 92, 88, 83, 79, 75, 68, 62];
    const barColors = ["#ffd700", "#c0c0c0", "#cd7f32", "#389BB7", "#2d8aa7", "#227898", "#176688", "#0c5478"];

    const option: echarts.EChartsCoreOption = {
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: "rgba(0, 20, 40, 0.8)",
            borderColor: "#389BB7",
            textStyle: { color: "#fff" },
        },
        grid: {
            left: 130,
            right: 40,
            top: 10,
            bottom: 10,
        },
        xAxis: {
            type: "value",
            show: false,
            max: 110,
        },
        yAxis: {
            type: "category",
            data: scenicNames.reverse(),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: "#fff",
                fontSize: 12,
                width: 120,
                overflow: "truncate",
                formatter: (value: string) => {
                    const idx = scenicNames.indexOf(value);
                    const rank = scenicNames.length - idx;
                    const medal = rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : `${rank}.`;
                    return `{rank|${medal}}{name|${value}}`;
                },
                rich: {
                    rank: {
                        width: 30,
                        align: "left",
                        color: "#fff",
                        fontSize: 12,
                    },
                    name: {
                        width: 90,
                        align: "left",
                        color: "#fff",
                        fontSize: 12,
                        overflow: "truncate",
                    },
                },
            },
        },
        series: [
            {
                type: "bar",
                data: scenicValues.reverse().map((val, idx) => ({
                    value: val,
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: barColors[barColors.length - 1 - idx] ?? "#389BB7" },
                            { offset: 1, color: "rgba(56, 155, 183, 0.3)" },
                        ]),
                        borderRadius: [0, 4, 4, 0],
                    },
                })),
                barWidth: 14,
                label: {
                    show: true,
                    position: "right",
                    color: "#aaa",
                    fontSize: 12,
                    formatter: "{c}万",
                },
            },
        ],
    };

    chart1!.setOption(option);
}

// Center - 年度游客量对比
function initChart2() {
    chart2 = echarts.init(chartDom2.value);

    const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const thisYear = [120, 132, 101, 134, 190, 230, 210, 182, 195, 220, 185, 155];
    const lastYear = [90, 102, 81, 104, 150, 180, 170, 152, 160, 185, 150, 130];

    const option: echarts.EChartsCoreOption = {
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(0, 20, 40, 0.8)",
            borderColor: "#389BB7",
            textStyle: { color: "#fff" },
        },
        legend: {
            data: ["今年", "去年"],
            textStyle: { color: "#aaa", fontSize: 12 },
            right: 10,
            top: 0,
        },
        grid: {
            left: 40,
            right: 15,
            top: 30,
            bottom: 20,
        },
        xAxis: {
            type: "category",
            data: months,
            axisLine: { lineStyle: { color: "#389BB7" } },
            axisLabel: { color: "#aaa", fontSize: 10 },
            axisTick: { show: false },
        },
        yAxis: {
            type: "value",
            axisLine: { show: false },
            axisLabel: { color: "#aaa", fontSize: 10 },
            splitLine: { lineStyle: { color: "rgba(56, 155, 183, 0.15)" } },
        },
        series: [
            {
                name: "今年",
                type: "line",
                data: thisYear,
                smooth: true,
                symbol: "circle",
                symbolSize: 6,
                lineStyle: { color: "#389BB7", width: 2 },
                itemStyle: { color: "#389BB7" },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(56, 155, 183, 0.4)" },
                        { offset: 1, color: "rgba(56, 155, 183, 0)" },
                    ]),
                },
            },
            {
                name: "去年",
                type: "line",
                data: lastYear,
                smooth: true,
                symbol: "circle",
                symbolSize: 4,
                lineStyle: { color: "#f5a623", width: 1.5, type: "dashed" },
                itemStyle: { color: "#f5a623" },
            },
        ],
    };

    chart2!.setOption(option);
}

// Bottom - 预约渠道数据统计
function initChart3() {
    chart3 = echarts.init(chartDom3.value);

    const channelData = [
        { value: 35, name: "微信小程序" },
        { value: 25, name: "支付宝" },
        { value: 18, name: "官方网站" },
        { value: 15, name: "OTA平台" },
        { value: 7, name: "线下窗口" },
    ];

    const option: echarts.EChartsCoreOption = {
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(0, 20, 40, 0.8)",
            borderColor: "#389BB7",
            textStyle: { color: "#fff" },
            formatter: "{b}: {c}% ({d}%)",
        },
        legend: {
            orient: "vertical",
            right: 5,
            top: "center",
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 10,
            textStyle: {
                color: "#fff",
                fontSize: 11,
            },
            formatter: (name: string) => {
                const item = channelData.find((d) => d.name === name);
                return `${name}  ${item?.value}%`;
            },
        },
        series: [
            {
                type: "pie",
                radius: ["15%", "65%"],
                center: ["35%", "50%"],
                roseType: "area",
                label: {
                    show: false,
                },
                itemStyle: {
                    borderRadius: 6,
                    borderColor: "rgba(0, 20, 40, 0.8)",
                    borderWidth: 2,
                },
                data: channelData,
                color: ["#389BB7", "#f5a623", "#e74c3c", "#2ecc71", "#9b59b6"],
            },
        ],
    };

    chart3!.setOption(option);
}

onMounted(() => {
    initChart1();
    initChart2();
    initChart3();
});

onBeforeUnmount(() => {
    chart1?.dispose();
    chart2?.dispose();
    chart3?.dispose();
});
</script>

<style scoped lang="scss">
* {
    color: #fff;
    box-sizing: border-box;
}
.right-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .top,
    .center,
    .bottom {
        flex: 1;
        padding: 10px;
        background-color: rgba(0, 20, 40, 0.8);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;

        .title {
            height: 30px;
            line-height: 30px;
            font-size: 18px;
            flex-shrink: 0;
        }
        .chart {
            flex: 1;
            width: 100%;
        }
    }
}
</style>
