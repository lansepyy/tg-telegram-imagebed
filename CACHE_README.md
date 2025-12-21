# 本地缓存功能说明

## 概述

本地缓存功能通过将 Telegram 图片缓存到本地磁盘，大幅减少对 Telegram API 的频繁请求，提升图片访问速度和系统稳定性。

## 工作原理

### 缓存写入时机

1. **图片上传时**：通过 Web 上传的图片会自动缓存
2. **Bot 接收时**：TG Bot 接收到的群组/频道图片会自动缓存
3. **首次访问时**：第一次访问图片时，从 TG 获取后自动缓存

### 缓存读取流程

```
用户请求图片
    ↓
检查本地缓存
    ↓
缓存命中 → 直接返回 (快速)
    ↓
缓存未命中 → 从 TG 获取 → 写入缓存 → 返回
```

### 目录结构

缓存采用两级目录结构，避免单目录文件过多：

```
/app/image/
├── ab/
│   ├── cd/
│   │   ├── abcd1234efgh5678.jpg
│   │   └── abcd9876wxyz4321.png
│   └── ef/
│       └── abef5678ijkl9012.webp
└── gh/
    └── ij/
        └── ghij3456mnop7890.gif
```

## Docker 部署配置

### docker-compose.yml 配置

```yaml
services:
  telegram-imagebed:
    # ... 其他配置 ...
    environment:
      - IMAGE_CACHE_DIR=/app/image
      - IMAGE_CACHE_ENABLED=true
    volumes:
      - ./data:/app/data
      - ./image:/app/image  # 缓存目录挂载
```

### 本地目录映射

- 容器内：`/app/image`
- 宿主机：`./image` (与 docker-compose.yml 同级)

## 环境变量

### IMAGE_CACHE_DIR
- 默认值：`/app/image`
- 说明：缓存目录路径

### IMAGE_CACHE_ENABLED
- 默认值：`true`
- 说明：是否启用本地缓存

## 管理 API

### 获取缓存统计

**接口**：`GET /api/admin/cdn/stats`

**响应示例**：
```json
{
  "success": true,
  "data": {
    "local_cache": {
      "file_count": 1234,
      "total_size": 524288000,
      "total_size_formatted": "500.00 MB"
    }
  }
}
```

### 清空缓存

**接口**：`POST /api/admin/clear-cache`

**请求体**：
```json
{
  "type": "local"  // all: 全部, cdn: 仅CDN, local: 仅本地
}
```

**响应示例**：
```json
{
  "success": true,
  "message": "本地缓存已清理 (1234 文件)",
  "details": {
    "local_cache": {
      "success": true,
      "deleted_files": 1234,
      "freed_bytes": 524288000,
      "freed_size": "500.00 MB"
    }
  }
}
```

## 响应头标识

缓存命中时，HTTP 响应头会包含以下信息：

- `X-Storage-Backend: local-cache` - 标识从本地缓存返回
- `X-Cache-Hit: true` - 缓存命中标识

缓存未命中时：

- `X-Storage-Backend: telegram` - 标识从 TG 获取
- `X-Cache-Hit: false` - 缓存未命中

## 性能优势

### 速度提升

- **缓存命中**：< 10ms (本地磁盘读取)
- **缓存未命中**：100-500ms (TG API 请求)

### 稳定性提升

- 减少对 TG API 的依赖
- 避免 TG API 限流问题
- 降低网络故障影响

## 注意事项

### 磁盘空间

- 每张图片完整缓存到本地
- 需确保足够的磁盘空间
- 建议定期监控磁盘使用情况

### 数据一致性

- 删除图片时不会自动删除缓存
- 需手动清理或等待下次访问时自动更新
- 可通过管理 API 批量清理

### 备份策略

- 缓存数据为临时数据，可随时重建
- 备份时只需备份 `/app/data` 目录
- `/app/image` 目录不需要备份

## 故障排查

### 缓存未生效

1. 检查环境变量 `IMAGE_CACHE_ENABLED=true`
2. 检查目录权限：`chmod 755 ./image`
3. 查看日志：`docker logs telegram-imagebed | grep cache`

### 磁盘空间不足

1. 清空缓存：通过管理 API 调用
2. 调整 Docker 磁盘配额
3. 定期清理旧缓存

### 缓存目录不存在

容器会自动创建目录，如果失败：

```bash
mkdir -p ./image
chmod 755 ./image
docker-compose restart
```

## 维护建议

### 定期清理

建议每月清理一次缓存，释放磁盘空间：

```bash
curl -X POST http://localhost:18793/api/admin/clear-cache \
  -H "Content-Type: application/json" \
  -d '{"type": "local"}'
```

### 监控磁盘

使用 `df -h` 监控磁盘使用：

```bash
df -h | grep "image"
```

### 日志检查

查看缓存相关日志：

```bash
docker logs telegram-imagebed 2>&1 | grep -i cache
```

## 版本历史

- **v2.0.4** (2025-12-21): 初始实现本地缓存功能
