<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-stone-900 dark:text-white">系统日志</h1>
        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">查看系统运行日志和错误信息</p>
      </div>
      <div class="flex items-center gap-2">
        <!-- 刷新按钮 -->
        <UButton
          icon="heroicons:arrow-path"
          color="gray"
          variant="soft"
          :loading="loading"
          @click="loadLogs"
        >
          刷新
        </UButton>
        <!-- 清空日志按钮 -->
        <UButton
          icon="heroicons:trash"
          color="red"
          variant="soft"
          :loading="clearing"
          @click="clearLogs"
        >
          清空日志
        </UButton>
      </div>
    </div>

    <!-- 过滤器 -->
    <UCard>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 日志级别过滤 -->
        <UFormGroup label="日志级别">
          <USelectMenu
            v-model="selectedLevel"
            :options="logLevels"
            placeholder="全部"
            @update:model-value="loadLogs"
          />
        </UFormGroup>

        <!-- 日志行数 -->
        <UFormGroup label="显示行数">
          <USelectMenu
            v-model="selectedLines"
            :options="lineOptions"
            @update:model-value="loadLogs"
          />
        </UFormGroup>

        <!-- 自动刷新 -->
        <UFormGroup label="自动刷新">
          <div class="flex items-center gap-2">
            <UToggle v-model="autoRefresh" />
            <span class="text-sm text-stone-500 dark:text-stone-400">
              {{ autoRefresh ? '开启' : '关闭' }}
            </span>
          </div>
        </UFormGroup>

        <!-- 搜索 -->
        <UFormGroup label="搜索关键词">
          <div class="flex items-center gap-2">
            <UInput
              v-model="searchKeyword"
              placeholder="输入关键词搜索"
              icon="heroicons:magnifying-glass"
              class="flex-1"
            />
          </div>
        </UFormGroup>
      </div>
    </UCard>

    <!-- 日志内容 -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-stone-900 dark:text-white">日志内容</h2>
          <UBadge color="gray" variant="subtle">
            {{ logs.length }} 条记录
          </UBadge>
        </div>
      </template>

      <div v-if="loading && logs.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center">
          <UIcon name="heroicons:arrow-path" class="w-8 h-8 text-stone-400 animate-spin" />
          <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">加载日志中...</p>
        </div>
      </div>

      <div v-else-if="logs.length === 0" class="flex items-center justify-center py-12">
        <div class="text-center">
          <UIcon name="heroicons:document-text" class="w-12 h-12 text-stone-300 dark:text-stone-600" />
          <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">暂无日志</p>
        </div>
      </div>

      <div v-else class="space-y-2">
        <!-- 日志列表 -->
        <div
          v-for="(log, index) in filteredLogs"
          :key="index"
          class="relative rounded-lg border p-3 transition-colors"
          :class="getLogClass(log)"
        >
          <div class="flex items-start gap-3">
            <!-- 日志级别图标 -->
            <div class="flex-shrink-0 mt-0.5">
              <UIcon :name="getLogIcon(log)" class="w-5 h-5" :class="getLogIconClass(log)" />
            </div>

            <!-- 日志内容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <UBadge :color="getLogLevelColor(log)" variant="subtle" size="xs">
                  {{ getLogLevel(log) }}
                </UBadge>
                <span class="text-xs text-stone-500 dark:text-stone-400">
                  {{ getLogTime(log) }}
                </span>
              </div>
              <pre class="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap break-words font-mono">{{ getLogMessage(log) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const notification = useNotification()

// 状态
const loading = ref(false)
const clearing = ref(false)
const logs = ref<string[]>([])
const selectedLevel = ref<string>('')
const selectedLines = ref(100)
const autoRefresh = ref(false)
const searchKeyword = ref('')

// 自动刷新定时器
let refreshInterval: NodeJS.Timeout | null = null

// 日志级别选项
const logLevels = [
  '',
  'DEBUG',
  'INFO',
  'WARNING',
  'ERROR',
  'CRITICAL',
]

// 行数选项
const lineOptions = [
  50,
  100,
  200,
  500,
  1000,
]

// 过滤日志
const filteredLogs = computed(() => {
  let result = logs.value

  // 按关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(log => log.toLowerCase().includes(keyword))
  }

  return result
})

// 加载日志
const loadLogs = async () => {
  loading.value = true
  try {
    const params: any = {
      lines: selectedLines.value
    }
    
    if (selectedLevel.value) {
      params.level = selectedLevel.value
    }

    const response = await fetch(`/api/admin/logs?${new URLSearchParams(params)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('加载日志失败')
    }

    const data = await response.json()
    logs.value = data.logs || []
  } catch (error) {
    console.error('加载日志失败:', error)
    notification.error('错误', '加载日志失败')
  } finally {
    loading.value = false
  }
}

// 清空日志
const clearLogs = async () => {
  if (!confirm('确定要清空所有日志吗？此操作不可恢复！')) {
    return
  }

  clearing.value = true
  try {
    const response = await fetch('/api/admin/logs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('清空日志失败')
    }

    notification.success('成功', '日志已清空')
    await loadLogs()
  } catch (error) {
    console.error('清空日志失败:', error)
    notification.error('错误', '清空日志失败')
  } finally {
    clearing.value = false
  }
}

// 获取日志级别
const getLogLevel = (log: string): string => {
  if (log.includes('ERROR')) return 'ERROR'
  if (log.includes('WARNING')) return 'WARNING'
  if (log.includes('INFO')) return 'INFO'
  if (log.includes('DEBUG')) return 'DEBUG'
  if (log.includes('CRITICAL')) return 'CRITICAL'
  return 'INFO'
}

// 获取日志时间
const getLogTime = (log: string): string => {
  const match = log.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
  return match ? match[0] : ''
}

// 获取日志消息
const getLogMessage = (log: string): string => {
  return log
}

// 获取日志样式类
const getLogClass = (log: string): string => {
  const level = getLogLevel(log)
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
    case 'WARNING':
      return 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10'
    case 'DEBUG':
      return 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10'
    default:
      return 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900/10'
  }
}

// 获取日志图标
const getLogIcon = (log: string): string => {
  const level = getLogLevel(log)
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'heroicons:x-circle'
    case 'WARNING':
      return 'heroicons:exclamation-triangle'
    case 'DEBUG':
      return 'heroicons:bug-ant'
    default:
      return 'heroicons:information-circle'
  }
}

// 获取日志图标样式
const getLogIconClass = (log: string): string => {
  const level = getLogLevel(log)
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'text-red-600 dark:text-red-400'
    case 'WARNING':
      return 'text-amber-600 dark:text-amber-400'
    case 'DEBUG':
      return 'text-gray-600 dark:text-gray-400'
    default:
      return 'text-blue-600 dark:text-blue-400'
  }
}

// 获取日志级别颜色
const getLogLevelColor = (log: string): string => {
  const level = getLogLevel(log)
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'red'
    case 'WARNING':
      return 'amber'
    case 'DEBUG':
      return 'gray'
    default:
      return 'blue'
  }
}

// 监听自动刷新
watch(autoRefresh, (enabled) => {
  if (enabled) {
    refreshInterval = setInterval(() => {
      loadLogs()
    }, 5000) // 每5秒刷新一次
  } else {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }
})

// 页面加载时获取日志
onMounted(() => {
  loadLogs()
})

// 页面卸载时清除定时器
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
