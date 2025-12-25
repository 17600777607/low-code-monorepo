# 前端低代码平台

> 基于 Vue3 + TypeScript + Webpack5 Module Federation 的微前端低代码平台

## 📖 项目概述

支持可视化设计、多端渲染和统一管理的企业级低代码平台。

### 核心特性

- 🎨 **可视化设计器** - 拖拽式组件编排,实时预览
- 🚀 **多端渲染器** - 基于 AST 的动态渲染引擎
- 🏗️ **微前端架构** - Webpack5 Module Federation
- 🔐 **统一认证** - Cookie + XHR 拦截,自动跳转
- 📦 **Monorepo 管理** - pnpm Workspace
- 💎 **TypeScript** - 完整的类型支持

## 🛠️ 技术栈

| 类别     | 技术                               |
| -------- | ---------------------------------- |
| 前端框架 | Vue 3.5+ + TypeScript 5.3+         |
| 构建工具 | Webpack 5 + Module Federation      |
| 包管理   | pnpm Workspace (Monorepo)          |
| 路由     | Vue Router 4 (History 模式)        |
| 状态管理 | Pinia 2.x                          |
| 认证授权 | 自研 @cwj/auth (Cookie + XHR 拦截) |
| UI 组件  | 自研 @cwj/ui-pc、@cwj/ui-mobile    |
| 工具函数 | 自研 @cwj/tools                    |
| 代码规范 | ESLint + Prettier                  |

## 📁 项目结构

```
low-code-monorepo/
├── src/                      # 主应用(宿主)
├── @cwj/                     # 子应用和公共包
│   ├── account/             # 账号中心(登录站点)
│   ├── designer/            # 可视化设计器
│   ├── renderer/            # 多端渲染器
│   ├── admin/               # 管理后台
│   ├── auth/                # 认证授权包(npm)
│   ├── ui/                  # UI 组件库(npm)
│   └── tools/               # 工具函数库(npm)
├── docs/                    # 文档目录
├── public/                  # 静态资源
├── webpack.config.ts        # Webpack 配置
├── tsconfig.json            # TypeScript 配置
└── pnpm-workspace.yaml      # workspace 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
# 启动主应用
pnpm run dev

# 启动子应用
pnpm --filter account dev
pnpm --filter designer dev
pnpm --filter renderer dev
pnpm --filter admin dev
```

### 构建生产

```bash
# 构建所有应用
pnpm run build:all

# 构建指定应用
pnpm run build                # 主应用
pnpm --filter designer build  # 设计器
```

## 📚 文档导航

### 核心文档

- [架构设计](./docs/架构设计.md) - 微前端架构、应用通信、技术选型
- [开发指南](./docs/开发指南.md) - 开发流程、调试方法、常见问题
- [部署文档](./docs/部署文档.md) - 构建流程、Nginx 配置、CI/CD
- [开发规范](./docs/开发规范.md) - 代码规范、Git 规范、目录规范
- [待办事项](./docs/待办事项.md) - 任务清单和开发计划

### 包文档

- [@cwj/auth 认证包](./docs/packages/认证包文档.md) - 统一认证授权解决方案
- [@cwj/ui-pc 组件库](./docs/packages/ui-pc.md) - PC 端组件库
- [@cwj/ui-mobile 组件库](./docs/packages/ui-mobile.md) - Mobile 端组件库
- [@cwj/tools 工具库](./docs/packages/tools.md) - 通用工具函数

### 应用文档

- [Account 账号中心](./docs/packages/account.md) - 统一登录站点
- [Designer 设计器](./docs/packages/designer.md) - 可视化设计器
- [Renderer 渲染器](./docs/packages/renderer.md) - 多端渲染引擎
- [Admin 管理后台](./docs/packages/admin.md) - 系统管理后台

## 🌐 应用访问

| 应用     | 本地开发              | 生产环境                     |
| -------- | --------------------- | ---------------------------- |
| 主应用   | http://localhost:3000 | https://xx.xxx.com           |
| 账号中心 | http://localhost:3001 | https://xx.xxx.com/account/  |
| 设计器   | http://localhost:3002 | https://xx.xxx.com/designer/ |
| 渲染器   | http://localhost:3003 | https://xx.xxx.com/renderer/ |
| 管理后台 | http://localhost:3004 | https://xx.xxx.com/admin/    |

## 🔧 可用脚本

```bash
# 开发
pnpm run dev              # 启动主应用
pnpm run dev:micro        # 启动微应用

# 构建
pnpm run build            # 构建主应用
pnpm run build:all        # 构建所有应用

# 代码质量
pnpm run type-check       # TypeScript 类型检查
pnpm run lint             # ESLint 代码检查
pnpm run lint:fix         # 自动修复 ESLint 问题
pnpm run format           # Prettier 格式化代码
pnpm run check            # 完整检查(类型+lint+格式)
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

请遵循 [开发规范](./docs/开发规范.md) 中的代码规范和提交规范。

## 📄 License

MIT

## 👥 维护者

- [@cwj](https://github.com/cwj)

## 📮 联系方式

如有问题或建议,请提交 [Issue](https://github.com/your-repo/issues)
