<template>
  <div class="home-page">
    <div class="hero">
      <img alt="Vue logo" src="../assets/logo.png" class="logo" />
      <h1>🏠 主应用首页</h1>
      <p class="subtitle">欢迎使用 Vue3 + Webpack5 + Module Federation 微前端架构</p>
    </div>

    <div class="content">
      <section class="feature-card">
        <h2>✨ 核心特性</h2>
        <ul>
          <li>🚀 Vue3 + TypeScript + Webpack5</li>
          <li>🎯 Module Federation 微前端架构</li>
          <li>📦 主包和子包独立路由系统</li>
          <li>🔥 热模块替换 (HMR)</li>
          <li>💪 TypeScript 类型支持</li>
        </ul>
      </section>

      <section class="feature-card">
        <h2>🎨 本地组件演示</h2>
        <HelloWorld msg="这是主应用的本地组件" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

h1 {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 30px;
}
</style>
