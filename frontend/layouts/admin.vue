<template>
  <AdminShell
    @open-settings="settingsOpen = true"
    @logout="handleLogout"
  >
    <template #actions>
      <button
        @click="toggleTheme"
        class="p-2 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100/50 dark:hover:bg-neutral-800/50 rounded-lg transition-all"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <UIcon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-5 h-5" />
      </button>
      <!-- 版本信息按钮 -->
      <button
        @click="versionModalOpen = true"
        class="p-2 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100/50 dark:hover:bg-neutral-800/50 rounded-lg transition-all"
        title="版本信息"
      >
        <UIcon name="heroicons:information-circle" class="w-5 h-5" />
      </button>
    </template>

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
