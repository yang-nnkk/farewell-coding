<template>
    <div class="rightedit-conatiner">
        <div class="edit">
            <template v-for="item in buttonItems" :key="item.title">
                <div>
                    <el-tooltip :content="item.title" placement="top" :show-after="800" effect="light">
                        <el-button size="small" circle @click="item.function">
                            <span :class="`iconfont ${item.icon}`"></span>
                        </el-button>
                    </el-tooltip>
                </div>
            </template>
        </div>
        <div class="avatar">
            <img :src="userStore.avatar"
                style="width: 35px;height: 35px; display: block; object-fit: cover;border-radius: 50%;">
        </div>
        <div class="loginout">
            <el-dropdown style="height: 40px;">
                <div class="name">{{ userStore.username }}</div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

    </div>

    <!-- 设置抽屉 - 放在组件根级，用 Teleport 传到 body -->
    <Teleport to="body">
        <div v-if="drawerVisible" class="theme-drawer-overlay" @click.self="drawerVisible = false">
            <div class="theme-drawer-panel">
                <div class="theme-drawer-header">
                    <span>主题设置</span>
                    <span class="theme-drawer-close" @click="drawerVisible = false">✕</span>
                </div>
                <div class="theme-drawer-body">
                    <div class="theme-section">
                        <div class="theme-label">主题模式</div>
                        <div class="mode-group">
                            <div v-for="mode in modeOptions" :key="mode.value" class="mode-card"
                                :class="{ active: themeStore.themeMode === mode.value }"
                                @click="handleModeChange(mode.value)">
                                <span :class="mode.icon"></span>
                                <span>{{ mode.label }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 预设主题 -->
                    <div v-if="themeStore.themeMode === 'preset'" class="theme-section">
                        <div class="theme-label">预设主题</div>
                        <div class="preset-grid">
                            <div v-for="theme in presetThemes" :key="theme.name" class="preset-card"
                                :class="{ active: themeStore.presetName === theme.name }"
                                @click="themeStore.setPreset(theme.name)">
                                <div class="preset-color" :style="{ background: theme.light.primary }"></div>
                                <span class="preset-name">{{ theme.name }}</span>
                                <span v-if="themeStore.presetName === theme.name" class="check-icon">✓</span>
                            </div>
                        </div>
                    </div>

                    <!-- 自定义颜色 -->
                    <div v-if="themeStore.themeMode === 'custom'" class="theme-section">
                        <div class="theme-label">自定义颜色</div>
                        <div class="custom-color-row">
                            <el-color-picker
                                :model-value="customColor"
                                @active-change="(val: string) => { customColor = val; themeStore.setCustom(val) }"
                                @change="(val: string | null) => { if (val) { customColor = val; themeStore.setCustom(val) } }"
                            />
                            <span class="color-hex">{{ customColor }}</span>
                        </div>
                    </div>

                    <!-- 深色模式 -->
                    <div class="theme-section">
                        <div class="theme-label">深色模式</div>
                        <el-switch v-model="isDark" @change="handleDarkChange" :disabled="themeStore.themeMode === 'system'" />
                        <span class="dark-hint" v-if="themeStore.themeMode === 'system'">跟随系统时自动切换</span>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import useLayoutSetting from '@/stores/layoutStore/useLyoutSetting'
import useUserStore from '@/stores/modules/user'
import useThemeStore, { presetThemes } from '@/stores/layoutStore/useThemeStore'
import type { ThemeMode } from '@/stores/layoutStore/useThemeStore'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'

const layoutSettingStore = useLayoutSetting()
const userStore = useUserStore()
const themeStore = useThemeStore()
const $router = useRouter()

// 抽屉
const drawerVisible = ref(false)
const customColor = ref(themeStore.customColor)
const isDark = ref(themeStore.isDark)

watch(() => themeStore.isDark, (v) => { isDark.value = v })
watch(() => themeStore.customColor, (v) => { customColor.value = v })

const modeOptions = [
    { value: 'preset' as ThemeMode, label: '预设主题', icon: 'iconfont icon-shouye' },
    { value: 'system' as ThemeMode, label: '跟随系统', icon: 'iconfont icon-shuaxin' },
    { value: 'custom' as ThemeMode, label: '自定义', icon: 'iconfont icon-shezhi' },
]

function handleModeChange(mode: ThemeMode) {
    if (mode === 'system') {
        themeStore.setSystemMode()
    } else {
        themeStore.themeMode = mode
        themeStore.applyTheme()
    }
}

function handleCustomChange(color: string | null) {
    if (color) themeStore.setCustom(color)
}

function handleDarkChange(val: boolean) {
    themeStore.setDarkMode(val)
}

// 刷新页面
const refresh = () => {
    layoutSettingStore.refresh = !layoutSettingStore.refresh
}

// 全屏模式
const fullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

// 设置
const setting = () => {
    drawerVisible.value = true
}

const buttonItems = reactive([
    { icon: 'icon-shuaxin', title: '刷新', function: refresh },
    { icon: 'icon-quanping_o', title: '全屏', function: fullscreen },
    { icon: 'icon-shezhi', title: '设置', function: setting },
])

// 退出登录
const handleLogout = async () => {
    try {
        await userStore.userLogout()
        $router.push({ path: '/login' })
    } catch {
        ElNotification({ type: 'error', message: '退出失败，请重试' })
    }
}
</script>

<style scoped>
.rightedit-conatiner {
    display: flex;
    margin-right: 15px;
    justify-content: space-between;
    gap: 25px;
}

.edit {
    gap: 15px;
}

.avatar,
.edit,
.loginout {
    display: flex;
    align-items: center;
}

.name {
    width: 80px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>

<!-- 全局样式，Teleport 到 body 的抽屉 -->
<style>
.theme-drawer-overlay {
    position: fixed;
    inset: 0;
    background: var(--theme-overlay);
    z-index: 2000;
    display: flex;
    justify-content: flex-end;
}

.theme-drawer-panel {
    width: 320px;
    height: 100%;
    background: var(--theme-card-bg);
    box-shadow: -4px 0 20px var(--theme-shadow);
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.25s ease;
    color: var(--theme-text);
}

@keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

.theme-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--theme-border);
    font-size: 16px;
    font-weight: 600;
    color: var(--theme-text);
}

