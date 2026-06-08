<template>
    <div class="left-container">
        <div class="top">
            <div style="margin-bottom: 10px">
                <span>当前可预约人数</span>
                <span style="position: absolute; top: 10px; right: 10px; letter-spacing: 1px; font-size: 18px">
                    {{ moment(time).format("YYYY-MM-DD HH:mm:ss") }}
                </span>
            </div>
            <dv-decoration2 :dur="2" style="width: 100%; height: 30px" />

            <div class="products-num">
                <span v-for="(item, index) in products" :key="index" class="num-item">
                    {{ item }}
                </span>
            </div>
            <div class="charts" ref="chartDom1"></div>
        </div>
        <div class="center">
            <div class="title">
                <span style="font-size: 18px">男女比例</span>
            </div>
            <div class="sex">
                <span class="iconfont icon-nan"></span>
                <span class="iconfont icon-nvshangjia icon-nv"></span>
            </div>
            <div class="num"><span>58%</span><span>42%</span></div>
            <div class="bili" ref="chartDom2"></div>
        </div>
        <div class="bottom">
            <div class="title"><span>年龄比例</span></div>
            <div class="chart3" ref="chartDom3"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts/core";
import { BarChart, PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent, TitleComponent, LegendComponent } from "echarts/components";
import moment from "moment";

import "echarts-liquidfill";

const time = ref();

const products = ref(["1", "4", "6", "8", "9", "7", "6", "人"]);
const chartDom1 = ref<HTMLDivElement>();
const chartDom2 = ref<HTMLDivElement>();
const chartDom3 = ref<HTMLDivElement>();
echarts.use([CanvasRenderer, GridComponent, TitleComponent, LegendComponent, BarChart, PieChart]);

const timer = setInterval(() => {
    time.value += 1000;
}, 1000);

function initChart1() {
    // 获取时间
    time.value = Date.now();
    const myChart1 = echarts.init(chartDom1.value);
    const option = {
        series: [
            {
                type: "liquidFill",
                data: [0.6, 0.5, 0.4],
                color: ["rgba(0, 180, 255, 0.4)", "rgba(0, 180, 255, 0.6)", "rgba(0, 180, 255, 1)"],
                itemStyle: {
                    borderWidth: 0,
                    shadowBlur: 0,
                },
                emphasis: {
                    itemStyle: {},
                },
                outline: {
                    show: false,
                },
                radius: "50%",
            },
        ],
    };
    myChart1.setOption(option);
}

function initChart2() {
    const myChart2 = echarts.init(chartDom2.value);
    const option = {
        series: [
            {
                type: "bar",
                data: [58],
                barWidth: 30,
                itemStyle: {
                    color: "rgb(19, 148, 235)",
                },
            },
            {
                type: "bar",
                data: [100],
                barWidth: 30,
                barGap: "-100%",
                // z-index设置为-1，确保背景柱在底层
                z: -1,
                itemStyle: {
                    color: "rgb(229, 152, 164)",
                },
            },
        ],
        xAxis: {
            show: false,
            min: 0,
            max: 100,
        },
        yAxis: {
            show: false,
            type: "category",
        },
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        itemStyle: {
            color: "rgba(255, 0, 0, 0.8)",
            borderRadius: 150,
        },
    };
    myChart2.setOption(option);
}

