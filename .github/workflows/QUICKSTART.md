# 🚀 Docker Hub 自动发布快速设置

## ⚡ 3分钟完成设置

### 步骤1️⃣: 获取Docker Hub访问令牌

1. 访问 https://hub.docker.com/settings/security
2. 点击 **New Access Token**
3. 描述填写：`GitHub Actions`
4. 权限选择：**Read, Write, Delete**
5. 复制生成的令牌（⚠️ 只显示一次）

### 步骤2️⃣: 配置GitHub Secrets

1. 访问 https://github.com/lansepyy/tg-telegram-imagebed/settings/secrets/actions
2. 点击 **New repository secret**，添加：
   - Name: `DOCKERHUB_USERNAME` → Value: `lansepyy`
   - Name: `DOCKERHUB_TOKEN` → Value: `刚才复制的令牌`

### 步骤3️⃣: 推送代码触发构建

```bash
cd "e:\github测试\git\图床项目\tg-telegram-imagebed-main"

# 添加文件
git add .

# 提交变更
git commit -m "feat: 添加GitHub Actions自动构建Docker镜像"

# 推送到GitHub
git push origin main
```

### 步骤4️⃣: 查看构建进度

访问: https://github.com/lansepyy/tg-telegram-imagebed/actions

等待构建完成（约10-20分钟）

## 📦 发布Beta版本

1. 访问 https://github.com/lansepyy/tg-telegram-imagebed/actions
2. 选择左侧 **Docker Build and Push**
3. 点击 **Run workflow**
4. 选择 `beta` 发布类型
5. 点击 **Run workflow** 按钮

Beta版本会自动递增：beta-1 → beta-2 → beta-3...

## 🎯 使用发布的镜像

### Latest版本（稳定）
```bash
docker pull lansepyy/tg-telegram-imagebed:latest
docker-compose -f docker-compose.dockerhub.yml up -d
```

### Beta版本（测试）
```bash
docker pull lansepyy/tg-telegram-imagebed:beta
docker-compose -f docker-compose.beta.yml up -d
```

## ✅ 验证

查看Docker Hub: https://hub.docker.com/r/lansepyy/tg-telegram-imagebed/tags

应该能看到：
- ✅ `latest` 标签
- ✅ `20251218-xxxxx` 日期标签
- ✅ `beta` 标签（手动触发后）
- ✅ `beta-1`, `beta-2`... 递增标签

## 📖 详细文档

- [工作流说明](README.md) - 完整的工作流文档
- [Secrets配置](SECRETS-SETUP.md) - 详细的配置指南

## 🎉 完成！

现在每次推送到main分支，都会自动构建并推送Docker镜像到Docker Hub！
