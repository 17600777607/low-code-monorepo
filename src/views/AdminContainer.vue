<template>
  <MicroAppContainer
    container-id="admin-app-container"
    app-name="AdminContainer"
    @ready="handleContainerReady"
  />
</template>

<script setup lang="ts">
import consola from 'consola'
import MicroAppContainer from '@/components/MicroAppContainer.vue'

/**
 * 容器准备就绪回调
 * @param containerId - 容器 ID
 */
const handleContainerReady = (containerId: string) => {
  consola.info(`[AdminContainer] 微应用容器已准备就绪: ${containerId}`)
}
</script>

<style scoped>
/* 可以在这里添加 Admin 容器特有的样式 */
</style>
