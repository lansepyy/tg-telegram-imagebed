<template>
  <header class="sticky top-0 z-[60] bg-white/80 dark:bg-neutral-900/80 border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center justify-between p-4 gap-2">
    <!-- 左侧 Logo -->
    <NuxtLink to="/" class="flex items-center gap-2.5 group">
      <div class="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
        <UIcon name="heroicons:cloud-arrow-up" class="w-5 h-5 text-white" />
      </div>
      <span class="text-lg font-semibold text-stone-800 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">图床 Pro</span>
      <UBadge color="red" variant="subtle" size="xs">管理</UBadge>
    </NuxtLink>
    <!-- 右侧操作 -->
    <div class="flex items-center gap-2">
      <button
        @click="toggleTheme"
        class="p-2.5 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 4.05l-.71.71M21 12h-1M4 12H3m16.24 4.24l-.71-.71M6.34 19.66l-.71-.71"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>
      </button>
      <!-- 版本信息按钮 -->
      <button
        @click="versionModalOpen = true"
        class="p-2.5 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
        title="版本信息"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
      </button>
    </div>
  </header>
  <AdminShell
    @open-settings="settingsOpen = true"
    @logout="handleLogout"
  >
    <slot />
  </AdminShell>

  <!-- 管理员设置模态框 -->
  <UModal v-model="settingsOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-stone-900 dark:text-white">管理员设置</h3>
          <UButton
            icon="heroicons:x-mark"
            color="gray"
            variant="ghost"
            @click="settingsOpen = false"
          />
        </div>
      </template>
      <div class="space-y-4">
        <UFormGroup label="新用户名">
          <UInput v-model="settingsForm.username" placeholder="留空则不修改" />
        </UFormGroup>
        <UFormGroup label="新密码">
          <UInput v-model="settingsForm.password" type="password" placeholder="留空则不修改" />
        </UFormGroup>
        <UFormGroup label="确认密码">
          <UInput v-model="settingsForm.confirmPassword" type="password" placeholder="再次输入新密码" />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="settingsOpen = false">
            取消
          </UButton>
          <UButton color="primary" :loading="saving" @click="handleUpdateSettings">
            保存
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
  <!-- 版本信息弹窗 -->
  <VersionModal v-model="versionModalOpen" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const isDark = ref(document.documentElement.classList.contains('dark'))
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
const versionModalOpen = ref(false)

const authStore = useAuthStore()
const notification = useNotification()

const settingsOpen = ref(false)
const saving = ref(false)
const settingsForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/admin')
}

const handleUpdateSettings = async () => {
  if (settingsForm.value.password && settingsForm.value.password !== settingsForm.value.confirmPassword) {
    notification.error('错误', '两次输入的密码不一致')
    return
  }

  saving.value = true
  try {
    await authStore.updateSettings(settingsForm.value)
    notification.success('成功', '设置已更新')
    settingsOpen.value = false
    settingsForm.value = { username: '', password: '', confirmPassword: '' }
  } catch (error) {
    notification.error('错误', '更新设置失败')
  } finally {
    saving.value = false
  }
}
</script>
