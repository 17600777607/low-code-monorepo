<template>
  <div class="hello">
    <h3>{{ msg }}</h3>
    <div class="features">
      <div class="feature-card">
        <span class="icon">🚀</span>
        <h4>Webpack 5</h4>
        <p>采用最新的 Webpack 5 构建工具</p>
      </div>
      <div class="feature-card">
        <span class="icon">📦</span>
        <h4>Module Federation</h4>
        <p>支持微前端动态加载</p>
      </div>
      <div class="feature-card">
        <span class="icon">💎</span>
        <h4>TypeScript</h4>
        <p>完整的类型支持</p>
      </div>
      <div class="feature-card">
        <span class="icon">🎨</span>
        <h4>Prettier</h4>
        <p>统一的代码格式化</p>
      </div>
    </div>
    <div class="counter">
      <button @click="count++">点击次数: {{ count }}</button>
    </div>
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
  padding: 20px;
}

h3 {
  color: #2c3e50;
  font-size: 1.8em;
  margin-bottom: 30px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.feature-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.icon {
  font-size: 3em;
  display: block;
  margin-bottom: 15px;
}

.feature-card h4 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: white;
}

.feature-card p {
  font-size: 0.9em;
  opacity: 0.9;
  margin: 0;
}

.counter {
  margin-top: 30px;
}

.counter button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.counter button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.counter button:active {
  transform: translateY(0);
}
</style>
