# GitHub Secrets 配置指南

为了启用自动构建和推送Docker镜像到Docker Hub，需要在GitHub仓库中配置以下Secrets。

## 📋 配置步骤

### 1️⃣ 生成Docker Hub访问令牌

1. 登录 [Docker Hub](https://hub.docker.com/)
2. 点击右上角头像 → **Account Settings**
3. 左侧菜单选择 **Security**
4. 点击 **New Access Token**
5. 填写令牌信息：
   - **Access Token Description**: `GitHub Actions` 或任意描述
   - **Access permissions**: 选择 **Read, Write, Delete**
6. 点击 **Generate**
7. ⚠️ **立即复制令牌**（只显示一次，无法再次查看）

![Docker Hub Token](https://docs.docker.com/docker-hub/access-tokens/)

### 2️⃣ 在GitHub仓库添加Secrets

1. 打开你的GitHub仓库: `https://github.com/lansepyy/tg-telegram-imagebed`
2. 点击 **Settings**（设置）
3. 左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**

添加以下两个Secrets：

#### Secret 1: DOCKERHUB_USERNAME

- **Name**: `DOCKERHUB_USERNAME`
- **Secret**: `lansepyy`（你的Docker Hub用户名）
- 点击 **Add secret**

#### Secret 2: DOCKERHUB_TOKEN

- **Name**: `DOCKERHUB_TOKEN`
- **Secret**: 粘贴刚才复制的Docker Hub访问令牌
- 点击 **Add secret**

### 3️⃣ 验证配置

配置完成后，你应该能看到两个Secrets：

```
✅ DOCKERHUB_USERNAME
✅ DOCKERHUB_TOKEN
```

## 🚀 触发构建

### 自动触发（推送main分支）

```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

这将自动触发构建并推送 `latest` 和 `YYYYMMDD-hash` 标签。

### 手动触发Beta版本

1. 进入仓库的 **Actions** 标签页
2. 左侧选择 **Docker Build and Push**
3. 点击右侧 **Run workflow** 按钮
4. 选择 **beta** 作为发布类型
5. 点击 **Run workflow**

这将：
- 自动检测最新的Beta版本号
- 递增版本号（beta-1 → beta-2 → beta-3...）
- 同时推送 `beta-N` 和 `beta` 标签
- 创建对应的Git标签

### 手动触发Latest版本

1. 进入仓库的 **Actions** 标签页
2. 左侧选择 **Docker Build and Push**
3. 点击右侧 **Run workflow** 按钮
4. 选择 **latest** 作为发布类型
5. 点击 **Run workflow**

## 📊 查看构建状态

访问: `https://github.com/lansepyy/tg-telegram-imagebed/actions`

可以看到：
- 🟢 成功的构建
- 🔴 失败的构建
- 🟡 进行中的构建
- 📝 详细的构建日志

## 🔍 验证Docker镜像

构建成功后，可以在Docker Hub查看：
`https://hub.docker.com/r/lansepyy/tg-telegram-imagebed/tags`

或使用命令验证：

```bash
# 查看latest版本
docker pull lansepyy/tg-telegram-imagebed:latest
docker images | grep tg-telegram-imagebed

# 查看beta版本
docker pull lansepyy/tg-telegram-imagebed:beta
docker images | grep tg-telegram-imagebed
```

## ⚠️ 常见问题

### ❌ 构建失败：Unauthorized

**原因**: Docker Hub访问令牌无效或过期

**解决**:
1. 重新生成Docker Hub访问令牌
2. 更新GitHub Secrets中的 `DOCKERHUB_TOKEN`

### ❌ 构建失败：Permission denied

**原因**: 访问令牌权限不足

**解决**:
1. 确保访问令牌有 **Read, Write, Delete** 权限
2. 重新生成并更新令牌

### ❌ Beta版本号未递增

**原因**: Git标签未正确推送或读取

**解决**:
```bash
# 查看现有Beta标签
git fetch --tags
git tag -l "beta-*"

# 如有错误标签，删除后重试
git tag -d beta-X
git push origin :refs/tags/beta-X
```

### ⚙️ 修改Docker Hub用户名

如果需要使用不同的Docker Hub账号，更新以下位置：

1. GitHub Secrets中的 `DOCKERHUB_USERNAME`
2. [docker-compose.dockerhub.yml](../docker-compose.dockerhub.yml) 中的镜像名
3. [docker-compose.beta.yml](../docker-compose.beta.yml) 中的镜像名
4. [README.md](../README.md) 中的使用示例

## 📚 更多资源

- [GitHub Actions 文档](https://docs.github.com/actions)
- [Docker Hub 访问令牌](https://docs.docker.com/docker-hub/access-tokens/)
- [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [Docker 多平台构建](https://docs.docker.com/build/building/multi-platform/)

## 🆘 获取帮助

如遇到问题，可以：
1. 查看 [GitHub Actions 日志](https://github.com/lansepyy/tg-telegram-imagebed/actions)
2. 提交 [Issue](https://github.com/lansepyy/tg-telegram-imagebed/issues)
3. 参考 [工作流说明文档](README.md)
