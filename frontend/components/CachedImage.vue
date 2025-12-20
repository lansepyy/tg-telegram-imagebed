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

const displayUrl = computed(() => props.src)
const loading = ref(true)
const className = computed(() => props.class || '')

const handleError = () => {
  loading.value = false
}

// 监听图片加载
watch(() => props.src, () => { loading.value = true }, { immediate: true })
</script>
