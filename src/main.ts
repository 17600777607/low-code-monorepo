import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import startQiankun from '@/qiankun'

const bootstrap = async () => {
  const app = createApp(App)
  // 使用 Pinia 状态管理
  app.use(createPinia())
  // 使用路由
  app.use(router)
  app.mount('#app')
  
  // 等待路由准备就绪后再启动 qiankun
  await router.isReady()
  
  // 延迟启动 qiankun，确保容器组件有机会挂载
  setTimeout(() => {
    startQiankun()
  }, 100)
}

bootstrap()
