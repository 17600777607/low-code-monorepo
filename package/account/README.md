# @cwj/account - 账号中心

统一的账号管理中心,提供登录、注册、找回密码等功能。

## 📦 功能特性

- 🔐 **登录功能**: 账号密码登录、手机验证码登录、扫码登录
- 📝 **注册功能**: 用户注册、验证码验证
- 🔑 **找回密码**: 密码重置功能
- 🎨 **现代化 UI**: 美观的用户界面设计
- 🌐 **多环境支持**: 开发、测试、生产环境配置

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 开发环境
pnpm dev

# 测试环境
pnpm dev:test

# 生产环境
pnpm dev:production
```

### 构建

```bash
# 开发环境构建
pnpm build:development

# 测试环境构建
pnpm build:test

# 生产环境构建
pnpm build:production
```

### 预览

```bash
# 预览开发环境构建
pnpm preview:development

# 预览测试环境构建
pnpm preview:test

# 预览生产环境构建
pnpm preview:production
```

## 📁 目录结构

```
@cwj/account/
├── src/
│   ├── views/          # 页面组件
│   │   ├── Login.vue         # 登录页
│   │   ├── Register.vue      # 注册页
│   │   └── ForgotPassword.vue # 找回密码页
│   ├── components/     # 公共组件
│   ├── api/           # API 接口
│   ├── router/        # 路由配置
│   ├── assets/        # 静态资源
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── public/            # 公共资源
├── .env.development   # 开发环境配置
├── .env.test         # 测试环境配置
├── .env.production   # 生产环境配置
├── vite.config.ts    # Vite 配置
├── tsconfig.json     # TypeScript 配置
└── package.json      # 包配置
```

## 🔧 环境变量

### 开发环境 (.env.development)

- `VITE_APP_TITLE`: 应用标题
- `VITE_APP_BASE_API`: API 基础地址
- `VITE_APP_PORT`: 开发服务器端口
- `VITE_APP_COOKIE_DOMAIN`: Cookie 域名

### 测试环境 (.env.test)

同上,但使用测试环境的配置值

### 生产环境 (.env.production)

同上,但使用生产环境的配置值

## 📝 待办事项

- [ ] 实现登录表单和逻辑
- [ ] 实现注册表单和逻辑
- [ ] 实现找回密码表单和逻辑
- [ ] 集成 @cwj/auth 认证包
- [ ] 添加表单验证
- [ ] 添加第三方登录支持
- [ ] 添加单元测试

## 📄 许可证

MIT
