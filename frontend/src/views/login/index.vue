<template>
    <div class="welcome-container">
        <!-- 动态渐变背景 -->
        <div class="bg-container"></div>

        <!-- 第一层：背景后粒子（z-index: -1，在黑色背景后面） -->
        <div class="particle-layer back-particles">
            <div v-for="(particle, index) in backParticles" :key="`back-${index}`" class="particle"
                :class="particle.animationClass" :style="{
                    top: particle.top + '%',
                    left: particle.left + '%',
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                    opacity: particle.opacity,
                    animationDelay: particle.delay,
                    transform: particle.rotate,
                    clipPath: particle.clipPath,
                    borderRadius: particle.borderRadius
                }"></div>
        </div>

        <!-- 第二层：中间层粒子（z-index: 10，在背景上面，内容下面） -->
        <div class="particle-layer mid-particles">
            <div v-for="(particle, index) in midParticles" :key="`mid-${index}`" class="particle"
                :class="particle.animationClass" :style="{
                    top: particle.top + '%',
                    left: particle.left + '%',
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                    opacity: particle.opacity,
                    animationDelay: particle.delay,
                    transform: particle.rotate,
                    clipPath: particle.clipPath,
                    borderRadius: particle.borderRadius
                }"></div>
        </div>

        <!-- 第三层：前景层粒子（z-index: 30，在内容前面） -->
        <div class="particle-layer front-particles">
            <div v-for="(particle, index) in frontParticles" :key="`front-${index}`" class="particle"
                :class="particle.animationClass" :style="{
                    top: particle.top + '%',
                    left: particle.left + '%',
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                    opacity: particle.opacity,
                    animationDelay: particle.delay,
                    transform: particle.rotate,
                    clipPath: particle.clipPath,
                    borderRadius: particle.borderRadius
                }"></div>
        </div>

        <!-- 主内容层 -->
        <div class="main-content">
            <!-- 欢迎标题 -->
            <div class="title-wrapper">
                <h1 class="welcome-title">
                    <span v-for="(char, index) in 'WELCOME'" :key="index" class="title-char animate-float"
                        :style="{ animationDelay: `${index * 0.1}s` }">
                        {{ char }}
                    </span>
                </h1>

                <div class="subtitle-wrapper">
                    <p class="typing-text">苍穹电商管理后台</p>
                </div>
            </div>

            <!-- 登录表单 -->
            <el-form class="login-form" ref="ruleFormRef" :rules="rules" :model="loginFormData"
                @keyup.enter="validateForm(ruleFormRef)">
                <el-form-item label="用户名" label-position="top" prop="username">
                    <el-input v-model="loginFormData.username" placeholder="请输入用户名" class="custom-bg-input" />
                </el-form-item>
                <el-form-item label="密码" label-position="top" prop="password">
                    <el-input v-model="loginFormData.password" type="password" placeholder="请输入密码"
                        class="custom-bg-input" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="validateForm(ruleFormRef)" style="width: 70%;margin: 20px auto;"
                        :loading="isloading">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="bottom-line animate-pulse"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification, type FormRules, type FormInstance } from "element-plus"
import useUserStore from "@/stores/modules/user.ts"

const userstore = useUserStore()
const $router = useRouter()
const $route = useRoute()

const ruleFormRef = ref<FormInstance>()

interface RuleForm {
    username: string
    password: string
}

// 登录表单
const isloading = ref(false)
const loginFormData = reactive<RuleForm>({
    username: "",
    password: ""
})

// 表单验证规则
const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 20, message: "长度必须在 3 - 20 之间", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 20, message: "长度必须在 6 - 20 之间", trigger: "blur" }
    ]
})

// 表单验证函数
const validateForm = async (FormEl: FormInstance | undefined) => {
    if (!FormEl) return
    await FormEl.validate(async (valid) => {
        if (valid) {
            await handleLogin()
        } else {
            ElNotification({
                type: "error",
                message: `请检查输入是否正确`,
                position: "bottom-left"
            })
        }
    })
}

