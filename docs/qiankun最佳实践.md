# qiankun 微前端最佳实践

## 📋 目录

- [代码组织](#代码组织)
- [配置管理](#配置管理)
- [生命周期管理](#生命周期管理)
- [通信方案](#通信方案)
- [样式隔离](#样式隔离)
- [性能优化](#性能优化)
- [错误处理](#错误处理)
- [开发调试](#开发调试)
- [部署策略](#部署策略)

## 代码组织

### ✅ 推荐的项目结构

```
src/
├── main.ts                      # 主应用入口（简洁）
├── micro-apps.config.ts         # 微应用配置（集中管理）
└── utils/
    └── qiankun-lifecycle.ts     # 生命周期钩子（可复用）
```

### 主应用入口 (main.ts)

**✅ 好的做法：简洁清晰**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerMicroApps, start } from 'qiankun'
import App from './App.vue'
import router from './router'
import { microApps, qiankunConfig, lifecycles } from './micro-apps.config'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')

// 注册微应用（带生命周期钩子）
registerMicroApps(microApps, lifecycles)

// 启动 qiankun
start(qiankunConfig)
```

**❌ 不好的做法：配置散乱**

```typescript
// 不要在 main.ts 中直接写大量配置
registerMicroApps([
  {
    name: 'account',
    entry: '//localhost:5001',
    container: '#micro-app-container',
    activeRule: '/account',
    props: {
      routerBase: '/account',
      // ... 更多配置
    },
  },
  // ... 更多微应用
])

start({
  prefetch: true,
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: true,
  },
  // ... 更多配置
})
```

## 配置管理

### ✅ 集中式配置文件 (micro-apps.config.ts)

```typescript
import type { RegistrableApp, FrameworkConfiguration } from 'qiankun'
import {
  beforeLoad,
  beforeMount,
  afterMount,
  beforeUnmount,
  afterUnmount,
} from './utils/qiankun-lifecycle'

const isDev = import.meta.env.DEV

/**
 * 微应用配置列表
 */
export const microApps: RegistrableApp<Record<string, unknown>>[] = [
  {
    name: 'account',
    entry: isDev ? '//localhost:5001' : '/account/',
    container: '#micro-app-container',
    activeRule: '/account',
    props: {
      routerBase: '/account',
    },
  },
]

/**
 * qiankun 启动配置
 */
export const qiankunConfig: FrameworkConfiguration = {
  prefetch: true,
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: true,
  },
  singular: false,
  fetch: window.fetch,
}

/**
 * 微应用生命周期配置
 */
export const lifecycles = {
  beforeLoad,
  beforeMount,
  afterMount,
  beforeUnmount,
  afterUnmount,
}
```

### 配置说明

#### 1. 环境区分

```typescript
const isDev = import.meta.env.DEV

// 开发环境使用本地端口，生产环境使用相对路径
entry: isDev ? '//localhost:5001' : '/account/'
```

#### 2. 容器配置

```typescript
// 所有微应用共享同一个容器
container: '#micro-app-container'

// 或为每个微应用指定独立容器
container: '#account-container'
```

#### 3. 激活规则

```typescript
// 路径匹配
activeRule: '/account'

// 函数匹配（更灵活）
activeRule: location => location.pathname.startsWith('/account')

// 数组匹配（多个路径）
activeRule: ['/account', '/user']
```

## 生命周期管理

### ✅ 独立的生命周期文件 (qiankun-lifecycle.ts)

```typescript
import consola from 'consola'

interface MicroAppInfo {
  name: string
  [key: string]: unknown
}

export function beforeLoad(app: MicroAppInfo) {
  consola.start(`[qiankun] 正在加载微应用: ${app.name}`)
  return Promise.resolve()
}

export function beforeMount(app: MicroAppInfo) {
  consola.info(`[qiankun] 正在挂载微应用: ${app.name}`)
  return Promise.resolve()
}

export function afterMount(app: MicroAppInfo) {
  consola.success(`[qiankun] 微应用挂载成功: ${app.name}`)
  return Promise.resolve()
}

export function beforeUnmount(app: MicroAppInfo) {
  consola.info(`[qiankun] 正在卸载微应用: ${app.name}`)
  return Promise.resolve()
}

export function afterUnmount(app: MicroAppInfo) {
  consola.success(`[qiankun] 微应用卸载成功: ${app.name}`)
  return Promise.resolve()
}
```

### 生命周期最佳实践

#### 1. beforeLoad - 预加载资源

```typescript
export function beforeLoad(app: MicroAppInfo) {
  // 可以在这里预加载一些全局资源
  console.log(`准备加载: ${app.name}`)

  // 显示加载动画
  showLoading()

  return Promise.resolve()
}
```

#### 2. beforeMount - 准备挂载环境

```typescript
export function beforeMount(app: MicroAppInfo) {
  // 准备挂载环境
  console.log(`准备挂载: ${app.name}`)

  // 设置全局状态
  store.setCurrentApp(app.name)

  return Promise.resolve()
}
```

#### 3. afterMount - 挂载后处理

```typescript
export function afterMount(app: MicroAppInfo) {
  // 隐藏加载动画
  hideLoading()

  // 记录访问日志
  logAccess(app.name)

  return Promise.resolve()
}
```

#### 4. beforeUnmount - 清理前准备

```typescript
export function beforeUnmount(app: MicroAppInfo) {
  // 保存状态
  saveAppState(app.name)

  // 清理定时器
  clearTimers()

  return Promise.resolve()
}
```

#### 5. afterUnmount - 清理资源

```typescript
export function afterUnmount(app: MicroAppInfo) {
  // 清理全局状态
  store.clearAppState(app.name)

  // 清理缓存
  clearCache(app.name)

  return Promise.resolve()
}
```

## 通信方案

### 1. Props 传递（推荐用于初始化数据）

**主应用传递：**

```typescript
export const microApps: RegistrableApp<Record<string, unknown>>[] = [
  {
    name: 'account',
    entry: '//localhost:5001',
    container: '#micro-app-container',
    activeRule: '/account',
    props: {
      routerBase: '/account',
      token: getToken(),
      userInfo: getUserInfo(),
      onLogout: handleLogout,
    },
  },
]
```

**子应用接收：**

```typescript
renderWithQiankun({
  mount(props) {
    console.log('接收到的 props:', props)
    const { token, userInfo, onLogout } = props

    // 使用传递的数据
    setToken(token)
    setUserInfo(userInfo)

    render(props)
  },
})
```

### 2. 全局状态管理（推荐用于动态数据）

**主应用初始化：**

```typescript
import { initGlobalState, MicroAppStateActions } from 'qiankun'

// 初始化全局状态
const actions: MicroAppStateActions = initGlobalState({
  user: null,
  token: '',
  theme: 'light',
})

// 监听状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log('主应用监听到状态变化:', state, prev)
})

// 修改状态
actions.setGlobalState({
  user: { name: '张三', id: 1 },
  token: 'xxx',
})

// 将 actions 传递给子应用
export const microApps: RegistrableApp<Record<string, unknown>>[] = [
  {
    name: 'account',
    entry: '//localhost:5001',
    container: '#micro-app-container',
    activeRule: '/account',
    props: {
      actions,
    },
  },
]
```

**子应用使用：**

```typescript
renderWithQiankun({
  mount(props) {
    // 监听全局状态变化
    props.actions?.onGlobalStateChange((state, prev) => {
      console.log('子应用监听到状态变化:', state, prev)

      // 更新本地状态
      if (state.user) {
        updateUser(state.user)
      }
    })

    // 修改全局状态
    props.actions?.setGlobalState({
      token: 'new-token',
    })

    render(props)
  },
})
```

### 3. 事件总线（适用于简单通信）

**创建事件总线：**

```typescript
// src/utils/event-bus.ts
import mitt from 'mitt'

type Events = {
  'user:login': { userId: string; username: string }
  'user:logout': void
  'theme:change': { theme: 'light' | 'dark' }
}

export const eventBus = mitt<Events>()
```

**主应用使用：**

```typescript
import { eventBus } from '@/utils/event-bus'

// 监听事件
eventBus.on('user:login', data => {
  console.log('用户登录:', data)
})

// 触发事件
eventBus.emit('user:login', { userId: '1', username: '张三' })

// 传递给子应用
export const microApps: RegistrableApp<Record<string, unknown>>[] = [
  {
    name: 'account',
    props: {
      eventBus,
    },
  },
]
```

## 样式隔离

### 1. 实验性样式隔离（推荐）

```typescript
export const qiankunConfig: FrameworkConfiguration = {
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: true, // 推荐
  },
}
```

**优点：**

- 不影响弹窗、下拉菜单等组件
- 兼容性好
- 性能好

**原理：**

- 动态添加特殊的选择器前缀
- 不使用 Shadow DOM

### 2. 严格样式隔离（谨慎使用）

```typescript
export const qiankunConfig: FrameworkConfiguration = {
  sandbox: {
    strictStyleIsolation: true, // 使用 Shadow DOM
    experimentalStyleIsolation: false,
  },
}
```

**缺点：**

- 可能导致弹窗、下拉菜单等组件样式丢失
- 需要修改 UI 库配置

### 3. 手动样式隔离（最灵活）

**使用 CSS Modules：**

```vue
<style module>
.container {
  padding: 20px;
}
</style>
```

**使用 scoped：**

```vue
<style scoped>
.container {
  padding: 20px;
}
</style>
```

**使用 BEM 命名规范：**

```css
.account-container {
}
.account-container__header {
}
.account-container__header--active {
}
```

## 性能优化

### 1. 预加载策略

```typescript
export const qiankunConfig: FrameworkConfiguration = {
  // 预加载所有微应用
  prefetch: true,

  // 或只预加载指定微应用
  prefetch: ['account', 'designer'],

  // 或自定义预加载策略
  prefetch: apps => {
    // 只预加载首页相关的微应用
    return apps.filter(app => ['account', 'home'].includes(app.name))
  },
}
```

### 2. 按需加载

```typescript
import { loadMicroApp } from 'qiankun'

// 手动加载微应用
const microApp = loadMicroApp({
  name: 'account',
  entry: '//localhost:5001',
  container: '#container',
  props: { data: 'xxx' },
})

// 卸载微应用
microApp.unmount()
```

### 3. 资源缓存

```typescript
export const qiankunConfig: FrameworkConfiguration = {
  // 自定义 fetch 方法，添加缓存
  fetch: (url, ...args) => {
    // 检查缓存
    const cached = getCache(url)
    if (cached) {
      return Promise.resolve(new Response(cached))
    }

    // 发起请求
    return window.fetch(url, ...args).then(response => {
      // 缓存响应
      response
        .clone()
        .text()
        .then(text => {
          setCache(url, text)
        })
      return response
    })
  },
}
```

### 4. 代码分割

**子应用使用路由懒加载：**

```typescript
const routes = [
  {
    path: '/login',
    component: () => import('./views/Login.vue'),
  },
  {
    path: '/register',
    component: () => import('./views/Register.vue'),
  },
]
```

## 错误处理

### 1. 全局错误处理

```typescript
import { addGlobalUncaughtErrorHandler } from 'qiankun'

// 添加全局错误处理器
addGlobalUncaughtErrorHandler(event => {
  console.error('微应用加载错误:', event)

  // 显示错误提示
  showErrorNotification('微应用加载失败，请刷新页面重试')

  // 上报错误
  reportError(event)
})
```

### 2. 生命周期错误处理

```typescript
export function beforeLoad(app: MicroAppInfo) {
  try {
    consola.start(`[qiankun] 正在加载微应用: ${app.name}`)
    return Promise.resolve()
  } catch (error) {
    console.error(`加载 ${app.name} 失败:`, error)
    return Promise.reject(error)
  }
}
```

### 3. 加载超时处理

```typescript
export const microApps: RegistrableApp<Record<string, unknown>>[] = [
  {
    name: 'account',
    entry: '//localhost:5001',
    container: '#micro-app-container',
    activeRule: '/account',
    props: {
      timeout: 30000, // 30秒超时
    },
  },
]
```

## 开发调试

### 1. 开发环境配置

```typescript
const isDev = import.meta.env.DEV

export const microApps: RegistrableApp<Record<string, unknown>>[] = [
  {
    name: 'account',
    // 开发环境使用本地端口
    entry: isDev ? '//localhost:5001' : '/account/',
    container: '#micro-app-container',
    activeRule: '/account',
  },
]
```

### 2. 调试工具

```typescript
// 开发环境启用详细日志
if (import.meta.env.DEV) {
  window.__POWERED_BY_QIANKUN__ = true

  // 监听所有生命周期
  export function beforeLoad(app: MicroAppInfo) {
    console.group(`[qiankun] ${app.name} - beforeLoad`)
    console.log('应用信息:', app)
    console.groupEnd()
    return Promise.resolve()
  }
}
```

### 3. 独立运行子应用

```typescript
// 子应用 main.ts
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

// 独立运行时，直接挂载应用
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
```

## 部署策略

### 1. Nginx 配置

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

    # 添加 CORS 头
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
  }
}
```

### 2. 构建配置

**主应用：**

```typescript
// vite.config.ts
export default defineConfig({
  base: '/',
  build: {
    outDir: 'apps/root',
  },
})
```

**子应用：**

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/account/' : '/',
  build: {
    outDir: '../../apps/account',
  },
})
```

### 3. 环境变量

```bash
# .env.development
VITE_APP_BASE_URL=http://localhost:5173
VITE_ACCOUNT_URL=http://localhost:5001

# .env.production
VITE_APP_BASE_URL=https://example.com
VITE_ACCOUNT_URL=https://example.com/account
```

## 常见问题

### 1. 子应用静态资源 404

**原因：** 子应用的静态资源路径不正确

**解决：**

```typescript
// 子应用 vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/account/' : '/',
})
```

### 2. 样式冲突

**原因：** 主应用和子应用的样式相互影响

**解决：**

```typescript
// 启用样式隔离
export const qiankunConfig: FrameworkConfiguration = {
  sandbox: {
    experimentalStyleIsolation: true,
  },
}
```

### 3. 路由冲突

**原因：** 主应用和子应用的路由冲突

**解决：**

```typescript
// 子应用使用独立的路由基础路径
const router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/account' : '/'),
  routes,
})
```

## 总结

### 核心原则

1. **配置集中化** - 将配置提取到独立文件
2. **职责单一化** - 每个文件只负责一件事
3. **类型安全化** - 使用 TypeScript 类型
4. **错误可控化** - 完善的错误处理机制
5. **性能优先化** - 合理使用预加载和缓存

### 推荐的文件结构

```
src/
├── main.ts                      # 主应用入口（简洁）
├── micro-apps.config.ts         # 微应用配置
├── utils/
│   ├── qiankun-lifecycle.ts     # 生命周期钩子
│   ├── event-bus.ts             # 事件总线
│   └── global-state.ts          # 全局状态管理
└── views/
    └── MicroAppContainer.vue    # 微应用容器组件
```

### 关键配置

```typescript
// 1. 环境区分
const isDev = import.meta.env.DEV

// 2. 样式隔离
experimentalStyleIsolation: true

// 3. 预加载
prefetch: true

// 4. 生命周期
registerMicroApps(microApps, lifecycles)
```
