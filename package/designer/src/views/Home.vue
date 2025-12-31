<template>
  <div class="flex min-h-screen flex-col bg-linear-to-br from-indigo-500 to-purple-600">
    <header class="px-5 pt-15 pb-10 text-center text-white">
      <h1 class="mb-4 text-5xl font-bold drop-shadow-md md:text-6xl">低代码平台 - 设计器</h1>
      <p class="m-0 text-lg opacity-90">微前端架构 | 模块化设计</p>
    </header>

    <div
      class="mx-auto flex w-full max-w-7xl flex-1 flex-row flex-wrap content-center gap-6 px-6 pb-15"
    >
      <div
        v-for="app in modules"
        :key="app.name"
        :style="{ background: app.color || '#667eea' }"
        class="flex w-[280px] flex-1 cursor-pointer flex-col items-center rounded-2xl bg-white p-8 text-center text-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:bg-linear-to-br hover:from-indigo-50 hover:to-purple-100 hover:shadow-2xl"
        @click="navigateTo(app.path as string)"
      >
        <div
          class="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-lg"
        >
          {{ app.icon }}
        </div>
        <h3 class="mb-3 text-2xl font-semibold text-white">{{ app.title }}</h3>
        <p class="m-0 text-sm leading-relaxed text-white">{{ app.description }}</p>
      </div>
    </div>

    <footer class="px-6 py-6 text-center text-sm text-white opacity-80">
      <p class="m-0">© 2025 低代码平台 | 所有模块已加载</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const modules = [
  {
    title: '页面设计器',
    description: '页面设计器',
    icon: '🚀',
    color: '#667eea',
    path: '/draw-designer',
  },
]
const router = useRouter()

/**
 * 导航到指定应用
 */
const navigateTo = (path: string) => {
  router.push(path)
}
</script>
