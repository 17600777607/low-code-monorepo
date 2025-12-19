<template>
  <div id="app">
    <header>
      <img alt="Vue logo" src="./assets/logo.png" class="logo" />
      <h1>Vue3 + Webpack5 微前端架构</h1>
    </header>

    <main>
      <section class="local-section">
        <h2>主应用组件</h2>
        <HelloWorld msg="欢迎使用 Vue3 + TypeScript + Module Federation" />
      </section>

      <section class="micro-section">
        <h2>微应用组件</h2>
        <Suspense>
          <template #default>
            <MicroAppComponent />
          </template>
          <template #fallback>
            <div class="loading">正在加载微应用...</div>
          </template>
        </Suspense>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, h } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

// 微应用加载状态
const microAppError = ref(false)
const microAppLoading = ref(true)

// 降级组件 - 使用 h 函数定义函数式组件
const FallbackComponent = () =>
  h('div', { class: 'fallback' }, [
    h('h3', '💡 微应用提示'),
    h('p', '微应用当前未启动或无法连接'),
    h('p', { class: 'hint' }, ['启动微应用: ', h('code', 'pnpm run dev:micro')]),
    h('p', { class: 'hint' }, ['端口: ', h('strong', 'http://localhost:3001')]),
  ])

// 动态加载微应用组件
const MicroAppComponent = defineAsyncComponent({
  loader: () => {
    return import('microExample/HelloWorld')
      .then(module => {
        microAppLoading.value = false
        return module.default || module
      })
      .catch(err => {
        console.warn('微应用加载失败,可能是微应用未启动:', err.message)
        microAppError.value = true
        microAppLoading.value = false
        // 返回降级组件
        return FallbackComponent
      })
  },
  delay: 200,
  timeout: 3000,
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

header {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

h1 {
  color: #2c3e50;
  font-size: 2em;
  font-weight: 600;
}

main {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
}

section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
  border-left: 4px solid #667eea;
  padding-left: 15px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #667eea;
  font-size: 1.2em;
}

.error {
  text-align: center;
  padding: 40px;
  color: #f56c6c;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 8px;
}

.fallback {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.fallback h3 {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: white;
}

.fallback p {
  margin: 10px 0;
  font-size: 1.1em;
}

.fallback .hint {
  font-size: 0.95em;
  opacity: 0.9;
}

.fallback code {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.fallback strong {
  color: #ffd89b;
}
</style>