function initChart3() {
    const myChart3 = echarts.init(chartDom3.value);
    // 完整ECharts配置

    const pieData = [
        { value: 10, name: "12岁以下" },
        { value: 50, name: "12-20岁" },
        { value: 25, name: "20-30岁" },
        { value: 10, name: "30-40岁" },
        { value: 5, name: "40岁以上" },
    ];

    // 计算总数用于
    const tital = pieData.reduce((sum, item) => sum + item.value, 0);

    const option = {
        legend: {
            orient: "vertical",
            right: "0", // 建议用 right 代替过时的 x 属性
            top: "center",
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 12,
            textStyle: {
                fontSize: 12,
                color: "#fff",
                fontWeight: 500,
            },
            data: pieData.map((item) => ({
                name: `${item.name} -- ${((item.value / tital) * 100).toFixed(1)}%`,
            })),
        },
        series: [
            {
                type: "pie",
                radius: ["20%", "50%"],
                center: ["27%", "50%"],
                avoidLabelOverlap: true, // 建议改成true，自动避免标签重叠
                itemStyle: {
                    borderRadius: 10,
                    borderColor: "#fff",
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    position: "inside",
                    formatter: "{d}%", // {c} 代表数据项的 value 值
                    fontSize: 10,
                    fontWeight: 500,
                    color: "#fff", // 白色文字在彩色扇区上更清晰
                },
                labelLine: {
                    show: false,
                },
                emphasis: {
                    scale: true,
                    scaleSize: 6,
                    itemStyle: {
                        shadowBlur: 25,
                        shadowColor: "rgba(0,0,0,0.8)",
                    },
                },
                data: pieData.map((item) => ({
                    value: item.value,
                    name: `${item.name} -- ${((item.value / tital) * 100).toFixed(1)}%`,
                })),
            },
        ],
    };
    myChart3.setOption(option);
}

onMounted(() => {
    initChart1();
    initChart2();
    initChart3();
});
onBeforeUnmount(() => {
    clearInterval(timer);
    time.value = null;
});
</script>

<style scoped lang="scss">
* {
    color: #fff;
    box-sizing: border-box;
}
.left-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .top {
        flex-shrink: 0;
        flex-grow: 0;
        flex: 3;
        padding: 10px;
        background-color: rgba(0, 20, 40, 0.8);
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(56, 155, 183, 0.5);
        margin-bottom: 10px;

        .products-num {
            display: flex;
            justify-content: center;
            .num-item {
                width: 30px;
                height: 30px;
                line-height: 30px;
                font-size: 24px;
                text-align: center;
                margin: 5px 1px;
                border: 0.5px solid #fff;
                box-shadow:
                    0 0 5px rgb(10, 243, 212),
                    inset 0 0 5px #fff;
                border-radius: 4px;
            }
        }
        .charts {
            width: 220px;
            height: 220px;
            margin: 0 auto;
            position: relative;

            &::before {
                content: "";
                display: block;
                width: 76%;
                height: 76%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-130deg);
                border: 4px dashed rgba(22, 255, 205, 0.8);
                border-left: none;
                border-top: none;
                border-radius: 50%;
            }
        }
    }
    .center {
        flex-shrink: 0;
        flex-grow: 0;
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        padding: 0 10px;
        border-radius: 10px;
        background-color: rgba(0, 20, 40, 0.8);
        box-shadow: 0 0 20px rgba(56, 155, 183, 0.5);
        margin-bottom: 10px;
        .sex {
            flex: auto;
            width: 100%;
            display: flex;
            justify-content: center;
            .iconfont {
                font-size: 60px;
                margin: 0 20px;
            }
            .icon-nan {
                color: rgb(19, 148, 235);
            }
            .icon-nv {
                color: rgb(229, 152, 164);
            }
        }
        .title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            margin-left: 20px;
        }
        .num {
            display: flex;
            padding: 0 20px;
            justify-content: space-between;
            width: 100%;
            span {
                font-size: 18px;
                height: 20px;
                width: 40px;
                text-align: center;
            }
        }
        .bili {
            width: 100%;
            height: 90px;
        }
    }
    .bottom {
        flex-shrink: 0;
        flex-grow: 0;
        flex: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 0 10px;
        background-color: rgba(0, 20, 40, 0.8);
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(56, 155, 183, 0.5);
        .title {
            display: flex;
            width: 100%;
            height: 20px;
            font-size: 18px;
            text-align: left;
            align-items: center;
            flex: 1;
        }
        .chart3 {
            flex: 5;
            width: 100%;
            height: 100px;
        }
    }
}
</style>
