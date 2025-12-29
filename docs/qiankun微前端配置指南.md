# qiankun 微前端配置指南

## 概述

本项目已从 Vite 联邦模块迁移到 qiankun 微前端架构。qiankun 是一个基于 single-spa 的微前端实现库，提供了更完善的沙箱隔离和生命周期管理。

## 架构说明

### 主应用（Main App）

- **端口**: 5173
- **职责**: 作为微前端容器，负责注册和管理子应用
- **技术栈**: Vue 3 + Vite + qiankun

### 子应用（Micro Apps）

#### 账号中心（Account）

- **端口**: 5001
- **路由**: `/account`
- **职责**: 提供登录、注册、找回密码等功能
- **技术栈**: Vue 3 + Vite + vite-plugin-qiankun

## 开发指南

### 启动应用

#### 1. 启动主应用

```bash
pnpm dev
```

#### 2. 启动子应用（账号中心）

```bash
pnpm dev:account
```

**注意**: 必须同时启动主应用和子应用，主应用才能正确加载子应用。

### 独立运行子应用

子应用支持独立运行，便于开发和调试：

```bash
cd @cwj/account
pnpm dev
```

访问 `http://localhost:5001` 即可独立查看账号中心应用。

## 配置说明

### 主应用配置

#### main.ts

```typescript
import { registerMicroApps, start } from 'qiankun'

// 注册微应用
registerMicroApps([
  {
    name: 'account', // 应用名称
    entry: '//localhost:5001', // 应用入口
    container: '#micro-app-container', // 应用挂载的容器
    activeRule: '/account', // 应用激活规则
    props: {
      routerBase: '/account', // 传递给子应用的路由基础路径
    },
  },
])

// 启动 qiankun
start({
  prefetch: true, // 预加载
  sandbox: {
    strictStyleIsolation: false, // 样式隔离
    experimentalStyleIsolation: true, // 实验性样式隔离
  },
})
```

#### 路由配置

主应用路由需要为子应用预留路由空间：

```typescript
{
  path: '/account',
  name: 'account',
  component: AccountContainer,  // 容器组件
}
```

#### 容器组件

```vue
<template>
  <div class="container">
    <!-- qiankun 微应用容器 -->
    <div id="micro-app-container"></div>
  </div>
</template>
```

### 子应用配置

#### vite.config.ts

```typescript
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    qiankun('account', {
      useDevMode: true,
    }),
  ],
  server: {
    port: 5001,
    cors: true,
    origin: 'http://localhost:5001', // qiankun 需要明确的 origin
  },
})
```

#### main.ts

```typescript
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let app: VueApp<Element> | null = null

function render(props = {}) {
  const { container } = props
  app = createApp(App)
  const containerEl = container ? container.querySelector('#app') : document.getElementById('app')
  app.mount(containerEl || '#app')
}

// qiankun 生命周期钩子
renderWithQiankun({
  bootstrap() {
    console.log('[account] bootstrap')
  },
  mount(props) {
    console.log('[account] mount', props)
    render(props)
  },
  unmount(props) {
    console.log('[account] unmount', props)
    if (app) {
      app.unmount()
      app = null
    }
  },
})

// 独立运行时，直接挂载应用
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
```

## 生命周期说明

### bootstrap

- **触发时机**: 微应用初始化时调用一次
- **用途**: 初始化全局变量、配置等

### mount

- **触发时机**: 每次进入微应用时调用
- **用途**: 渲染微应用、初始化路由等

### unmount

- **触发时机**: 每次离开微应用时调用
- **用途**: 卸载微应用、清理副作用

### update（可选）

- **触发时机**: 使用 `loadMicroApp` 方式加载时，props 更新时调用
- **用途**: 更新微应用状态

## 通信方案

### 主应用向子应用传递数据

通过 `props` 传递：

```typescript
registerMicroApps([
  {
    name: 'account',
    entry: '//localhost:5001',
    container: '#micro-app-container',
    activeRule: '/account',
    props: {
      routerBase: '/account',
      userData: {
        /* ... */
      },
      onGlobalStateChange: () => {},
    },
  },
])
```

子应用接收：

