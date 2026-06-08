<template>
    <div class="map-container">
        <div class="map-chart" ref="mapRef"></div>
        <div class="predict" ref="predictRef"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts/core";
import { MapChart, LinesChart, EffectScatterChart, LineChart } from "echarts/charts";
import { GeoComponent, TooltipComponent, GridComponent, LegendComponent, TitleComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import chinaJson from "./china.json";

echarts.use([
    CanvasRenderer,
    GeoComponent,
    MapChart,
    LinesChart,
    EffectScatterChart,
    TooltipComponent,
    LineChart,
    GridComponent,
    LegendComponent,
    TitleComponent,
]);

const mapRef = ref<HTMLDivElement>();
const predictRef = ref<HTMLDivElement>();
let myChart: echarts.ECharts | null = null;
let predictChart: echarts.ECharts | null = null;

// 城市坐标 [经度, 纬度]
const cityCoords: Record<string, number[]> = {
    北京: [116.46, 39.92],
    上海: [121.48, 31.22],
    广州: [113.23, 23.16],
    成都: [104.06, 30.67],
    拉萨: [91.11, 29.97],
    西安: [108.95, 34.27],
    杭州: [120.19, 30.26],
    昆明: [102.73, 25.04],
    哈尔滨: [126.63, 45.75],
    乌鲁木齐: [87.68, 43.77],
    三亚: [109.51, 18.25],
    深圳: [114.07, 22.62],
    重庆: [106.54, 29.59],
    武汉: [114.31, 30.52],
    南京: [118.78, 32.04],
};

// 航线数据
const flightRoutes = [
    { from: "北京", to: "上海" },
    { from: "北京", to: "广州" },
    { from: "北京", to: "成都" },
    { from: "北京", to: "拉萨" },
    { from: "北京", to: "乌鲁木齐" },
    { from: "上海", to: "昆明" },
    { from: "上海", to: "三亚" },
    { from: "广州", to: "成都" },
    { from: "成都", to: "拉萨" },
    { from: "西安", to: "杭州" },
    { from: "哈尔滨", to: "深圳" },
    { from: "重庆", to: "武汉" },
    { from: "南京", to: "昆明" },
    { from: "武汉", to: "三亚" },
];

// 旅游热点城市
const hotCities = ["北京", "上海", "广州", "成都", "拉萨", "西安", "杭州", "昆明", "三亚", "乌鲁木齐"];

function initMap() {
    echarts.registerMap("china", chinaJson as any);

    myChart = echarts.init(mapRef.value);

    const option: echarts.EChartsCoreOption = {
        tooltip: {
            trigger: "item",
            backgroundColor: "rgba(0, 20, 40, 0.8)",
            borderColor: "#389BB7",
            textStyle: { color: "#fff" },
            formatter: (params: any) => {
                if (params.seriesType === "effectScatter") {
                    return `<b>${params.name}</b><br/>热门旅游城市`;
                }
                if (params.seriesType === "lines") {
                    return `${params.data.from} → ${params.data.to}`;
                }
                return params.name;
            },
        },
        geo: {
            map: "china",
            zoom: 1.6,
            center: [104.5, 36],
            label: {
                show: false,
                color: "#fff",
                fontSize: 12,
            },
            itemStyle: {
                areaColor: "rgba(19, 48, 81, 0.6)",
                borderColor: "#389BB7",
                borderWidth: 1,
                shadowBlur: 15,
                shadowColor: "rgba(56, 155, 183, 0.5)",
            },
            emphasis: {
                label: {
                    show: true,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "bold",
                },
                itemStyle: {
                    areaColor: "#389BB7",
                    shadowBlur: 30,
                    shadowColor: "rgba(56, 155, 183, 0.8)",
                },
            },
            select: {
                disabled: true,
            },
        },
        series: [
            // 航线
            {
                type: "lines",
                coordinateSystem: "geo",
                zlevel: 2,
                effect: {
                    show: true,
                    period: 5,
                    trailLength: 0.2,
                    symbol: "arrow",
                    symbolSize: 8,
                    color: "#fff",
                },
                lineStyle: {
                    color: "#389BB7",
                    width: 1.5,
                    opacity: 0.6,
                    curveness: 0.3,
                },
                data: flightRoutes.map((route) => ({
                    from: route.from,
                    to: route.to,
                    coords: [cityCoords[route.from], cityCoords[route.to]],
                })),
            },
            // 城市涟漪标记
            {
                type: "effectScatter",
                coordinateSystem: "geo",
                zlevel: 3,
                rippleEffect: {
                    brushType: "stroke",
                    period: 4,
                    scale: 5,
                },
                label: {
                    show: true,
                    position: "right",
                    formatter: "{b}",
                    color: "#fff",
                    fontSize: 11,
                },
                itemStyle: {
                    color: "#389BB7",
                    shadowBlur: 10,
                    shadowColor: "rgba(56, 155, 183, 0.8)",
                },
                data: hotCities.map((city) => ({
                    name: city,
                    value: cityCoords[city],
                })),
            },
        ],
    };

    myChart.setOption(option);
}

// 生成未来30天预测数据
function generatePredictData() {
    const dates: string[] = [];
    const actual: number[] = [];
    const predicted: number[] = [];
    const now = new Date();
    for (let i = -9; i <= 30; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() + i);
        const label = `${d.getMonth() + 1}/${d.getDate()}`;
        dates.push(label);
        if (i <= 0) {
            const val = Math.round(8000 + Math.random() * 4000 + Math.sin(i / 3) * 1500);
            actual.push(val);
            predicted.push(null as any);
        } else {
            actual.push(null as any);
            const val = Math.round(9000 + Math.random() * 3000 + Math.sin(i / 3) * 1500 + i * 80);
            predicted.push(val);
        }
    }
    // 衔接点：预测从实际最后一个值开始
    let lastActualIdx = -1;
    for (let i = actual.length - 1; i >= 0; i--) {
        if (actual[i] !== null) {
            lastActualIdx = i;
            break;
        }
    }
    if (lastActualIdx >= 0 && lastActualIdx + 1 < predicted.length) {
        predicted[lastActualIdx] = actual[lastActualIdx] as number;
    }
    return { dates, actual, predicted };
}

