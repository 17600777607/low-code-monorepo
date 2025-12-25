前端低代码平台

## 📖 项目概述

基于 Vue3 + TypeScript + Webpack5 Module Federation 的微前端低代码平台,支持可视化设计、多端渲染和统一管理。

## 🛠️ 技术栈

- **前端框架**: Vue 3.5+ + TypeScript 5.3+
- **构建工具**: Webpack 5 + Module Federation
- **包管理**: pnpm Workspace (Monorepo)
- **路由**: Vue Router 4 (History 模式)
- **状态管理**: Pinia 2.x
- **认证授权**: 自研 @cwj/auth (OAuth 2.0 + JWT)
- **UI 组件**: 自研 @cwj/ui-pc、@cwj/ui-mobile
- **工具函数**: 自研 @cwj/tools
- **代码规范**: ESLint + Prettier

## 🏗️ 微前端架构

### 架构方案

- **技术**: Webpack5 Module Federation
- **模式**: 主应用(宿主) + 多个子应用(远程模块)
- **共享依赖**: Vue、Vue Router、Pinia 等核心库单例共享
- **通信方式**:
  - 全局事件总线(跨应用通信)
  - Props/Emit(组件级通信)
  - 共享状态(Pinia Store)

### 应用间关系

```

```

## 📁 项目结构

### 源码结构

