<template>
  <div class="container">
    <div class="back-button" @click="goBack">← 返回工作台</div>
    <div class="micro-app-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载账号中心...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button class="error-button" @click="goBack">返回工作台</button>
      </div>
      <component :is="accountApp" v-else-if="accountApp" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, type Component } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 通过模块联邦动态加载账号中心应用
 * 使用 shallowRef 避免对组件对象进行深度响应式转换
 */
const accountApp = shallowRef<Component | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    console.log('开始加载远程模块 accountApp/App...')
    // 通过模块联邦加载远程组件
    const module = await import('accountApp/App')
    console.log('远程模块加载成功:', module)
    accountApp.value = module.default
    loading.value = false
  } catch (err) {
    // 加载失败处理
    console.error('远程模块加载失败:', err)
    error.value = `账号中心加载失败: ${err instanceof Error ? err.message : String(err)}`
    loading.value = false
  }
})

/**
 * 返回工作台
 */
const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

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
