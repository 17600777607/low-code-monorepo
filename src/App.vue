<template>
  <div id="app">
    <div class="header">
      <h1>🚀 Vue3 + Webpack5 应用</h1>
      <p>主应用运行在 localhost:3000</p>
    </div>

    <div class="container">
      <div class="card">
        <h2>📦 Vue3 应用</h2>
        <p>这是一个简单的 Vue3 + Webpack5 应用</p>
        <button @click="count++">点击次数: {{ count }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

#app {
  min-height: 100vh;
  padding: 40px 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.header p {
  font-size: 1.2em;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.card h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.8em;
}

.card p {
  color: #666;
  margin-bottom: 20px;
  font-size: 1.1em;
}

.card button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: transform 0.2s;
}

.card button:hover {
  transform: translateY(-2px);
}

.hint {
  color: #999;
  font-size: 0.9em;
  font-style: italic;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #667eea;
  font-size: 1.1em;
}

.fallback {
  text-align: center;
  padding: 30px;
  background: #fff3cd;
  border-radius: 8px;
  border: 2px dashed #ffc107;
}

.fallback h3 {
  color: #856404;
  margin-bottom: 10px;
}

.fallback p {
  color: #856404;
  margin: 8px 0;
}

.fallback code {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
