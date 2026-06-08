// 搜索防抖函数
export function debounce(func: Function, delay: number) {
    let timer: number | null = null;
    const debounced = function (...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
    debounced.cancel = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    return debounced;
}
