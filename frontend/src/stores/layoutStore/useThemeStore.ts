import { defineStore } from "pinia";

export type ThemeMode = "preset" | "system" | "custom";

/** 完整主题色板 */
export interface ThemePalette {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    primaryBg: string;
    bg: string;
    sidebarBg: string;
    cardBg: string;
    text: string;
    textRegular: string;
    textSecondary: string;
    textPlaceholder: string;
    border: string;
    borderLight: string;
    shadow: string;
    overlay: string;
    hoverBg: string;
}

export interface PresetTheme {
    name: string;
    light: ThemePalette;
    dark: ThemePalette;
}

export const presetThemes: PresetTheme[] = [
    {
        name: "极光青",
        light: {
            primary: "#389BB7",
            primaryLight: "#5ab8d4",
            primaryDark: "#2a7a91",
            primaryBg: "rgba(56, 155, 183, 0.08)",
            bg: "#f0f2f5",
            sidebarBg: "#ffffff",
            cardBg: "#ffffff",
            text: "#303133",
            textRegular: "#606266",
            textSecondary: "#909399",
            textPlaceholder: "#c0c4cc",
            border: "#e4e7ed",
            borderLight: "#ebeef5",
            shadow: "rgba(56, 155, 183, 0.1)",
            overlay: "rgba(0, 0, 0, 0.45)",
            hoverBg: "rgba(56, 155, 183, 0.05)",
        },
        dark: {
            primary: "#389BB7",
            primaryLight: "#5ab8d4",
            primaryDark: "#2a7a91",
            primaryBg: "rgba(56, 155, 183, 0.15)",
            bg: "#0a1628",
            sidebarBg: "#111d33",
            cardBg: "#152238",
            text: "#e8edf3",
            textRegular: "#b8c5d6",
            textSecondary: "#7a8fa8",
            textPlaceholder: "#4a5f78",
            border: "#1e3352",
            borderLight: "#263d5e",
            shadow: "rgba(0, 0, 0, 0.4)",
            overlay: "rgba(0, 0, 0, 0.6)",
            hoverBg: "rgba(56, 155, 183, 0.08)",
        },
    },
    {
        name: "暮光紫",
        light: {
            primary: "#7c3aed",
            primaryLight: "#a78bfa",
            primaryDark: "#5b21b6",
            primaryBg: "rgba(124, 58, 237, 0.06)",
            bg: "#f5f3ff",
            sidebarBg: "#faf9ff",
            cardBg: "#ffffff",
            text: "#2e1065",
            textRegular: "#5b21b6",
            textSecondary: "#7c3aed",
            textPlaceholder: "#c4b5fd",
            border: "#e9d5ff",
            borderLight: "#f3e8ff",
            shadow: "rgba(124, 58, 237, 0.1)",
            overlay: "rgba(30, 5, 60, 0.45)",
            hoverBg: "rgba(124, 58, 237, 0.05)",
        },
        dark: {
            primary: "#7c3aed",
            primaryLight: "#a78bfa",
            primaryDark: "#5b21b6",
            primaryBg: "rgba(124, 58, 237, 0.15)",
            bg: "#1a0a2e",
            sidebarBg: "#221042",
            cardBg: "#2a1550",
            text: "#e8d5f5",
            textRegular: "#c4a8e0",
            textSecondary: "#8b6aad",
            textPlaceholder: "#5a3d7a",
            border: "#3d2066",
            borderLight: "#4a2880",
            shadow: "rgba(0, 0, 0, 0.45)",
            overlay: "rgba(0, 0, 0, 0.65)",
            hoverBg: "rgba(124, 58, 237, 0.08)",
        },
    },
    {
        name: "晨雾蓝",
        light: {
            primary: "#3b82f6",
            primaryLight: "#60a5fa",
            primaryDark: "#1d4ed8",
            primaryBg: "rgba(59, 130, 246, 0.06)",
            bg: "#eff6ff",
            sidebarBg: "#f8faff",
            cardBg: "#ffffff",
            text: "#1e3a5f",
            textRegular: "#374151",
            textSecondary: "#6b7280",
            textPlaceholder: "#93c5fd",
            border: "#bfdbfe",
            borderLight: "#dbeafe",
            shadow: "rgba(59, 130, 246, 0.1)",
            overlay: "rgba(15, 30, 60, 0.45)",
            hoverBg: "rgba(59, 130, 246, 0.05)",
        },
        dark: {
            primary: "#3b82f6",
            primaryLight: "#60a5fa",
            primaryDark: "#1d4ed8",
            primaryBg: "rgba(59, 130, 246, 0.15)",
            bg: "#0c1929",
            sidebarBg: "#12233d",
            cardBg: "#162a4a",
            text: "#dce8f5",
            textRegular: "#a8c4e0",
            textSecondary: "#6b8ab5",
            textPlaceholder: "#3d5a80",
            border: "#1e3a5f",
            borderLight: "#254670",
            shadow: "rgba(0, 0, 0, 0.4)",
            overlay: "rgba(0, 0, 0, 0.6)",
            hoverBg: "rgba(59, 130, 246, 0.08)",
        },
    },
    {
        name: "暖岩橙",
        light: {
            primary: "#ea580c",
            primaryLight: "#fb923c",
            primaryDark: "#c2410c",
            primaryBg: "rgba(234, 88, 12, 0.06)",
            bg: "#fff7ed",
            sidebarBg: "#fffbf5",
            cardBg: "#ffffff",
            text: "#431407",
            textRegular: "#7c2d12",
            textSecondary: "#9a3412",
            textPlaceholder: "#fdba74",
            border: "#fed7aa",
            borderLight: "#ffedd5",
            shadow: "rgba(234, 88, 12, 0.1)",
            overlay: "rgba(60, 20, 5, 0.45)",
            hoverBg: "rgba(234, 88, 12, 0.05)",
        },
        dark: {
            primary: "#ea580c",
            primaryLight: "#fb923c",
            primaryDark: "#c2410c",
            primaryBg: "rgba(234, 88, 12, 0.15)",
            bg: "#1c0f05",
            sidebarBg: "#2a1808",
            cardBg: "#351e0a",
            text: "#f5e0d0",
            textRegular: "#d4a882",
            textSecondary: "#a07050",
            textPlaceholder: "#6b4530",
            border: "#4a2a15",
            borderLight: "#5a3520",
            shadow: "rgba(0, 0, 0, 0.45)",
            overlay: "rgba(0, 0, 0, 0.65)",
            hoverBg: "rgba(234, 88, 12, 0.08)",
        },
    },
    {
        name: "墨玉绿",
        light: {
            primary: "#059669",
            primaryLight: "#34d399",
            primaryDark: "#047857",
            primaryBg: "rgba(5, 150, 105, 0.06)",
            bg: "#f0fdf4",
            sidebarBg: "#f5fdf8",
            cardBg: "#ffffff",
            text: "#052e16",
            textRegular: "#166534",
            textSecondary: "#15803d",
            textPlaceholder: "#86efac",
            border: "#a7f3d0",
            borderLight: "#d1fae5",
            shadow: "rgba(5, 150, 105, 0.1)",
            overlay: "rgba(5, 30, 15, 0.45)",
            hoverBg: "rgba(5, 150, 105, 0.05)",
        },
        dark: {
            primary: "#059669",
            primaryLight: "#34d399",
            primaryDark: "#047857",
            primaryBg: "rgba(5, 150, 105, 0.15)",
            bg: "#051a10",
            sidebarBg: "#0a2818",
            cardBg: "#0d3320",
            text: "#d0f5e0",
            textRegular: "#8ed4aa",
            textSecondary: "#5aad7a",
            textPlaceholder: "#2d7a50",
            border: "#154a30",
            borderLight: "#1a5a3a",
            shadow: "rgba(0, 0, 0, 0.4)",
            overlay: "rgba(0, 0, 0, 0.6)",
            hoverBg: "rgba(5, 150, 105, 0.08)",
        },
    },
];

