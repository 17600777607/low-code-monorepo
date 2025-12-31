<template>
  <div class="flex h-10 items-center justify-between border-b border-gray-200 bg-white px-2">
    <el-button :icon="ArrowLeft" round text @click="handleGoBack"> 返回工作台 </el-button>
    <!-- <div class="flex items-center">11</div> -->
    <div class="flex items-center">
      <el-button-group>
        <el-button size="small" :icon="Delete" @click="handleClearCanvas"> 清空 </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Delete } from '@element-plus/icons-vue'

const emit = defineEmits(['goBack', 'clearCanvas'])

const handleGoBack = () => {
  emit('goBack')
}

const handleClearCanvas = () => {
  emit('clearCanvas')
}
</script>
