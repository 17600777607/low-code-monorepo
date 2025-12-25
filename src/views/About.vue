<template>
  <div class="about-page">
    <div class="header">
      <h1>📖 关于主应用</h1>
      <p>了解我们的微前端架构设计</p>
    </div>

    <div class="content">
      <section class="info-card">
        <h2>🏗️ 项目架构</h2>
        <div class="architecture">
          <div class="arch-item">
            <h3>主应用 (Main App)</h3>
            <p>端口: <code>3000</code></p>
            <p>负责整体布局、路由控制和微应用加载</p>
          </div>
          <div class="arch-item">
            <h3>子应用 (Micro App)</h3>
            <p>端口: <code>3001</code></p>
            <p>独立运行的微前端应用,可被主应用动态加载</p>
          </div>
        </div>
      </section>

      <section class="info-card">
        <h2>🔧 技术栈</h2>
        <table class="tech-table">
          <tbody>
            <tr>
              <td><strong>框架</strong></td>
              <td>Vue 3.5+ (Composition API)</td>
            </tr>
            <tr>
              <td><strong>语言</strong></td>
              <td>TypeScript 5.3+</td>
            </tr>
            <tr>
              <td><strong>构建工具</strong></td>
              <td>Webpack 5 + Module Federation</td>
            </tr>
            <tr>
              <td><strong>路由</strong></td>
              <td>Vue Router 4</td>
            </tr>
            <tr>
              <td><strong>包管理</strong></td>
              <td>pnpm 8+</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="info-card">
        <h2>🚀 快速开始</h2>
        <div class="commands">
          <div class="command-item">
            <h4>启动主应用</h4>
            <code>pnpm run dev</code>
          </div>
          <div class="command-item">
            <h4>启动子应用</h4>
            <code>pnpm run dev:micro</code>
          </div>
          <div class="command-item">
            <h4>构建所有应用</h4>
            <code>pnpm run build:all</code>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关于页面无需额外逻辑
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  padding: 20px;
}

.header {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 16px;
  margin-bottom: 40px;
  box-shadow: 0 10px 40px rgba(245, 87, 108, 0.3);
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 700;
}

.header p {
  font-size: 1.2em;
  opacity: 0.95;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 30px;
}

.info-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-card h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.6em;
  border-left: 4px solid #f5576c;
  padding-left: 15px;
}

.architecture {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.arch-item {
  padding: 20px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 8px;
  border: 2px solid #667eea30;
}

.arch-item h3 {
  color: #667eea;
  margin-bottom: 10px;
  font-size: 1.2em;
}

.arch-item p {
  margin: 8px 0;
  color: #555;
  line-height: 1.6;
}

.arch-item code {
  background: #667eea20;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  color: #667eea;
}

.tech-table {
  width: 100%;
  border-collapse: collapse;
}

.tech-table tr {
  border-bottom: 1px solid #f0f0f0;
}

.tech-table tr:last-child {
  border-bottom: none;
}

.tech-table td {
  padding: 15px 10px;
  font-size: 1.05em;
}

.tech-table td:first-child {
  width: 150px;
  color: #2c3e50;
}

.tech-table td:last-child {
  color: #555;
}

.commands {
  display: grid;
  gap: 15px;
}

.command-item {
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #f5576c;
}

.command-item h4 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.1em;
}

.command-item code {
  background: #2c3e50;
  color: #4ade80;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 1.05em;
  display: inline-block;
  font-family: 'Courier New', monospace;
}
</style>
