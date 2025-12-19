<template>
  <div class="hello">
    <h3>{{ msg }}</h3>
    <p>
      这是一个通过 <strong>Module Federation</strong> 暴露的 Vue3 组件。
    </p>
    <button @click="count++">点击次数: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  msg: string
}

defineProps<Props>()

const count = ref(0)
</script>

<style scoped>
.hello {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}

button {
  background: white;
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
