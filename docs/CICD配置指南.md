# GitHub Actions CI/CD 配置指南

## 📋 概述

本项目使用 GitHub Actions 实现自动化的 CI/CD 流程,包括代码检查、构建测试和自动部署。

## 🔄 工作流程

### 1. CI 流程 (ci.yml)

**触发条件:**

- 推送到 `main`、`develop` 或 `feature/**` 分支
- 创建 Pull Request 到 `main` 或 `develop` 分支

**执行步骤:**

1. **代码质量检查** - ESLint + Prettier
2. **TypeScript 类型检查** - vue-tsc
3. **构建测试** - 构建所有环境(development, test, production)

### 2. 部署流程 (deploy.yml)

**触发条件:**

- 推送到 `main` 分支 → 部署到生产环境
- 推送到 `develop` 分支 → 部署到测试环境
- 推送 `v*` 标签 → 部署到生产环境并创建 Release

**部署步骤:**

1. 检出代码
2. 安装依赖
3. 构建对应环境
4. SSH 部署到服务器
5. 发送通知

### 3. 发布流程 (release.yml)

**触发条件:**

- 推送 `v*.*.*` 格式的标签(如 `v1.0.0`)

**发布步骤:**

1. 构建所有环境
2. 压缩构建产物
3. 生成变更日志
4. 创建 GitHub Release
5. 上传构建产物
6. 发送通知

## 🔐 配置 Secrets

在 GitHub 仓库设置中添加以下 Secrets:

### 测试环境 Secrets

```
TEST_SSH_PRIVATE_KEY    # 测试服务器 SSH 私钥
TEST_REMOTE_HOST        # 测试服务器地址
TEST_REMOTE_USER        # 测试服务器用户名
TEST_REMOTE_TARGET      # 测试服务器部署目录
```

### 生产环境 Secrets

```
PROD_SSH_PRIVATE_KEY    # 生产服务器 SSH 私钥
PROD_REMOTE_HOST        # 生产服务器地址
PROD_REMOTE_USER        # 生产服务器用户名
PROD_REMOTE_TARGET      # 生产服务器部署目录
```

### 通知 Secrets (可选)

```
SLACK_WEBHOOK           # Slack Webhook URL(用于部署通知)
```

## 📝 配置步骤

### 1. 生成 SSH 密钥

```bash
# 生成 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/deploy_key

# 查看私钥(添加到 GitHub Secrets)
cat ~/.ssh/deploy_key

# 查看公钥(添加到服务器 authorized_keys)
cat ~/.ssh/deploy_key.pub
```

### 2. 配置服务器

```bash
# 在服务器上添加公钥
echo "公钥内容" >> ~/.ssh/authorized_keys

# 设置权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. 添加 GitHub Secrets

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加上述所有必需的 Secrets

### 4. 配置环境变量(可选)

如果需要在构建时注入环境变量,可以创建 `.env.development`、`.env.test`、`.env.production` 文件:

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=生产环境
```

## 🚀 使用方法

### 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交代码
git add .
git commit -m "feat: 添加新功能"

# 3. 推送到远程(触发 CI 检查)
git push origin feature/new-feature

# 4. 创建 Pull Request
# CI 会自动运行代码检查和构建测试
```

### 部署到测试环境

```bash
# 合并到 develop 分支
git checkout develop
git merge feature/new-feature
git push origin develop

# 自动触发部署到测试环境
```

### 部署到生产环境

```bash
# 方式 1: 合并到 main 分支
git checkout main
git merge develop
git push origin main

# 方式 2: 创建版本标签
git tag v1.0.0
git push origin v1.0.0

# 自动触发部署到生产环境并创建 Release
```

## 📊 查看执行结果

1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看工作流执行状态和日志

## 🔧 自定义配置

### 修改触发条件

编辑 `.github/workflows/*.yml` 文件中的 `on` 部分:

```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
```

### 添加测试步骤

在 `ci.yml` 中添加测试任务:

```yaml
test:
  name: 单元测试
  runs-on: ubuntu-latest
  steps:
    - name: 运行测试
      run: pnpm test
```

### 修改部署方式

如果使用其他部署方式(如 Docker、云服务),可以替换部署步骤:

```yaml
# 使用 Docker
- name: 构建 Docker 镜像
  run: docker build -t myapp:latest .

- name: 推送到 Docker Hub
  run: docker push myapp:latest
```

## ⚠️ 注意事项

1. **私钥安全**: 永远不要将 SSH 私钥提交到代码仓库
2. **权限控制**: 为部署用户设置最小必要权限
3. **备份策略**: 部署前建议备份服务器上的旧版本
4. **回滚方案**: 准备快速回滚机制
5. **监控告警**: 配置部署后的健康检查和告警

## 🐛 常见问题

### 1. SSH 连接失败

**原因**: SSH 密钥配置错误或服务器防火墙限制

**解决方案**:

```bash
# 测试 SSH 连接
ssh -i ~/.ssh/deploy_key user@host

# 检查服务器日志
tail -f /var/log/auth.log
```

### 2. 构建失败

**原因**: 依赖安装失败或构建脚本错误

**解决方案**:

- 检查 `pnpm-lock.yaml` 是否提交
- 本地运行 `pnpm run build:production` 测试
- 查看 Actions 日志定位具体错误

### 3. 部署后访问 404

**原因**: 部署路径不正确或 Nginx 配置问题

**解决方案**:

```bash
# 检查部署目录
ls -la /path/to/deploy

# 检查 Nginx 配置
nginx -t
```

## 📚 相关文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [部署文档](./部署文档.md)
- [开发指南](./开发指南.md)

## 🔄 工作流状态徽章

在 README.md 中添加状态徽章:

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![Deploy](https://github.com/username/repo/workflows/Deploy/badge.svg)
```

## 📞 联系方式

如有问题,请提交 [Issue](https://github.com/your-repo/issues) 或联系维护者。
