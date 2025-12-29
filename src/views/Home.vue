<template>
  <div class="flex min-h-screen flex-col bg-gradient-to-br from-indigo-500 to-purple-600">
    <header class="px-5 pb-10 pt-15 text-center text-white">
      <h1 class="mb-4 text-5xl font-bold drop-shadow-md md:text-6xl">低代码平台 - 工作台</h1>
      <p class="m-0 text-lg opacity-90">微前端架构 | 模块化设计</p>
    </header>

    <div
      class="mx-auto grid w-full max-w-screen-xl flex-1 content-center items-start gap-6 px-6 pb-15 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="app in microApps"
        :key="app.name"
        class="flex cursor-pointer flex-col items-center rounded-2xl bg-white p-8 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        @click="navigateTo(app.activeRule as string)"
      >
        <div
          class="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl shadow-lg"
          :style="{ background: app.color || '#667eea' }"
        >
          {{ app.icon }}
        </div>
        <h3 class="mb-3 text-2xl font-semibold text-gray-800">{{ app.title }}</h3>
        <p class="m-0 text-sm leading-relaxed text-gray-600">{{ app.description }}</p>
      </div>
    </div>

    <footer class="px-6 py-6 text-center text-sm text-white opacity-80">
      <p class="m-0">© 2025 低代码平台 | 所有模块已加载</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { microApps } from '@/qiankun/micro-apps'
const router = useRouter()

/**
 * 导航到指定应用
 */
const navigateTo = (path: string) => {
  router.push(path)
}
</script>