interface ThemeState {
    themeMode: ThemeMode;
    presetName: string;
    customColor: string;
    isDark: boolean;
    systemDark: boolean;
}

const STORAGE_KEY = "cangqiong-theme";

function loadSaved(): Partial<ThemeState> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveTheme(state: ThemeState) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            themeMode: state.themeMode,
            presetName: state.presetName,
            customColor: state.customColor,
            isDark: state.isDark,
        }),
    );
}

function parseColor(color: string): [number, number, number] {
    // 支持 #rrggbb、#rrggbbaa、rgb()、rgba() 格式
    if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        return [parseInt(match[1]!), parseInt(match[2]!), parseInt(match[3]!)];
    }
    // fallback
    return [56, 155, 183];
}

function generatePalette(primary: string, isDark: boolean): ThemePalette {
    const [r, g, b] = parseColor(primary);

    if (isDark) {
        return {
            primary,
            primaryLight: `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)}, 1)`,
            primaryDark: `rgba(${Math.max(r - 30, 0)}, ${Math.max(g - 30, 0)}, ${Math.max(b - 30, 0)}, 1)`,
            primaryBg: `rgba(${r}, ${g}, ${b}, 0.15)`,
            bg: `rgba(${Math.round(r * 0.06)}, ${Math.round(g * 0.06)}, ${Math.round(b * 0.06)}, 1)`,
            sidebarBg: `rgba(${Math.round(r * 0.08)}, ${Math.round(g * 0.08)}, ${Math.round(b * 0.08)}, 1)`,
            cardBg: `rgba(${Math.round(r * 0.1)}, ${Math.round(g * 0.1)}, ${Math.round(b * 0.1)}, 1)`,
            text: `rgba(${Math.round(r * 0.5 + 180)}, ${Math.round(g * 0.5 + 180)}, ${Math.round(b * 0.5 + 180)}, 1)`,
            textRegular: `rgba(${Math.round(r * 0.3 + 140)}, ${Math.round(g * 0.3 + 140)}, ${Math.round(b * 0.3 + 140)}, 1)`,
            textSecondary: `rgba(${Math.round(r * 0.2 + 90)}, ${Math.round(g * 0.2 + 90)}, ${Math.round(b * 0.2 + 90)}, 1)`,
            textPlaceholder: `rgba(${Math.round(r * 0.15 + 50)}, ${Math.round(g * 0.15 + 50)}, ${Math.round(b * 0.15 + 50)}, 1)`,
            border: `rgba(${Math.round(r * 0.15)}, ${Math.round(g * 0.15)}, ${Math.round(b * 0.15)}, 1)`,
            borderLight: `rgba(${Math.round(r * 0.18)}, ${Math.round(g * 0.18)}, ${Math.round(b * 0.18)}, 1)`,
            shadow: `rgba(0, 0, 0, 0.4)`,
            overlay: `rgba(0, 0, 0, 0.6)`,
            hoverBg: `rgba(${r}, ${g}, ${b}, 0.08)`,
        };
    }

    return {
        primary,
        primaryLight: `rgba(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)}, 1)`,
        primaryDark: `rgba(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)}, 1)`,
        primaryBg: `rgba(${r}, ${g}, ${b}, 0.06)`,
        bg: `rgba(${Math.round(r * 0.2 + 220)}, ${Math.round(g * 0.2 + 220)}, ${Math.round(b * 0.2 + 220)}, 1)`,
        sidebarBg: `rgba(${Math.round(r * 0.05 + 245)}, ${Math.round(g * 0.05 + 245)}, ${Math.round(b * 0.05 + 245)}, 1)`,
        cardBg: "#ffffff",
        text: `rgba(${Math.round(r * 0.15 + 20)}, ${Math.round(g * 0.15 + 20)}, ${Math.round(b * 0.15 + 20)}, 1)`,
        textRegular: `rgba(${Math.round(r * 0.1 + 60)}, ${Math.round(g * 0.1 + 60)}, ${Math.round(b * 0.1 + 60)}, 1)`,
        textSecondary: `rgba(${Math.round(r * 0.05 + 120)}, ${Math.round(g * 0.05 + 120)}, ${Math.round(b * 0.05 + 120)}, 1)`,
        textPlaceholder: `rgba(${Math.round(r * 0.2 + 160)}, ${Math.round(g * 0.2 + 160)}, ${Math.round(b * 0.2 + 160)}, 1)`,
        border: `rgba(${Math.round(r * 0.3 + 180)}, ${Math.round(g * 0.3 + 180)}, ${Math.round(b * 0.3 + 180)}, 1)`,
        borderLight: `rgba(${Math.round(r * 0.2 + 200)}, ${Math.round(g * 0.2 + 200)}, ${Math.round(b * 0.2 + 200)}, 1)`,
        shadow: `rgba(${r}, ${g}, ${b}, 0.1)`,
        overlay: `rgba(0, 0, 0, 0.45)`,
        hoverBg: `rgba(${r}, ${g}, ${b}, 0.04)`,
    };
}

