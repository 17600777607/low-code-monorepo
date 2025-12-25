import { createApp } from 'vue'
import App from './App.vue'
import { consola } from 'consola'

consola.success('应用启动...')

createApp(App).mount('#app')