.theme-drawer-close {
    cursor: pointer;
    font-size: 18px;
    color: var(--theme-text-secondary);
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
}

.theme-drawer-close:hover {
    background: var(--theme-hover-bg);
    color: var(--theme-text);
}

.theme-drawer-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.theme-section {
    margin-bottom: 24px;
}

.theme-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--theme-text);
    margin-bottom: 12px;
}

.mode-group {
    display: flex;
    gap: 10px;
}

.mode-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border-radius: 8px;
    border: 2px solid var(--theme-border);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
    color: var(--theme-text-secondary);
}

.mode-card:hover {
    border-color: var(--theme-primary);
}

.mode-card.active {
    border-color: var(--theme-primary);
    background: var(--theme-primary-bg);
    color: var(--theme-primary);
}

.mode-card .iconfont {
    font-size: 20px;
}

.preset-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.preset-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    border: 2px solid var(--theme-border);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
}

.preset-card:hover {
    border-color: var(--theme-primary);
}

.preset-card.active {
    border-color: var(--theme-primary);
    background: var(--theme-primary-bg);
}

.preset-color {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    flex-shrink: 0;
}

.preset-name {
    font-size: 14px;
    color: var(--theme-text);
}

.check-icon {
    position: absolute;
    right: 14px;
    color: var(--theme-primary);
    font-weight: bold;
    font-size: 16px;
}

.custom-color-row {
    display: flex;
    align-items: center;
    gap: 16px;
}

.color-hex {
    font-size: 14px;
    color: var(--theme-text-secondary);
    font-family: monospace;
}

.dark-hint {
    font-size: 12px;
    color: var(--theme-text-secondary);
    margin-left: 10px;
}
</style>