function initPredictChart() {
    predictChart = echarts.init(predictRef.value);
    const { dates, actual, predicted } = generatePredictData();

    const option: echarts.EChartsCoreOption = {
        title: {
            text: "未来30天客流预测",
            left: 20,
            top: 10,
            textStyle: { color: "#fff", fontSize: 14, fontWeight: "bold" },
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(0, 20, 40, 0.8)",
            borderColor: "#389BB7",
            textStyle: { color: "#fff" },
        },
        legend: {
            data: ["实际客流", "预测客流"],
            textStyle: { color: "#aaa", fontSize: 12 },
            right: 20,
            top: 5,
        },
        grid: {
            left: 50,
            right: 20,
            top: 35,
            bottom: 25,
        },
        xAxis: {
            type: "category",
            data: dates,
            axisLine: { lineStyle: { color: "#389BB7" } },
            axisLabel: { color: "#aaa", fontSize: 10, interval: 4 },
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
                name: "实际客流",
                type: "line",
                data: actual,
                smooth: true,
                symbol: "none",
                lineStyle: { color: "#389BB7", width: 2 },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(56, 155, 183, 0.4)" },
                        { offset: 1, color: "rgba(56, 155, 183, 0)" },
                    ]),
                },
            },
            {
                name: "预测客流",
                type: "line",
                data: predicted,
                smooth: true,
                symbol: "none",
                lineStyle: { color: "#f5a623", width: 2, type: "dashed" },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(245, 166, 35, 0.25)" },
                        { offset: 1, color: "rgba(245, 166, 35, 0)" },
                    ]),
                },
            },
        ],
    };

    predictChart.setOption(option);
}

function handleResize() {
    myChart?.resize();
    predictChart?.resize();
}

onMounted(() => {
    initMap();
    initPredictChart();
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", handleResize);
    myChart?.dispose();
    myChart = null;
    predictChart?.dispose();
    predictChart = null;
});
</script>

<style scoped lang="scss">
.map-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 0;

    .map-chart {
        flex: 7;
        width: 95%;
        margin: 0 auto;
        border-radius: 15px;
        background-color: rgba(0, 20, 40, 0.8);
        box-shadow: 0 0 20px rgba(56, 155, 183, 0.5);
    }

    .predict {
        flex: 3;
        width: 95%;
        margin: 10px auto 0;
        border-radius: 15px;
        background-color: rgba(0, 20, 40, 0.8);
        box-shadow: 0 0 20px rgba(56, 155, 183, 0.5);
    }
}
</style>
