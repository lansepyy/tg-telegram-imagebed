<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          仪表板
        </h1>
        <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
          欢迎回来，管理您的图床系统
        </p>
      </div>
      <UButton
        icon="heroicons:arrow-path"
        color="gray"
        variant="outline"
        :loading="loading"
        @click="loadStats"
      >
        刷新数据
      </UButton>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard class="hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <UIcon name="heroicons:photo" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-stone-500 dark:text-stone-400">总图片数</p>
            <p class="text-2xl font-bold text-stone-900 dark:text-white">
              {{ stats.totalImages || '--' }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <UIcon name="heroicons:cube" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-stone-500 dark:text-stone-400">总存储量</p>
            <p class="text-2xl font-bold text-stone-900 dark:text-white">
              {{ stats.totalSize || '--' }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <UIcon name="heroicons:cloud-arrow-up" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-stone-500 dark:text-stone-400">今日上传</p>
            <p class="text-2xl font-bold text-stone-900 dark:text-white">
              {{ stats.todayUploads || '--' }}
            </p>
          </div>
        </div>
      </UCard>

      <UCard class="hover:shadow-lg transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <UIcon name="heroicons:bolt" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-stone-500 dark:text-stone-400">CDN缓存</p>
            <p class="text-2xl font-bold text-stone-900 dark:text-white">
              {{ stats.cdnCached || '--' }}
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 快捷入口 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink to="/admin/images">
        <UCard class="hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <UIcon name="heroicons:photo" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-stone-900 dark:text-white">图片管理</h3>
              <p class="text-sm text-stone-500 dark:text-stone-400">查看、搜索、删除图片</p>
            </div>
            <UIcon name="heroicons:chevron-right" class="w-5 h-5 text-stone-400 group-hover:text-amber-500 transition-colors" />
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/admin/settings">
        <UCard class="hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <UIcon name="heroicons:cog-6-tooth" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-stone-900 dark:text-white">系统设置</h3>
              <p class="text-sm text-stone-500 dark:text-stone-400">游客模式、上传限制</p>
            </div>
            <UIcon name="heroicons:chevron-right" class="w-5 h-5 text-stone-400 group-hover:text-amber-500 transition-colors" />
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/admin/announcements">
        <UCard class="hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <UIcon name="heroicons:megaphone" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-stone-900 dark:text-white">公告管理</h3>
              <p class="text-sm text-stone-500 dark:text-stone-400">编辑系统公告</p>
            </div>
            <UIcon name="heroicons:chevron-right" class="w-5 h-5 text-stone-400 group-hover:text-amber-500 transition-colors" />
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <!-- 浏览器缓存管理 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <UIcon name="heroicons:archive-box" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-stone-900 dark:text-white">浏览器缓存管理</h3>
              <p class="text-xs text-stone-500 dark:text-stone-400">IndexedDB 本地缓存统计与清理</p>
            </div>
          </div>
          <UButton
            icon="heroicons:arrow-path"
            color="gray"
            variant="outline"
            size="sm"
            :loading="loadingCache"
            @click="loadCacheStats"
          >
            刷新
          </UButton>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 缓存统计 -->
        <div class="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:photo" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">缓存项数量</p>
          </div>
          <p class="text-2xl font-bold text-stone-900 dark:text-white">
            {{ cacheStats.count }} 项
          </p>
          <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">
            最多缓存 500 项
          </p>
        </div>

        <div class="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:cube" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">缓存大小</p>
          </div>
          <p class="text-2xl font-bold text-stone-900 dark:text-white">
            {{ formatCacheSize(cacheStats.size) }}
          </p>
          <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">
            缓存 7 天后自动过期
          </p>
        </div>
      </div>

      <div class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div class="flex items-start gap-3">
          <UIcon name="heroicons:information-circle" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <p class="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">关于浏览器缓存</p>
            <p class="text-xs text-amber-700 dark:text-amber-300">
              浏览器缓存使用 IndexedDB 存储已访问的图片缩略图，加速二次加载。缓存会在 7 天后自动过期，或在超过 500 项时自动清理最旧的缓存。
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="red"
            variant="outline"
            :loading="clearingCache"
            @click="handleClearCache"
          >
            <template #leading>
              <UIcon name="heroicons:trash" />
            </template>
            清空浏览器缓存
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- 系统配置 -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <UIcon name="heroicons:server" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-stone-900 dark:text-white">系统状态</h3>
            <p class="text-xs text-stone-500 dark:text-stone-400">当前系统运行状态</p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:signal" class="w-4 h-4 text-green-600 dark:text-green-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">CDN状态</p>
          </div>
          <p class="text-lg font-bold text-stone-900 dark:text-white">
            {{ systemConfig.cdnStatus || '--' }}
          </p>
        </div>

        <div class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:globe-alt" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">域名</p>
          </div>
          <p class="text-lg font-bold text-stone-900 dark:text-white truncate">
            {{ systemConfig.cdnDomain || '--' }}
          </p>
        </div>

        <div class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:server" class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">存储类型</p>
          </div>
          <p class="text-lg font-bold text-stone-900 dark:text-white">
            Telegram Cloud
          </p>
        </div>

        <div class="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:clock" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">运行时间</p>
          </div>
          <p class="text-lg font-bold text-stone-900 dark:text-white">
            {{ systemConfig.uptime || '--' }}
          </p>
        </div>

        <div class="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:user-group" class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">群组上传</p>
          </div>
          <p class="text-lg font-bold text-stone-900 dark:text-white">
            {{ systemConfig.groupUpload || '--' }}
          </p>
        </div>

        <div class="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="heroicons:chart-bar" class="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <p class="text-sm font-medium text-stone-600 dark:text-stone-400">CDN监控</p>
          </div>
          <p class="text-lg font-bold text-stone-900 dark:text-white">
            {{ systemConfig.cdnMonitor || '--' }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const notification = useNotification()
const { getAdminStats } = useImageApi()
const { getCacheStats, clearCache } = useImageCache()

// 状态
const loading = ref(false)
const loadingCache = ref(false)
const clearingCache = ref(false)
const stats = ref<any>({})
const systemConfig = ref<any>({})
const cacheStats = ref({ count: 0, size: 0 })

// 加载统计信息
const loadStats = async () => {
  loading.value = true
  try {
    const data = await getAdminStats()
    stats.value = data.stats
    systemConfig.value = data.config
    notification.success('已刷新', '数据已更新')
  } catch (error) {
    console.error('加载统计信息失败:', error)
    notification.error('加载失败', '无法获取统计信息')
  } finally {
    loading.value = false
  }
}

// 加载浏览器缓存统计
const loadCacheStats = async () => {
  loadingCache.value = true
  try {
    cacheStats.value = await getCacheStats()
  } catch (error) {
    console.error('加载缓存统计失败:', error)
  } finally {
    loadingCache.value = false
  }
}

// 清空浏览器缓存
const handleClearCache = async () => {
  if (!confirm('确定要清空所有浏览器缓存吗？此操作不可撤销。')) {
    return
  }

  clearingCache.value = true
  try {
    await clearCache()
    await loadCacheStats()
    notification.success('清理成功', '浏览器缓存已清空')
  } catch (error) {
    console.error('清理缓存失败:', error)
    notification.error('清理失败', '无法清空浏览器缓存')
  } finally {
    clearingCache.value = false
  }
}

// 格式化缓存大小
const formatCacheSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

// 页面加载
onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadCacheStats()
  ])
})
</script>
