<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import { getToken, setToken, removeToken } from '@/utils/auth'

onMounted(() => {
  setToken('eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjFjYjhmOTk4LWZjNjUtNDk1Ny05YWZiLTU3ZDFmZWFkMDVkMSJ9.53rpjo4yp6H2-ihsEw6kuq3aSLtdVqHHgzqTJoBuY9aRyD6g-Vy2u3d8565xopr1JMoGvm7oscfgsWUNmzmucw')
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>
