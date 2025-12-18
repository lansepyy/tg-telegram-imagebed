<template>
  <UModal v-model="isOpen">
    <UCard class="bg-white dark:bg-gray-900">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <UIcon name="heroicons:megaphone" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-stone-900 dark:text-white">版本更新日志</h3>
              <p class="text-xs text-stone-500 dark:text-stone-400">当前版本: v{{ versionInfo.version }}</p>
            </div>
          </div>
          <UButton
            color="gray"
            variant="ghost"
            icon="heroicons:x-mark"
            @click="isOpen = false"
            class="-my-1"
          />
        </div>
      </template>

      <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        <div
          v-for="note in versionInfo.updateNotes"
          :key="note.version"
          class="relative"
        >
          <!-- 版本标题 -->
          <div class="flex items-center gap-3 mb-3">
            <div 
              class="px-3 py-1 rounded-full text-xs font-bold"
              :class="{
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': note.type === 'major',
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400': note.type === 'minor',
                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400': note.type === 'patch',
              }"
            >
              v{{ note.version }}
            </div>
            <span class="text-sm text-stone-500 dark:text-stone-400">{{ note.date }}</span>
            <span 
              v-if="note.version === versionInfo.version"
              class="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium rounded"
            >
              当前版本
            </span>
          </div>

          <!-- 更新内容 -->
          <div class="ml-4 space-y-2">
            <div
              v-for="(change, idx) in note.changes"
              :key="idx"
              class="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300"
            >
              <span class="mt-1">•</span>
              <span>{{ change }}</span>
            </div>
          </div>

          <!-- 分割线 -->
          <div 
            v-if="note !== versionInfo.updateNotes[versionInfo.updateNotes.length - 1]"
            class="mt-6 border-t border-gray-200 dark:border-gray-700"
          ></div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <a
            href="https://github.com/yourusername/tg-telegram-imagebed"
            target="_blank"
            class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
          >
            <UIcon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
            <span>查看完整更新日志</span>
          </a>
          <UButton @click="isOpen = false" color="gray">
            关闭
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { VERSION_INFO } from '~/data/version'

const isOpen = defineModel<boolean>({ default: false })
const versionInfo = VERSION_INFO
</script>