function applyPalette(p: ThemePalette) {
    const root = document.documentElement.style;
    root.setProperty("--theme-primary", p.primary);
    root.setProperty("--theme-primary-light", p.primaryLight);
    root.setProperty("--theme-primary-dark", p.primaryDark);
    root.setProperty("--theme-primary-bg", p.primaryBg);
    root.setProperty("--theme-bg", p.bg);
    root.setProperty("--theme-sidebar-bg", p.sidebarBg);
    root.setProperty("--theme-card-bg", p.cardBg);
    root.setProperty("--theme-text", p.text);
    root.setProperty("--theme-text-regular", p.textRegular);
    root.setProperty("--theme-text-secondary", p.textSecondary);
    root.setProperty("--theme-text-placeholder", p.textPlaceholder);
    root.setProperty("--theme-border", p.border);
    root.setProperty("--theme-border-light", p.borderLight);
    root.setProperty("--theme-shadow", p.shadow);
    root.setProperty("--theme-overlay", p.overlay);
    root.setProperty("--theme-hover-bg", p.hoverBg);
}

export const useThemeStore = defineStore("theme", {
    state: (): ThemeState => {
        const saved = loadSaved();
        return {
            themeMode: saved.themeMode ?? "preset",
            presetName: saved.presetName ?? "极光青",
            customColor: saved.customColor ?? "#389BB7",
            isDark: saved.isDark ?? false,
            systemDark: false,
        };
    },
    actions: {
        applyTheme() {
            const isDark = this.themeMode === "system" ? this.systemDark : this.isDark;

            if (this.themeMode === "preset") {
                const preset = presetThemes.find((t) => t.name === this.presetName) ?? presetThemes[0]!;
                applyPalette(isDark ? preset.dark : preset.light);
            } else {
                applyPalette(generatePalette(this.customColor, isDark));
            }

            saveTheme(this);
        },

        setPreset(name: string) {
            this.presetName = name;
            this.themeMode = "preset";
            this.applyTheme();
        },

        setCustom(color: string) {
            this.customColor = color;
            this.themeMode = "custom";
            this.applyTheme();
        },

        setDarkMode(dark: boolean) {
            this.isDark = dark;
            this.applyTheme();
        },

        setSystemMode() {
            this.themeMode = "system";
            this.applyTheme();
        },

        initSystemListener() {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            this.systemDark = mq.matches;
            mq.addEventListener("change", (e) => {
                this.systemDark = e.matches;
                if (this.themeMode === "system") {
                    this.applyTheme();
                }
            });
            this.applyTheme();
        },
    },
});

export default useThemeStore;
