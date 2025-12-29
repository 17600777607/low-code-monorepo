<template>
  <GoBackWorkbench />
  <MicroAppContainer
    :container-id="findMicroApp(appName)?.container?.replace('#', '')"
    :app-name="appName"
    @ready="handleContainerReady"
  />
</template>

<script setup lang="ts">
import consola from 'consola'
import { useRoute } from 'vue-router'
import MicroAppContainer from '@/components/MicroAppContainer.vue'
import { findMicroApp } from '@/qiankun'
import { GoBackWorkbench } from '@/components'
const route = useRoute()
const appName = route.params.appName as string

/**
 * 容器准备就绪回调
 * @param containerId - 容器 ID
 */
const handleContainerReady = (containerId: string) => {
  consola.success(`[${appName}Container] 微应用容器已准备就绪: ${containerId}`)
}
</script>

<style scoped></style>
