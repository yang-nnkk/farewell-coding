import { defineStore } from 'pinia';

export const useLayoutSetting = defineStore('layoutSetting', {
    state: () => {
        return {
            refresh: false,
        };
    },
    getters: {},
    actions: {},
});

export default useLayoutSetting;
