<template>
  <!-- qiankun 微应用容器 -->
  <div :id="containerId" class="micro-app-container"></div>
</template>

<script setup lang="ts">
import consola from 'consola'
import { onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * 组件属性定义
 */
interface Props {
  /** 容器 ID，默认为 'appName-app-container' */
  containerId?: string
  /** 应用名称，用于日志输出 */
  appName?: string
}

/**
 * 组件事件定义
 */
interface Emits {
  /** 容器准备就绪事件 */
  (e: 'ready', containerId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  containerId: (props: Props) => `${props.appName}-app-container`,
  appName: 'MicroApp',
})

const emit = defineEmits<Emits>()

/**
 * 组件挂载后确保容器存在
 * 通过 nextTick 确保 DOM 已经渲染完成
 */
onMounted(async () => {
  await nextTick()
  // 确保容器已经存在
  const container = document.getElementById(props.containerId)
  if (!container) {
    consola.error(`[${props.appName}] 容器元素未找到: ${props.containerId}`)
  } else {
    consola.success(`[${props.appName}] 容器已准备就绪: ${props.containerId}`)
    emit('ready', props.containerId)
  }
})

/**
 * 组件卸载前清理
 */
onBeforeUnmount(() => {
  consola.info(`[${props.appName}] 容器组件卸载`)
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

.micro-app-container {
  width: 100%;
  min-height: 100vh;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 18px;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
}

.error p {
  color: #f56c6c;
  font-size: 16px;
  margin-bottom: 20px;
}

.error-button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.error-button:hover {
  background: #5568d3;
}
</style>
