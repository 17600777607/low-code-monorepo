<template>
  <div class="back-button" @click="handleGoBack">← 返回工作台</div>
  <MicroAppContainer
    :container-id="findMicroApp(appName)?.container?.replace('#', '')"
    :app-name="appName"
    @ready="handleContainerReady"
  />
</template>

<script setup lang="ts">
import consola from 'consola'
import { useRoute, useRouter } from 'vue-router'
import MicroAppContainer from '@/components/MicroAppContainer.vue'
import { findMicroApp } from '@/qiankun'

const route = useRoute()
const appName = route.params.appName as string

/**
 * 容器准备就绪回调
 * @param containerId - 容器 ID
 */
const handleContainerReady = (containerId: string) => {
  consola.success(`[${appName}Container] 微应用容器已准备就绪: ${containerId}`)
}
const router = useRouter()

/**
 * 返回工作台
 */
const handleGoBack = () => {
  router.push('/')
}
</script>

<style scoped>
/* 可以在这里添加容器特有的样式 */

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 12px 24px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
  font-size: 14px;
  color: #333;
}

.back-button:hover {
  background: #667eea;
  color: white;
  transform: translateX(-4px);
}
</style>
