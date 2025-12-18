<template>
  <div class="relative w-full h-full">
    <!-- 加载中占位符 -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center"
    >
      <UIcon name="heroicons:photo" class="w-8 h-8 text-gray-400" />
    </div>

    <!-- 实际图片 -->
    <img
      v-show="!loading"
      :src="displayUrl"
      :alt="alt"
      :class="className"
      loading="lazy"
      decoding="async"
      @load="loading = false"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  class?: string
  useCache?: boolean  // 是否使用缓存，默认true（列表缩略图用缓存，查看原图不用）
}>()

const { loadImage } = useImageCache()
const displayUrl = ref('')
const loading = ref(true)
const className = computed(() => props.class || '')

// 加载图片（列表缩略图用缓存，原图不用）
const load = async () => {
  try {
    loading.value = true
    const shouldCache = props.useCache !== false  // 默认true
    displayUrl.value = await loadImage(props.src, shouldCache)
  } catch (error) {
    console.error('图片加载失败:', error)
    displayUrl.value = props.src // 降级使用原URL
    loading.value = false
  }
}

const handleError = () => {
  loading.value = false
  displayUrl.value = props.src
}

// 监听src变化
watch(() => props.src, load, { immediate: true })

onUnmounted(() => {
  // 清理 blob URL
  if (displayUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(displayUrl.value)
  }
})
</script>
