/**
 * 系统设置初始化插件
 * 在应用启动时加载系统设置
 */

export default defineNuxtPlugin(() => {
    const systemSettingsStore = useSystemSettingsStore()

    // 从 localStorage 加载设置
    systemSettingsStore.loadSettings()
})