- **src/** - 主应用(宿主)
  - 工作台首页、用户中心、操作日志
  - 子应用加载和路由管理
  - 全局状态管理和事件总线
  - 集成 @cwj/auth 认证包
- **@cwj/** - 子应用和公共包
  - **designer/** - 可视化设计器
    - 支持 PC 端和 Mobile 端设计
    - 拖拽式组件编排
    - 实时预览和代码生成
    - **产物输出**: AST(抽象语法树)格式
      - 支持组件树结构
      - 支持指令(v-if/v-for/v-show 等)
      - 支持事件绑定和表达式
      - 支持数据绑定和计算属性
    - 独立访问: `https://xx.xxx.com/designer/`
    - 嵌入模式: 主应用通过 Module Federation 加载
    - 独立路由(Vue Router)、独立状态(Pinia Store)
  - **renderer/** - 多端渲染器
    - **数据源**: 设计器产出的 AST(抽象语法树)
    - **核心能力**:
      - AST 解析引擎
      - 动态组件渲染
      - 指令系统(v-if/v-for/v-show/v-model 等)
      - 事件系统(支持表达式和方法调用)
      - 数据绑定(响应式数据、计算属性)
      - 运行时沙箱环境(安全隔离)
    - 支持 PC 端和 Mobile 端
    - 支持自定义组件扩展
    - 独立访问: `https://xx.xxx.com/renderer/`
    - 嵌入模式: 主应用通过 Module Federation 加载
    - 独立路由、独立状态管理
  - **admin/** - 管理后台
    - 应用管理、页面管理
    - 用户权限管理
    - 数据统计和监控
    - 独立访问: `https://xx.xxx.com/admin/`
    - 嵌入模式: 主应用通过 Module Federation 加载
    - 独立路由、独立状态管理
  - **ui/** - UI 组件库
    - **@cwj/ui-pc**: PC 端组件库(基于 Element Plus 二次封装)
      - **产物输出**:
        - ESM 格式: `dist/index.mjs`
        - CommonJS 格式: `dist/index.cjs`
        - TypeScript 类型: `dist/index.d.ts`
        - 样式文件: `dist/style.css`
    - **@cwj/ui-mobile**: Mobile 端组件库(基于 Vant 二次封装)
      - **产物输出**:
        - ESM 格式: `dist/index.mjs`
        - CommonJS 格式: `dist/index.cjs`
        - TypeScript 类型: `dist/index.d.ts`
        - 样式文件: `dist/style.css`
    - 组件文档站点(VitePress)
    - 发布到私有 npm 仓库
  - **account/** - 账号中心(登录站点) ⭐
    - **功能**:
      - 统一登录页面
      - 用户注册页面
      - 密码找回页面
      - 第三方登录集成(微信/钉钉/企业微信等)
      - OAuth 2.0 授权页面
    - **登录方式**:
      - 账号密码登录
      - 手机验证码登录
      - 扫码登录
      - 第三方登录
    - **访问方式**:
      - 独立站点访问: `https://xx.xxx.com/account/`
      - 所有应用未登录时重定向到此站点
    - 独立路由、独立状态管理
    - 使用 @cwj/auth 包提供的认证能力
  - **auth/** - 认证授权包(npm 包) ⭐
    - **核心功能**:
      - Token 管理(Cookie 存储,利用同源策略)
        - 存储在 Cookie 中
        - 浏览器自动携带(同源请求)
        - 支持跨子应用共享
      - Token 过期检测
      - 权限判断函数
      - URL 拦截(浏览器级别,不依赖框架)
        - 页面加载时检测 Cookie 中的 Token
        - 无 Token 自动跳转到 account 登录
      - Vue Router 守卫(可选,依赖 Vue Router)
        - 路由级权限控制
      - XHR HTTP 请求拦截器(统一拦截所有应用的 HTTP 请求)
        - Cookie 自动携带(无需手动添加)
        - 统一处理业务状态码
          - code: 10001 (Token 过期) → 清除 Cookie,跳转到 account 重新登录
        - 统一的请求/响应日志
        - 统一的错误处理
    - **使用场景**:
      - 主应用: 集成认证能力
      - 子应用: 集成认证能力
      - account 站点: 提供登录功能
    - **导出内容**:
      - `useAuth()` - 认证 Composable(获取/设置/清除 Token)
      - `usePermission()` - 权限判断 Composable
      - `setupUrlGuard()` - URL 拦截器(页面加载时检测 Token)
      - `authGuard()` - Vue Router 守卫函数(可选,路由级权限)
      - `setupXhrInterceptor()` - XHR 顶层拦截器(拦截所有 HTTP 请求)
      - `AuthStore` - Pinia 认证状态
      - 工具函数和类型定义
    - **包类型**: npm 包,发布到私有 npm 仓库
    - **产物输出**:
      - ESM 格式: `dist/index.mjs`
      - CommonJS 格式: `dist/index.cjs`
      - TypeScript 类型: `dist/index.d.ts`
    - **文档站点**: `https://xx.xxx.com/auth/`
    - 所有应用(包括 account 站点)共享使用
  - **tools/** - 工具函数库
    - 通用工具函数(日期、字符串、数组等)
    - 业务工具函数(数据转换、格式化等)
    - 类型定义(TypeScript)
    - **产物输出**:
      - ESM 格式: `dist/index.mjs`
      - CommonJS 格式: `dist/index.cjs`
      - TypeScript 类型: `dist/index.d.ts`
    - 发布到私有 npm 仓库: @cwj/tools

## 🚀 构建和部署

### 本地开发端口规划

| 应用            | 端口 | 访问地址              |
| --------------- | ---- | --------------------- |
| 主应用(Root)    | 3000 | http://localhost:3000 |
| Account(账号)   | 3001 | http://localhost:3001 |
| Designer        | 3002 | http://localhost:3002 |
| Renderer        | 3003 | http://localhost:3003 |
| Admin           | 3004 | http://localhost:3004 |
| Auth 文档       | 3005 | http://localhost:3005 |
| UI 文档(PC)     | 3006 | http://localhost:3006 |
| UI 文档(Mobile) | 3007 | http://localhost:3007 |
| Tools 文档      | 3008 | http://localhost:3008 |

### 开发命令

```bash
# 安装依赖
pnpm install

# 启动主应用
pnpm run dev

# 启动指定子应用
pnpm --filter account dev
pnpm --filter designer dev
pnpm --filter renderer dev
pnpm --filter admin dev

# 构建所有应用
pnpm run build:all

# 构建指定应用
pnpm run build              # 主应用
pnpm --filter account build
pnpm --filter designer build
pnpm --filter renderer build
pnpm --filter admin build
```

### 构建产物目录

- **public/apps/** - 构建产物输出目录
  - **root/** - 主应用产物
    - 工作台相关静态资源
    - nginx 代理: `https://xx.xxx.com`
    - 包含 remoteEntry.js 用于加载子应用
  - **account/** - 账号中心产物
    - 登录、注册、找回密码等页面
    - nginx 代理: `https://xx.xxx.com/account/`
    - 所有应用的统一登录入口
  - **designer/** - 设计器产物
    - 设计器静态资源和 remoteEntry.js
    - nginx 代理: `https://xx.xxx.com/designer/`
    - 支持独立访问和嵌入加载
  - **renderer/** - 渲染器产物
    - 渲染器静态资源和 remoteEntry.js
    - nginx 代理: `https://xx.xxx.com/renderer/`
    - 支持独立访问和嵌入加载
  - **admin/** - 管理后台产物
    - 管理后台静态资源和 remoteEntry.js
    - nginx 代理: `https://xx.xxx.com/admin/`
    - 支持独立访问和嵌入加载
  - **auth/** - 认证包
    - 产物发布到私有 npm 仓库: @cwj/auth
    - 所有应用通过 npm 安装使用
    - 文档站点: `https://xx.xxx.com/auth/`
  - **ui/** - UI 组件库
    - 产物发布到私有 npm 仓库
      - @cwj/ui-pc
      - @cwj/ui-mobile
    - 组件文档站点
      - PC 文档: `https://xx.xxx.com/ui/pc/`
      - Mobile 文档: `https://xx.xxx.com/ui/mobile/`
  - **tools/** - 工具库
    - 产物发布到私有 npm 仓库: @cwj/tools
    - 文档站点: `https://xx.xxx.com/tools/`

### Nginx 配置示例

```nginx
# 主站点
server {
    listen 80;
    server_name xx.xxx.com;

    # 主应用
    location / {
        root /var/www/apps/root;
        try_files $uri $uri/ /index.html;
    }

    # 账号中心 - 路径方式(备选)
    location /account/ {
        alias /var/www/apps/account/;
        try_files $uri $uri/ /account/index.html;
    }

    # 设计器
    location /designer/ {
        alias /var/www/apps/designer/;
        try_files $uri $uri/ /designer/index.html;
    }

    # 渲染器
    location /renderer/ {
        alias /var/www/apps/renderer/;
        try_files $uri $uri/ /renderer/index.html;
    }

    # 管理后台
    location /admin/ {
        alias /var/www/apps/admin/;
        try_files $uri $uri/ /admin/index.html;
    }

    # Auth 文档
    location /auth/ {
        alias /var/www/apps/auth/docs/;
        try_files $uri $uri/ /auth/index.html;
    }

    # UI 文档
    location /ui/ {
        alias /var/www/apps/ui/;
        try_files $uri $uri/ /ui/index.html;
    }

    # Tools 文档
    location /tools/ {
        alias /var/www/apps/tools/;
        try_files $uri $uri/ /tools/index.html;
    }
}
```

## 🔐 认证和授权 (@cwj/auth)

### 包概述

所有应用(主应用和子应用)共享统一的认证授权包 `@cwj/auth`,确保认证逻辑的一致性和可维护性。

### 安装使用

```bash
# 在主应用和各子应用中安装
pnpm add @cwj/auth
```

```typescript
// main.ts - 应用入口
import { createAuth } from '@cwj/auth'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

// 初始化认证模块
const auth = createAuth({
  loginUrl: 'https://xx.xxx.com/account/', // account 登录页地址
  storage: 'cookie', // 使用 Cookie 存储
  tokenKey: 'access_token',
  cookieOptions: {
    domain: '.xxx.com', // 设置域名,支持子域名共享
    path: '/',
    secure: true, // HTTPS 环境下设置为 true
    sameSite: 'Lax', // 防止 CSRF 攻击
  },
})

app.use(pinia)
app.use(auth)
```

### 认证流程(简化版)

#### 技术方案

- **Token**: JWT (JSON Web Token)
- **存储**: localStorage / sessionStorage
- **过期处理**: Token 过期后跳转到 account 重新登录
- **无自动刷新**: 简化流程,过期即重新登录

#### 认证流程

**1. 用户登录(account 站点)**

```typescript
// account 站点 - 登录成功后
import { useAuth } from '@cwj/auth'

const { setToken } = useAuth()

// 调用登录接口
const res = await loginApi({ username, password })

// 保存 token 到 Cookie
setToken(res.data.token)

// Cookie 自动设置:
// - domain: .xxx.com (支持所有子域名访问)
// - path: /
// - secure: true (HTTPS)
// - sameSite: Lax

// 跳转回原页面或首页
window.location.href = redirectUrl || '/'
```

**2. 主应用/子应用访问(URL 拦截)**

```typescript
// main.ts - 应用入口
import { setupUrlGuard } from '@cwj/auth'

// 初始化 URL 拦截器(页面加载时自动检测 Token)
setupUrlGuard({
  loginUrl: 'https://xx.xxx.com/account/',
  whitelist: ['/about', '/help'], // 白名单页面,不需要登录
})

// URL 拦截器会在页面加载时自动执行:
// 1. 检测 Cookie 中的 token
// 2. 如果没有 token,自动跳转到 account
// 3. 如果有 token,正常加载页面

// Cookie 同源策略:
// - 主应用(xx.xxx.com)和子应用(xx.xxx.com/designer)共享 Cookie
// - 所有应用自动获取 Token,无需手动传递
```

**3. Token 过期处理(XHR 拦截)**

```typescript
// XHR 拦截器自动处理业务状态码 10001
// 当接口返回 code: 10001 时,自动跳转到 account 重新登录

// 无需手动处理,@cwj/auth 自动完成
```

### Token 管理

#### 核心 API

```typescript
import { useAuth } from '@cwj/auth'

const {
  // 状态
  token, // access_token
  isAuthenticated, // 是否已认证
  userInfo, // 用户信息(可选,从 token 解析或接口获取)

  // 方法
  setToken, // 设置 token
  getToken, // 获取 token
  clearToken, // 清除 token
  logout, // 登出(清除 token 并跳转到 account)
  redirectToLogin, // 跳转到登录页
} = useAuth()
```

#### 使用示例

```typescript
// 获取 token(从 Cookie)
const { token, getToken } = useAuth()
console.log(token.value) // 响应式
console.log(getToken()) // 函数调用,从 Cookie 读取

// 设置 token(登录成功后,写入 Cookie)
const { setToken } = useAuth()
setToken('your-jwt-token')
// 自动设置 Cookie:
// document.cookie = 'access_token=xxx; domain=.xxx.com; path=/; secure; samesite=Lax'

// 清除 token(删除 Cookie)
const { clearToken } = useAuth()
clearToken()
// 自动删除 Cookie:
// document.cookie = 'access_token=; domain=.xxx.com; path=/; max-age=0'

// 登出
const { logout } = useAuth()
logout() // 清除 Cookie 并跳转到 account
```

#### Cookie 工具函数

```typescript
// @cwj/auth 内部实现
export function setCookie(name: string, value: string, options: CookieOptions) {
  const { domain, path = '/', secure = true, sameSite = 'Lax', maxAge } = options

  let cookie = `${name}=${encodeURIComponent(value)}`
  if (domain) cookie += `; domain=${domain}`
  if (path) cookie += `; path=${path}`
  if (secure) cookie += `; secure`
  if (sameSite) cookie += `; samesite=${sameSite}`
  if (maxAge) cookie += `; max-age=${maxAge}`

  document.cookie = cookie
}

export function getCookie(name: string): string | null {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return matches ? decodeURIComponent(matches[1]) : null
}

export function removeCookie(name: string, options: CookieOptions) {
  setCookie(name, '', { ...options, maxAge: 0 })
}
```

#### URL 拦截器(页面加载检测)

```typescript
// 在应用入口初始化 URL 拦截器
import { setupUrlGuard } from '@cwj/auth'

// 设置 URL 拦截(页面加载时检测 Token)
setupUrlGuard({
  loginUrl: 'https://xx.xxx.com/account/',
  whitelist: ['/about', '/help'], // 白名单页面
  onNoToken: () => {
    console.log('未登录,跳转到 account')
  },
})
```

#### URL 拦截器实现原理

```typescript
// @cwj/auth 内部实现示例
export function setupUrlGuard(options) {
  const { loginUrl, whitelist = [], onNoToken } = options

  // 检查当前路径是否在白名单中
  const currentPath = window.location.pathname
  const isWhitelisted = whitelist.some(path => currentPath.startsWith(path))

  if (isWhitelisted) {
    return // 白名单页面,不检测 Token
  }

  // 检测 Token
  const token = getToken()

  if (!token) {
    // 无 Token,跳转到 account 登录
    onNoToken?.()
    const redirectUrl = encodeURIComponent(window.location.href)
    window.location.href = `${loginUrl}?redirect=${redirectUrl}`
  }
}
```

#### XHR 拦截器(请求级检测)

```typescript
// 在应用入口初始化 XHR 拦截器
import { setupXhrInterceptor } from '@cwj/auth'

// 设置 XHR 顶层拦截
setupXhrInterceptor({
  loginUrl: 'https://xx.xxx.com/account/',
  tokenExpiredCode: 10001, // Token 过期的业务状态码
  onTokenExpired: () => {
    console.log('Token 已过期,跳转登录')
  },
})
```

#### XHR 拦截器实现原理(Cookie 版)

```typescript
// @cwj/auth 内部实现示例
// 拦截原生 XMLHttpRequest
const originalSend = XMLHttpRequest.prototype.send

XMLHttpRequest.prototype.send = function (body) {
  // Cookie 自动携带,无需手动添加 Token
  // 浏览器会自动在请求头中添加 Cookie
  // 同源请求: Cookie 自动发送
  // 跨域请求: 需要设置 withCredentials = true

  // 响应拦截 - 检测业务状态码
  this.addEventListener('load', function () {
    try {
      const response = JSON.parse(this.responseText)
      const { code } = response || {}

      // 检测业务状态码 10001 (Token 过期)
      if (code === 10001) {
        // 清除 Cookie
        removeCookie('access_token', {
          domain: '.xxx.com',
          path: '/',
        })
        // 跳转到 account 登录
        window.location.href = `${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`
      }
    } catch (error) {
      // 非 JSON 响应,忽略
    }
  })

  return originalSend.apply(this, [body])
}

// 同时拦截 Fetch API
const originalFetch = window.fetch
window.fetch = function (url, options = {}) {
  // Cookie 自动携带
  // 同源请求: 默认携带
  // 跨域请求: 需要设置 credentials: 'include'
  options.credentials = options.credentials || 'same-origin'

  return originalFetch(url, options).then(async response => {
    // 响应拦截 - 检测业务状态码
    const clonedResponse = response.clone()
    try {
      const data = await clonedResponse.json()
      if (data.code === 10001) {
        // 清除 Cookie
        removeCookie('access_token', {
          domain: '.xxx.com',
          path: '/',
        })
        window.location.href = `${loginUrl}?redirect=${encodeURIComponent(window.location.href)}`
      }
    } catch (error) {
      // 非 JSON 响应,忽略
    }
    return response
  })
}
```

#### Cookie 同源策略说明

```typescript
// 域名配置
domain: '.xxx.com'

// 支持的域名:
// ✅ xx.xxx.com (主应用)
// ✅ xx.xxx.com/designer (设计器)
// ✅ xx.xxx.com/renderer (渲染器)
// ✅ xx.xxx.com/admin (管理后台)
// ✅ xx.xxx.com/account (账号中心)

// Cookie 自动共享:
// - 所有子路径自动共享 Cookie
// - 浏览器自动在请求头中添加 Cookie
// - 无需手动传递 Token
// - 无需在请求拦截器中添加 Authorization header
```

#### 后端接口响应格式

```typescript
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": { ... }
}

// Token 过期(业务状态码 10001)
{
  "code": 10001,
  "message": "Token 已过期",
  "data": null
}
```

#### 使用示例

```typescript
// 业务代码中正常调用接口
try {
  const res = await axios.get('/api/user/info')
  console.log(res.data)
} catch (error) {
  // 如果是 10001,拦截器已自动跳转登录
  // 其他错误正常处理
  console.error(error)
}
```

### 权限控制

#### 1. 路由级权限

```typescript
// router/index.ts
import { createRouter } from 'vue-router'
import { authGuard, permissionGuard } from '@cwj/auth'

const router = createRouter({
  // ... routes
})

// 认证守卫 - 检查 token 是否存在
router.beforeEach(
  authGuard({
    loginUrl: 'https://xx.xxx.com/account/',
    // 白名单路由,不需要登录
    whitelist: ['/about', '/help'],
  })
)

// 权限守卫 - 检查路由权限
router.beforeEach(
  permissionGuard({
    // 从路由 meta 中获取所需权限
    getPermissions: route => route.meta.permissions,
    // 无权限时的处理
    onDenied: () => {
      router.push('/403')
    },
  })
)
```

```typescript
// 路由配置
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      permissions: ['admin.access'],
    },
  },
  {
    path: '/user/manage',
    component: UserManage,
    meta: {
      requiresAuth: true,
      permissions: ['user.manage', 'user.edit'],
    },
  },
]
```

#### 2. 按钮级权限

```typescript
// 使用 Composable
import { usePermission } from '@cwj/auth'

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

// 检查单个权限
const canEdit = hasPermission('user.edit')

// 检查任意权限
const canManage = hasAnyPermission(['user.edit', 'user.delete'])

// 检查所有权限
const canFullControl = hasAllPermissions(['user.read', 'user.edit', 'user.delete'])
```

```vue
<!-- 使用自定义指令 -->
<template>
  <!-- 有权限时显示 -->
  <button v-permission="'user.edit'">编辑</button>

  <!-- 有任意权限时显示 -->
  <button v-permission:any="['user.edit', 'user.delete']">操作</button>

  <!-- 有所有权限时显示 -->
  <button v-permission:all="['user.read', 'user.edit']">高级操作</button>
</template>
```

#### 3. 接口级权限

```typescript
// Axios 拦截器已自动处理
// 401 未授权 -> 自动刷新 token 或重新登录
// 403 无权限 -> 抛出错误,由业务层处理

// 业务代码
try {
  await axios.get('/api/admin/users')
} catch (error) {
  if (error.response?.status === 403) {
    ElMessage.error('无权限访问')
  }
}
```

### @cwj/auth 包结构(简化版)

```typescript
// @cwj/auth/src/index.ts
export { createAuth } from './plugin'
export { useAuth } from './composables/useAuth'
export { usePermission } from './composables/usePermission'
export { useAuthStore } from './store/auth'
export { setupUrlGuard } from './guards/url'
export { authGuard, permissionGuard } from './guards/router'
export { setupXhrInterceptor } from './interceptors/xhr'
export { vPermission } from './directives/permission'

// 类型定义
export type { AuthConfig, AuthState, UserInfo, Permission } from './types'
```

### 应用场景示例

#### 主应用集成

```typescript
// src/main.ts
import { createAuth, setupUrlGuard, setupXhrInterceptor } from '@cwj/auth'

const auth = createAuth({
  loginUrl: 'https://xx.xxx.com/account/',
  storage: 'cookie', // 使用 Cookie 存储
  tokenKey: 'access_token',
  cookieOptions: {
    domain: '.xxx.com', // 支持所有子域名
    path: '/',
    secure: true,
    sameSite: 'Lax',
  },
})

app.use(auth)

// 1. 初始化 URL 拦截器(页面加载时检测 Cookie 中的 Token)
setupUrlGuard({
  loginUrl: 'https://xx.xxx.com/account/',
  whitelist: ['/about', '/help'],
})

// 2. 初始化 XHR 拦截器(拦截所有 HTTP 请求)
setupXhrInterceptor({
  loginUrl: 'https://xx.xxx.com/account/',
  tokenExpiredCode: 10001,
  onTokenExpired: () => {
    console.log('Token 已过期,跳转登录')
  },
})

// Cookie 自动携带,无需手动配置请求头
```

#### 子应用(嵌入模式)

```typescript
// @cwj/designer/src/main.ts
import { createAuth, setupUrlGuard, setupXhrInterceptor } from '@cwj/auth'

const auth = createAuth({
  loginUrl: 'https://xx.xxx.com/account/',
  storage: 'cookie',
  tokenKey: 'access_token',
  cookieOptions: {
    domain: '.xxx.com',
    path: '/',
    secure: true,
    sameSite: 'Lax',
  },
})

app.use(auth)

// 初始化 URL 拦截器
setupUrlGuard({
  loginUrl: 'https://xx.xxx.com/account/',
})

// 初始化 XHR 拦截器
setupXhrInterceptor({
  loginUrl: 'https://xx.xxx.com/account/',
  tokenExpiredCode: 10001,
})

// 嵌入模式下:
// - Cookie 自动共享(domain: .xxx.com)
// - 主应用和子应用使用同一个 Cookie
// - 浏览器自动携带 Cookie,无需手动传递
```

#### 子应用(独立访问)

```typescript
// @cwj/designer/src/main.ts
import { createAuth, setupUrlGuard, setupXhrInterceptor } from '@cwj/auth'

const auth = createAuth({
  loginUrl: 'https://xx.xxx.com/account/',
  storage: 'cookie',
  tokenKey: 'access_token',
  cookieOptions: {
    domain: '.xxx.com',
    path: '/',
    secure: true,
    sameSite: 'Lax',
  },
})

app.use(auth)

// 初始化 URL 拦截器
setupUrlGuard({
  loginUrl: 'https://xx.xxx.com/account/',
})

// 初始化 XHR 拦截器
setupXhrInterceptor({
  loginUrl: 'https://xx.xxx.com/account/',
  tokenExpiredCode: 10001,
})

// 独立访问时:
// 1. URL 拦截器检测 Cookie 中的 token
// 2. 如果没有 token,自动跳转到 account 登录
// 3. 登录成功后,account 设置 Cookie 并跳转回来
// 4. Cookie 自动在所有子应用间共享
// 5. XHR 拦截器监控所有请求,code=10001 时自动跳转登录
```

## 📦 包管理和版本控制

### Monorepo 管理

```yaml
# pnpm-workspace.yaml
packages:
  - '@cwj/*'
```

### 版本发布策略

- **主应用和子应用**: 独立版本号,按需发布
- **公共包**: 语义化版本(Semver)
  - **@cwj/auth**: 认证包,所有应用强依赖,需谨慎升级
  - **@cwj/ui-pc / @cwj/ui-mobile**: UI 组件库
  - **@cwj/tools**: 工具函数库
  - 主版本号: 不兼容的 API 修改
  - 次版本号: 向下兼容的功能性新增
  - 修订号: 向下兼容的问题修正

### 依赖管理

```json
{
  "dependencies": {
    "vue": "^3.5.26",
    "vue-router": "^4.6.4",
    "pinia": "^2.x",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@cwj/auth": "workspace:*", // 认证包(开发时使用本地)
    "@cwj/ui-pc": "workspace:*",
    "@cwj/ui-mobile": "workspace:*",
    "@cwj/tools": "workspace:*"
  }
}
```

### 公共包配置

所有 npm 包必须输出 TypeScript 类型定义,确保类型安全。

#### package.json 配置示例

```json
{
  "name": "@cwj/auth",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0"
  }
}
```

#### tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 公共包发布

```bash
# 构建包(生成类型定义)
pnpm run build

# 发布认证包
cd @cwj/auth
pnpm version patch  # 或 minor / major
pnpm publish --access restricted  # 发布到私有仓库

# 其他应用更新依赖
pnpm update @cwj/auth
```

## 🎯 开发规范

### 代码规范

- **ESLint**: 基于 @typescript-eslint 和 eslint-plugin-vue
- **Prettier**: 统一代码格式
- **提交前检查**:
  ```bash
  pnpm run check  # 类型检查 + ESLint + Prettier
  ```

### Git 提交规范

遵循 Conventional Commits 规范:

```bash
feat: 添加用户管理模块
fix: 修复登录页面样式问题
docs: 更新 README 文档
style: 格式化代码
refactor: 重构权限判断逻辑
test: 添加单元测试
chore: 更新依赖版本
```

### 分支管理

- **main**: 生产环境分支
- **develop**: 开发环境分支
- **feature/xxx**: 功能开发分支
- **hotfix/xxx**: 紧急修复分支

### 目录规范

```
@cwj/xxx/
├── src/
│   ├── components/     # 组件
│   ├── views/          # 页面
│   ├── router/         # 路由
│   ├── store/          # 状态管理
│   ├── api/            # 接口
│   ├── utils/          # 工具函数
│   ├── types/          # 类型定义
│   ├── assets/         # 静态资源
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── public/             # 公共资源
├── webpack.config.ts   # Webpack 配置
├── tsconfig.json       # TS 配置
└── package.json        # 包信息
```

## 🔄 应用通信

### 主应用加载子应用

```typescript
// 主应用 - 动态加载子应用组件
import { defineAsyncComponent } from 'vue'

const DesignerApp = defineAsyncComponent(() => import('designer/App'))

const RendererApp = defineAsyncComponent(() => import('renderer/App'))

const AdminApp = defineAsyncComponent(() => import('admin/App'))
```

### 跨应用通信

```typescript
// 全局事件总线
import mitt from 'mitt'

export const eventBus = mitt()

// 主应用 - 发送事件
eventBus.emit('user:login', { userId: 123 })

// 子应用 - 监听事件
eventBus.on('user:login', data => {
  console.log('用户登录:', data)
})
```

### 共享状态

```typescript
// 主应用 - 创建共享 Store
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    userInfo: null,
    token: '',
  }),
})

// 子应用 - 使用共享 Store
import { useGlobalStore } from '@/store/global'

const globalStore = useGlobalStore()
console.log(globalStore.userInfo)
```

## 📝 待办事项

### 核心功能

- [ ] **开发 @cwj/auth 认证包(简化版)**
  - [ ] Token 存储管理(Cookie,利用同源策略)
    - [ ] Cookie 读写工具函数
    - [ ] 支持域名配置(domain: .xxx.com)
    - [ ] 支持安全选项(secure, sameSite)
  - [ ] URL 拦截器(页面加载时检测 Token,不依赖框架)
    - [ ] 检测 Cookie 中的 Token
    - [ ] 白名单页面配置
    - [ ] 无 Token 跳转 account
  - [ ] Vue Router 守卫(可选,路由级权限控制)
  - [ ] 权限判断函数和指令
  - [ ] XHR 顶层拦截器(拦截所有 HTTP 请求)
    - [ ] 拦截 XMLHttpRequest(Cookie 自动携带)
    - [ ] 拦截 Fetch API(Cookie 自动携带)
    - [ ] 检测业务状态码 10001
    - [ ] 清除 Cookie 并跳转 account
  - [ ] 发布到私有 npm 仓库
- [ ] 实现全局事件总线
- [ ] 完善主应用路由和状态管理

### 子应用开发

- [ ] **开发 Account 账号中心**
  - [ ] 登录页面(账号密码/验证码/扫码)
  - [ ] 注册页面
  - [ ] 找回密码页面
  - [ ] 第三方登录集成
  - [ ] OAuth 授权页面
  - [ ] 集成 @cwj/auth 包
- [ ] **实现设计器核心功能**
  - [ ] 拖拽编排引擎
  - [ ] 组件库集成
  - [ ] 属性配置面板
  - [ ] 实时预览
  - [ ] AST 生成器(输出 AST 格式数据)
  - [ ] 页面数据持久化
- [ ] **实现渲染器核心功能**
  - [ ] AST 解析引擎
  - [ ] 动态组件渲染
  - [ ] 指令系统(v-if/v-for/v-show/v-model)
  - [ ] 事件系统
  - [ ] 数据绑定和响应式
  - [ ] 运行时沙箱环境
- [ ] 开发管理后台
  - [ ] 应用管理
  - [ ] 用户权限管理

### 公共包开发

- [ ] 开发 @cwj/auth 认证包文档站点
  - [ ] API 文档
  - [ ] 使用指南
  - [ ] 最佳实践
  - [ ] 示例代码
- [ ] 开发 @cwj/ui-pc 组件库
  - [ ] 基础组件
  - [ ] 业务组件
- [ ] 开发 @cwj/ui-mobile 组件库
- [ ] 开发 @cwj/tools 工具库
- [ ] 搭建组件文档站点(VitePress)

### 测试和优化

- [ ] 编写单元测试
- [ ] 编写 E2E 测试
- [ ] 性能优化和监控
- [ ] 错误监控和日志收集

### 部署和运维

- [ ] CI/CD 流程搭建
- [ ] Nginx 配置优化
- [ ] Docker 容器化
- [ ] 监控告警系统
