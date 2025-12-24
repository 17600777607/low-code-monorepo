# Vue3 + Webpack5 微前端项目

> 基于 Webpack5 Module Federation 的 Vue3 TypeScript 微前端架构

## ✨ 特性

- 🚀 **Webpack 5 + Module Federation** - 微前端架构支持
- 💎 **TypeScript** - 完整的类型支持
- 📦 **pnpm Workspace** - Monorepo 管理
- 🎨 **Prettier + ESLint** - 代码质量保证
- ⚙️ **配置文件 TS 化** - 所有配置使用 TypeScript
- 🔥 **HMR** - 热模块替换,开发体验极佳

## 📁 项目结构

```
vue3-webpack/
├── src/                    # 主应用(宿主)
│   ├── main.ts            # 异步入口
│   ├── bootstrap.ts       # 实际启动文件
│   ├── App.vue            # 根组件
│   └── components/        # 组件目录
├── packages/              # 微应用集合
│   └── micro-example/    # 示例微应用
├── webpack.config.ts      # Webpack 配置
├── tsconfig.json          # TypeScript 配置
├── babel.config.ts        # Babel 配置
├── prettier.config.ts     # Prettier 配置
└── pnpm-workspace.yaml    # workspace 配置
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

启动主应用:

```bash
pnpm run dev
```

启动微应用:

```bash
pnpm run dev:micro
```

### 生产构建

构建所有应用:

```bash
pnpm run build:all
```

## 📝 可用脚本

| 命令                    | 说明                             |
| ----------------------- | -------------------------------- |
| `pnpm run dev`          | 启动主应用开发服务器 (端口 3000) |
| `pnpm run dev:micro`    | 启动微应用开发服务器 (端口 3001) |
| `pnpm run build`        | 构建主应用                       |
| `pnpm run build:all`    | 构建所有应用                     |
| `pnpm run type-check`   | TypeScript 类型检查              |
| `pnpm run lint`         | ESLint 代码检查                  |
| `pnpm run format`       | Prettier 格式化代码              |
| `pnpm run format:check` | 检查代码格式                     |

## 🔧 技术栈

- **前端框架**: Vue 3.2.13
- **构建工具**: Webpack 5.104.1
- **语言**: TypeScript 5.9.3
- **编译器**: Babel 7.28.5
- **包管理**: pnpm 10.25.0
- **代码规范**: ESLint 8.57.1 + Prettier 3.7.4

## 🏗️ 微前端架构

### Module Federation 配置

**主应用 (宿主)**:

```typescript
{
  name: 'main_app',
  remotes: {
    microExample: 'micro_example@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    vue: { singleton: true, requiredVersion: '^3.2.13' },
  },
}
```

**微应用 (远程)**:

```typescript
{
  name: 'micro_example',
  filename: 'remoteEntry.js',
  exposes: {
    './MicroApp': './src/App.vue',
    './HelloWorld': './src/components/HelloWorld.vue',
  },
  shared: {
    vue: { singleton: true },
  },
}
```

### 动态加载微应用

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const MicroAppComponent = defineAsyncComponent(() => {
  return import('microExample/HelloWorld')
})
</script>

<template>
  <Suspense>
    <MicroAppComponent />
  </Suspense>
</template>
```

## 📦 添加新的微应用

1. 在 `packages/` 下创建新目录
2. 添加 `package.json` 和 `webpack.config.ts`
3. 配置 Module Federation
4. 在主应用中注册远程模块

## 🎯 开发建议

### TypeScript

- 尽量为 Vue 组件添加类型定义
- 使用 `<script setup lang="ts">` 语法
- 利用 VSCode 的类型提示

### 代码规范

- 提交前运行 `pnpm run format`
- 使用 `pnpm run lint` 检查代码
- 遵循 ESLint 规则

### 性能优化

- 合理使用代码分割
- 按需加载微应用
- 利用 Webpack 缓存

## 📄 License

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request!
