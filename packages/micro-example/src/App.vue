<template>
  <div id="micro-app">
    <h2>微应用示例</h2>
    <HelloWorld msg="来自微应用的组件" />
  </div>
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<style scoped>
#micro-app {
  padding: 20px;
  border: 2px solid #42b983;
  border-radius: 8px;
  
  margin: 20px;
}

h2 {
  color: #42b983;
}
</style>
