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
    <div class="bg-black rounded-lg border border-gray-700 overflow-hidden">
      <!-- 头部 -->
      <div class="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
        <h2 class="text-sm font-semibold text-green-400 font-mono flex items-center gap-2">
          <span class="text-green-500">❯</span>
          SYSTEM LOGS
        </h2>
        <UBadge color="gray" variant="solid" class="bg-gray-800 text-gray-300">
          {{ filteredLogs.length }} 条记录
        </UBadge>
      </div>

      <!-- 加载中状态 -->
      <div v-if="loading && logs.length === 0" class="flex items-center justify-center py-12 bg-black">
        <div class="text-center">
          <UIcon name="heroicons:arrow-path" class="w-8 h-8 text-green-500 animate-spin" />
          <p class="mt-2 text-sm text-green-400 font-mono">Loading...</p>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="logs.length === 0" class="flex items-center justify-center py-12 bg-black">
        <div class="text-center">
          <UIcon name="heroicons:document-text" class="w-12 h-12 text-gray-600" />
          <p class="mt-2 text-sm text-gray-500 font-mono">No logs found</p>
        </div>
      </div>

      <!-- 日志列表 -->
      <div v-else class="p-4 bg-black space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
        <div
          v-for="(log, index) in filteredLogs"
          :key="index"
          class="flex items-start gap-2 py-1 hover:bg-gray-900/50 transition-colors font-mono text-sm"
        >
          <!-- 行号 -->
          <span class="text-gray-600 select-none min-w-[3rem] text-right">{{ index + 1 }}</span>
          
          <!-- 级别标识 -->
          <span class="select-none" :class="getLogLevelClass(log)">[■]</span>
          
          <!-- 日志内容 -->
          <pre class="flex-1 whitespace-pre-wrap break-words" :class="getLogTextClass(log)">{{ log }}</pre>
        </div>
      </div>
    </div>
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

// 获取日志级别颜色（终端风格）
const getLogLevelClass = (log: string): string => {
  const level = getLogLevel(log)
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'text-red-500'
    case 'WARNING':
      return 'text-yellow-500'
    case 'DEBUG':
      return 'text-cyan-500'
    case 'INFO':
    default:
      return 'text-green-500'
  }
}

// 获取日志文本颜色（终端风格）
const getLogTextClass = (log: string): string => {
  const level = getLogLevel(log)
  switch (level) {
    case 'ERROR':
    case 'CRITICAL':
      return 'text-red-400'
    case 'WARNING':
      return 'text-yellow-400'
    case 'DEBUG':
      return 'text-cyan-400'
    case 'INFO':
    default:
      return 'text-gray-300'
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

<style scoped>
/* 终端风格滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #000;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>
