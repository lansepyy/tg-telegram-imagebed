/**
 * 系统设置 Store
* 管理全局系统设置
 */

import { defineStore } from 'pinia'

export const useSystemSettingsStore = defineStore('systemSettings', {
    state: () => ({
        // browserCacheEnabled: false,
        settingsLoaded: false,
    }),

    actions: {
        /**
         * 从 localStorage 加载设置
         */
        loadSettings() {
            if (process.client) {
                const saved = localStorage.getItem('system_settings')
                if (saved) {
                    try {
                        const settings = JSON.parse(saved)
                        // this.browserCacheEnabled = settings.browser_cache_enabled ?? false
                    } catch (error) {
                        console.error('加载系统设置失败:', error)
                    }
                }
                this.settingsLoaded = true
            }
        },

        /**
         * 设置浏览器缓存开关
         */
        setBrowserCacheEnabled(enabled: boolean) {
            // this.browserCacheEnabled = enabled
            this.saveSettings()
        },

        /**
         * 保存设置到 localStorage
         */
        saveSettings() {
            if (process.client) {
                const settings = {
                    // browser_cache_enabled: this.browserCacheEnabled,
                }
                localStorage.setItem('system_settings', JSON.stringify(settings))
            }
        },

        /**
         * 从服务器同步设置
         */
        async syncFromServer() {
            try {
                const config = useRuntimeConfig()
                const response = await $fetch<any>(`${config.public.apiBase}/api/admin/system/settings`, {
                    credentials: 'include'
                })

                if (response.success && response.data) {
                    // this.browserCacheEnabled = response.data.browser_cache_enabled ?? false
                    this.saveSettings()
                }
            } catch (error) {
                console.error('同步系统设置失败:', error)
            }
        },
    },
})