```typescript
renderWithQiankun({
  mount(props) {
    console.log('接收到的数据:', props)
    render(props)
  },
})
```

### 全局状态管理

使用 qiankun 提供的全局状态管理：

```typescript
import { initGlobalState } from 'qiankun'

// 主应用初始化全局状态
const actions = initGlobalState({
  user: null,
  token: '',
})

// 监听状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log('状态变化:', state, prev)
})

// 修改状态
actions.setGlobalState({ user: { name: '张三' } })
```

子应用使用：

```typescript
renderWithQiankun({
  mount(props) {
    // 监听全局状态
    props.onGlobalStateChange?.((state, prev) => {
      console.log('子应用接收状态变化:', state, prev)
    })

    // 修改全局状态
    props.setGlobalState?.({ token: 'xxx' })
  },
})
```

## 样式隔离

qiankun 提供了两种样式隔离方案：

### 1. 严格样式隔离（strictStyleIsolation）

使用 Shadow DOM 实现完全隔离，但可能导致一些 UI 库样式失效。

```typescript
start({
  sandbox: {
    strictStyleIsolation: true,
  },
})
```

### 2. 实验性样式隔离（experimentalStyleIsolation）

通过动态添加特殊选择器实现样式隔离，推荐使用。

```typescript
start({
  sandbox: {
    experimentalStyleIsolation: true,
  },
})
```

## 常见问题

### 1. 子应用加载失败

**原因**: 子应用未启动或端口不正确

**解决**: 确保子应用已启动，并检查 `entry` 配置是否正确

### 2. 样式丢失

**原因**: 样式隔离导致全局样式无法应用

**解决**:

- 使用 scoped 样式
- 调整样式隔离配置
- 使用 CSS Modules

### 3. 路由冲突

**原因**: 主应用和子应用路由冲突

**解决**:

- 为子应用设置独立的路由前缀
- 使用 `activeRule` 明确激活规则

### 4. 静态资源加载失败

**原因**: 子应用静态资源路径不正确

**解决**: 在子应用 `vite.config.ts` 中配置 `base`:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/account/' : '/',
})
```

## 构建部署

### 开发环境

```bash
# 主应用
pnpm dev

# 子应用
pnpm dev:account
```

### 生产环境

```bash
# 构建主应用
pnpm build:production

# 构建子应用
cd @cwj/account
pnpm build:production
```

### 部署配置

#### Nginx 配置示例

```nginx
server {
  listen 80;
  server_name example.com;

  # 主应用
  location / {
    root /var/www/apps/root;
    try_files $uri $uri/ /index.html;
  }

  # 子应用 - 账号中心
  location /account/ {
    root /var/www/apps;
    try_files $uri $uri/ /account/index.html;
  }
}
```

## 性能优化

### 1. 预加载

```typescript
start({
  prefetch: true, // 开启预加载
})
```

### 2. 预加载策略

```typescript
start({
  prefetch: 'all', // 预加载所有子应用
  // 或
  prefetch: ['account'], // 只预加载指定子应用
})
```

### 3. 手动加载

```typescript
import { loadMicroApp } from 'qiankun'

// 手动加载子应用
const microApp = loadMicroApp({
  name: 'account',
  entry: '//localhost:5001',
  container: '#container',
})

// 卸载
microApp.unmount()
```

## 迁移对比

### Vite 联邦模块 vs qiankun

| 特性     | Vite 联邦模块             | qiankun    |
| -------- | ------------------------- | ---------- |
| 技术栈   | Webpack Module Federation | single-spa |
| 样式隔离 | ❌                        | ✅         |
| JS 沙箱  | ❌                        | ✅         |
| 独立运行 | ✅                        | ✅         |
| 预加载   | ✅                        | ✅         |
| 生命周期 | 简单                      | 完善       |
| 通信方案 | 自定义                    | 内置       |
| 学习成本 | 低                        | 中         |
| 社区支持 | 一般                      | 强         |

## 参考资料

- [qiankun 官方文档](https://qiankun.umijs.org/)
- [vite-plugin-qiankun](https://github.com/tengmaoqing/vite-plugin-qiankun)
- [微前端最佳实践](https://micro-frontends.org/)
