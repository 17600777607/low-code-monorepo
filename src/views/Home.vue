<template>
  <div class="home-container">
    <header class="header">
      <h1>低代码平台 - 工作台</h1>
      <p class="subtitle">微前端架构 | 模块化设计</p>
    </header>

    <div class="app-grid">
      <div v-for="app in apps" :key="app.path" class="app-card" @click="navigateTo(app.path)">
        <div class="app-icon" :style="{ backgroundColor: app.color }">
          {{ app.icon }}
        </div>
        <h3 class="app-title">{{ app.title }}</h3>
        <p class="app-description">{{ app.description }}</p>
      </div>
    </div>

    <footer class="footer">
      <p>© 2025 低代码平台 | 所有模块已加载</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 应用列表配置
 */
const apps = [
  {
    title: '账号中心',
    description: '统一登录、注册、找回密码等功能',
    path: '/account',
    icon: '👤',
    color: '#4CAF50',
  },
]

/**
 * 导航到指定应用
 */
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  padding: 60px 20px 40px;
  color: white;
}

.header h1 {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.app-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.app-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.app-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.app-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #333;
}

.app-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.footer {
  text-align: center;
  padding: 24px;
  color: white;
  opacity: 0.8;
  font-size: 14px;
}

.footer p {
  margin: 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 32px;
  }

  .app-grid {
    grid-template-columns: 1fr;
    padding: 0 16px 40px;
  }
}
</style>