// 判断当前事件是 早上、中午还是晚上
const getHourOfDay = (): string => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "早上"
    if (hour >= 12 && hour < 18) return "下午"
    return "晚上"
}

const handleLogin = async () => {
    isloading.value = true
    try {
        await userstore.userLogin(loginFormData)
        ElNotification({ type: "success", message: `${getHourOfDay()}好，${loginFormData.username.toString()} !` })
        const redirect: any = $route.query.redirect
        $router.push({ path: redirect || "/" })

    } catch (err) {
        ElNotification({
            type: "error",
            message: (err as string),
            position: "bottom-left"
        })
        ruleFormRef.value?.resetFields()

    }
    finally {
        isloading.value = false
    }
}

// 粒子类型（保持不变）
interface Particle {
    top: number
    left: number
    size: string
    color: string
    opacity: number
    delay: string
    rotate: string
    animationClass: string
    clipPath: string
    borderRadius: string
    vx: number
    vy: number
}

// 随机取数组元素
const getRandomItem = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]!
}

// 生成粒子（逻辑不变，只改数量和速度）
const generateParticles = (count: number, isBack: boolean = false, isFront: boolean = false): Particle[] => {
    const particles: Particle[] = []
    const colors = ['#fff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8', '#00b894']
    const animations = ['animate-float', 'animate-float-reverse', 'animate-pulse-scale', 'animate-spin-slow']
    const shapes = ['circle', 'square', 'triangle', 'irregular1', 'irregular2', 'irregular3']

    for (let i = 0; i < count; i++) {
        const shape = getRandomItem(shapes)
        let clipPath = 'none'
        let borderRadius = '0'

        switch (shape) {
            case 'circle': borderRadius = '50%'; break
            case 'square': borderRadius = '0'; break
            case 'triangle': clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)'; break
            case 'irregular1': clipPath = 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)'; break
            case 'irregular2': clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'; break
            case 'irregular3': clipPath = 'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)'; break
        }

        particles.push({
            top: Math.random() * 100,
            left: Math.random() * 100,
            size: `${Math.random() * (isBack ? 100 : isFront ? 10 : 30) + (isBack ? 30 : isFront ? 5 : 15)}px`,
            color: getRandomItem(colors),
            opacity: Math.random() * (isBack ? 0.12 : isFront ? 0.2 : 0.25) + (isBack ? 0.03 : isFront ? 0.05 : 0.08),
            delay: `${Math.random() * 5}s`,
            rotate: `rotate(${Math.random() * 360}deg)`,
            animationClass: getRandomItem(animations),
            clipPath,
            borderRadius,
            // 【优化】速度大幅降低，减少CPU占用
            vx: (Math.random() - 0.5) * 0.03,
            vy: (Math.random() - 0.5) * 0.03,
        })
    }
    return particles
}

// ====================== 核心优化：数量大减 ======================
const backParticles = ref<Particle[]>(generateParticles(15, true, false))
const midParticles = ref<Particle[]>(generateParticles(8, false, false))
const frontParticles = ref<Particle[]>(generateParticles(5, false, true))

let animationId: number | null = null

// 动画函数（精简版，不创建新对象，直接修改原值）
const animateParticles = () => {
    const update = (list: Particle[]) => {
        for (const p of list) {
            p.top += p.vy
            p.left += p.vx

            // 边界反弹
            if (p.top <= 0 || p.top >= 100) p.vy *= -1
            if (p.left <= 0 || p.left >= 100) p.vx *= -1

            // 限制范围
            p.top = Math.max(0, Math.min(100, p.top))
            p.left = Math.max(0, Math.min(100, p.left))
        }
    }

    update(backParticles.value)
    update(midParticles.value)
    update(frontParticles.value)

    animationId = requestAnimationFrame(animateParticles)
}

onMounted(() => {
    animateParticles()
})

onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
@import url("./style.css");
</style>