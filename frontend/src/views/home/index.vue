<template>
    <div class="home-container">
        <!-- 欢迎横幅 -->
        <div class="welcome-banner">
            <div class="banner-left">
                <h2 class="greeting">{{ greeting }}，{{ username }}</h2>
                <p class="sub-text">欢迎使用苍穹管理系统，今天也是充满希望的一天</p>
            </div>
            <div class="banner-right">
                <div class="time-display">
                    <span class="time">{{ currentTime }}</span>
                    <span class="date">{{ currentDate }}</span>
                </div>
                <dv-decoration6 :dur="3" style="width: 120px; height: 30px" />
            </div>
        </div>

        <!-- 统计卡片 -->
        <div class="stats-row">
            <div v-for="(stat, idx) in stats" :key="idx" class="stat-card" :style="{ '--accent': stat.color }">
                <div class="stat-icon">
                    <span :class="stat.icon"></span>
                </div>
                <div class="stat-info">
                    <span class="stat-value">{{ stat.value }}</span>
                    <span class="stat-label">{{ stat.label }}</span>
                </div>
                <div class="stat-trend" :class="stat.trendUp ? 'up' : 'down'">
                    {{ stat.trendUp ? "+" : "" }}{{ stat.trend }}%
                </div>
            </div>
        </div>

        <!-- 中间区域：导航 + 活动 -->
        <div class="middle-section">
            <!-- 快捷导航 -->
            <div class="nav-section">
                <div class="section-title">快捷导航</div>
                <div class="nav-grid">
                    <div v-for="(nav, idx) in navItems" :key="idx" class="nav-card" @click="$router.push(nav.path)">
                        <div class="nav-icon" :style="{ background: nav.gradient }">
                            <span :class="nav.icon"></span>
                        </div>
                        <div class="nav-text">
                            <span class="nav-name">{{ nav.name }}</span>
                            <span class="nav-desc">{{ nav.desc }}</span>
                        </div>
                        <span class="nav-arrow">→</span>
                    </div>
                </div>
            </div>

            <!-- 最近活动 -->
            <div class="activity-section">
                <div class="section-title">最近活动</div>
                <div class="activity-list">
                    <div v-for="(act, idx) in activities" :key="idx" class="activity-item">
                        <div class="activity-dot" :style="{ background: act.color }"></div>
                        <div class="activity-content">
                            <span class="activity-text">{{ act.text }}</span>
                            <span class="activity-time">{{ act.time }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部趋势图 -->
        <TrendChart />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from "vue";
// 导入仓库
import useUserStore from "@/stores/modules/user";

const TrendChart = defineAsyncComponent(() => import("./TrendChart.vue"));

const username = ref("");
const userStore = useUserStore();
username.value = userStore.username || "";

// 时间
const now = ref(new Date());
let timer: number;

const greeting = computed(() => {
    const h = now.value.getHours();
    if (h >= 5 && h < 12) return "早上好";
    if (h >= 12 && h < 18) return "下午好";
    return "晚上好";
});

const currentTime = computed(() => {
    return now.value.toLocaleTimeString("zh-CN", { hour12: false });
});

const currentDate = computed(() => {
    const d = now.value;
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekdays[d.getDay()]}`;
});

// 统计数据
const stats = ref([
    {
        label: "今日访问",
        value: "12,846",
        icon: "iconfont icon-shouye",
        color: "#389BB7",
        trend: "12.5",
        trendUp: true,
    },
    { label: "新增用户", value: "1,024", icon: "iconfont icon-User", color: "#f5a623", trend: "8.3", trendUp: true },
    {
        label: "预约总数",
        value: "3,567",
        icon: "iconfont icon-shujukeshihua",
        color: "#2ecc71",
        trend: "5.1",
        trendUp: true,
    },
    {
        label: "系统消息",
        value: "28",
        icon: "iconfont icon-zhanghaoquanxianguanli",
        color: "#e74c3c",
        trend: "3.2",
        trendUp: false,
    },
]);

// 快捷导航
const navItems = ref([
    {
        name: "数据大屏",
        desc: "可视化旅游数据",
        icon: "iconfont icon-shujukeshihua",
        path: "/visualization",
        gradient: "linear-gradient(135deg, #389BB7, #1a5276)",
    },
    {
        name: "用户管理",
        desc: "管理后台用户",
        icon: "iconfont icon-User",
        path: "/acl/user",
        gradient: "linear-gradient(135deg, #f5a623, #c07812)",
    },
    {
        name: "角色管理",
        desc: "分配角色权限",
        icon: "iconfont icon-menu_role",
        path: "/acl/role",
        gradient: "linear-gradient(135deg, #2ecc71, #1a8a4a)",
    },
    {
        name: "商品管理",
        desc: "SKU / SPU 管理",
        icon: "iconfont icon-shangpinguanli1",
        path: "/product/sku",
        gradient: "linear-gradient(135deg, #9b59b6, #6c3483)",
    },
]);

// 活动记录
const activities = ref([
    { text: "用户 张三 完成了故宫博物院预约", time: "3分钟前", color: "#389BB7" },
    { text: "系统更新了全国景区热力数据", time: "15分钟前", color: "#2ecc71" },
    { text: "用户 李四 修改了个人信息", time: "1小时前", color: "#f5a623" },
    { text: "新增角色「数据分析师」", time: "2小时前", color: "#9b59b6" },
    { text: "SPU「长城一日游」上架成功", time: "3小时前", color: "#e74c3c" },
    { text: "系统完成每日数据备份", time: "6小时前", color: "#389BB7" },
]);

onMounted(() => {
    timer = window.setInterval(() => {
        now.value = new Date();
    }, 1000);
});

onBeforeUnmount(() => {
    clearInterval(timer);
});
</script>

<style scoped lang="scss">
.home-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--theme-bg);
    overflow-y: auto;
}

/* 欢迎横幅 */
.welcome-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 30px;
    border-radius: 16px;
    background: var(--theme-primary-bg);
    border: 1px solid var(--theme-border);
    backdrop-filter: blur(12px);

    .banner-left {
        .greeting {
            font-size: 26px;
            font-weight: 600;
            color: var(--theme-text);
            margin-bottom: 8px;
            letter-spacing: 2px;
        }
        .sub-text {
            font-size: 14px;
            color: var(--theme-text-secondary);
        }
    }

    .banner-right {
        display: flex;
        align-items: center;
        gap: 20px;

        .time-display {
            text-align: right;
            .time {
                display: block;
                font-size: 32px;
                font-weight: 300;
                color: var(--theme-primary);
                letter-spacing: 3px;
                font-variant-numeric: tabular-nums;
            }
            .date {
                display: block;
                font-size: 13px;
                color: var(--theme-text-placeholder);
                margin-top: 4px;
            }
        }
    }
}

/* 统计卡片 */
.stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .stat-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 20px;
        border-radius: 14px;
        background: var(--theme-card-bg);
        border: 1px solid var(--theme-border-light);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        cursor: default;

        &:hover {
            transform: translateY(-4px);
            background: var(--theme-hover-bg);
            border-color: var(--accent);
            box-shadow:
                0 8px 30px var(--theme-shadow),
                0 0 20px color-mix(in srgb, var(--accent) 30%, transparent);
        }

        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: color-mix(in srgb, var(--accent) 15%, transparent);
            .iconfont {
                font-size: 22px;
                color: var(--accent);
            }
        }

        .stat-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            .stat-value {
                font-size: 22px;
                font-weight: 600;
                color: var(--theme-text);
                font-variant-numeric: tabular-nums;
            }
            .stat-label {
                font-size: 12px;
                color: var(--theme-text-secondary);
                margin-top: 4px;
            }
        }

        .stat-trend {
            font-size: 12px;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 6px;
            &.up {
                color: #2ecc71;
                background: rgba(46, 204, 113, 0.12);
            }
            &.down {
                color: #e74c3c;
                background: rgba(231, 76, 60, 0.12);
            }
        }
    }
}

/* 中间区域 */
.middle-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    flex: 1;
    min-height: 0;
}

/* 快捷导航 */
.nav-section {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 14px;
    background: var(--theme-card-bg);
    border: 1px solid var(--theme-border-light);
    backdrop-filter: blur(10px);

    .nav-grid {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 14px;
    }

    .nav-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        border-radius: 10px;
        background: var(--theme-bg);
        border: 1px solid var(--theme-border-light);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: var(--theme-hover-bg);
            border-color: var(--theme-primary);
            transform: translateX(6px);

            .nav-arrow {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .nav-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            .iconfont {
                font-size: 18px;
                color: #fff;
            }
        }

        .nav-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            .nav-name {
                font-size: 14px;
                color: var(--theme-text);
                font-weight: 500;
            }
            .nav-desc {
                font-size: 11px;
                color: var(--theme-text-placeholder);
                margin-top: 2px;
            }
        }

        .nav-arrow {
            font-size: 16px;
            color: var(--theme-text-placeholder);
            opacity: 0;
            transform: translateX(-8px);
            transition: all 0.3s ease;
        }
    }
}

/* 最近活动 */
.activity-section {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 14px;
    background: var(--theme-card-bg);
    border: 1px solid var(--theme-border-light);
    backdrop-filter: blur(10px);

    .activity-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 14px;
        overflow-y: auto;
    }

    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 10px 8px;
        border-radius: 8px;
        transition: background 0.2s;

        &:hover {
            background: var(--theme-hover-bg);
        }

        .activity-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-top: 6px;
            flex-shrink: 0;
            box-shadow: 0 0 8px currentColor;
        }

        .activity-content {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .activity-text {
                font-size: 13px;
                color: var(--theme-text-regular);
            }
            .activity-time {
                font-size: 11px;
                color: var(--theme-text-placeholder);
                flex-shrink: 0;
                margin-left: 10px;
            }
        }
    }
}

/* 通用标题 */
.section-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--theme-text);
    letter-spacing: 1px;
}
</style>
