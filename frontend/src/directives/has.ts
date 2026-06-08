import type { Directive, DirectiveBinding } from 'vue'
import useUserStore from '@/stores/modules/user'

/**
 * v-has 按钮权限指令
 * 用法: v-has="'btn.User.add'"
 * 多个权限（满足任一即可）: v-has="['btn.User.add', 'btn.User.update']"
 *
 * 如果用户没有对应按钮权限，该元素将从 DOM 中移除。
 */
const has: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
        const userStore = useUserStore()
        const userButtons = userStore.buttons

        // 获取指令传入的权限值
        const requiredButtons = Array.isArray(binding.value) ? binding.value : [binding.value]

        // 判断用户是否拥有所需权限
        const hasPermission = requiredButtons.some(btn => userButtons.includes(btn))

        if (!hasPermission) {
            // 没有权限，移除元素
            el.parentNode?.removeChild(el)
        }
    },
}

export default has
