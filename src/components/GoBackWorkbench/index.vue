<template>
  <el-button
    :icon="ArrowLeft"
    round
    class="fixed top-5 left-5 z-1000 shadow-lg transition-all duration-300 hover:-translate-x-1 hover:shadow-2xl"
    @click="handleGoBack"
  >
    返回工作台
  </el-button>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()

/**
 * 返回工作台
 */
const handleGoBack = () => {
  router.push('/')
}
</script>
