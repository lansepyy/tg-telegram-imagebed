# 📋 Telegram 图床项目 - 网页端配置说明

## 🎯 配置概览

本项目支持通过**环境变量**和**网页管理后台**两种方式配置Telegram相关设置。

---

## 一、Telegram Bot 配置

### 1.1 Bot Token 配置

**配置方式：**

#### ✅ 方式一：环境变量（推荐用于生产环境）
```env
# .env 文件
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
```

**特点：**
- 优先级最高
- 设置后无法通过网页修改
- 适合生产环境（安全性高）

#### ✅ 方式二：网页管理后台
- 访问：`/admin/storage`
- 位置：存储设置 → Telegram 配置 → Bot Token
- 适合测试环境或动态调整

**注意：**
- 环境变量优先级 > 数据库配置
- 如果通过环境变量设置，网页界面会提示"已通过环境变量设置，无法修改"

---

### 1.2 Storage Chat ID 配置

用于指定图片上传到哪个Telegram频道/群组。

#### ✅ 方式一：环境变量
```env
# .env 文件
STORAGE_CHAT_ID=-1001234567890
```

#### ✅ 方式二：网页管理后台
- 访问：`/admin/storage`
- 位置：存储设置 → Telegram 配置 → Chat ID
- 支持留空使用环境变量

**获取Chat ID方法：**
1. 创建一个Telegram频道/群组
2. 将Bot添加为管理员
3. 使用Bot发送消息获取Chat ID（负数为频道/超级群组）

---

## 二、网页端配置界面

### 2.1 管理后台 - 存储设置 (`/admin/storage`)

#### 📦 Telegram 存储配置

| 配置项 | 说明 | 示例值 |
|--------|------|--------|
| **Bot Token** | Telegram Bot访问令牌 | `123456:ABC...` |
| **Chat ID** | 存储频道/群组ID | `-1001234567890` |
| **代理URL** | Telegram API代理（可选） | `http://127.0.0.1:7890` |

**配置截图位置：**
- 路径：`frontend/pages/admin/storage.vue`
- 行号：315-325

**API接口：**
```
GET  /api/admin/storage/config         # 获取存储配置
PUT  /api/admin/storage/config         # 更新存储配置
POST /api/admin/storage/backends       # 添加存储后端
PUT  /api/admin/storage/backends/{id}  # 更新存储后端
```

---

### 2.2 管理后台 - Telegram Bot 管理

#### 🤖 Bot Token 管理 API

**API端点：**
```
GET  /api/admin/telegram/bot           # 获取Bot Token状态
PUT  /api/admin/telegram/bot           # 更新Bot Token
POST /api/admin/telegram/bot/restart   # 重启Bot
```

**返回数据示例：**
```json
{
  "success": true,
  "data": {
    "configured": true,
    "source": "database",        // 或 "environment"
    "env_set": false,
    "db_set": true,
    "token_preview": "123456:ABC..."  // 仅显示前几位
  }
}
```

**状态说明：**
- `configured`: Bot Token是否已配置
- `source`: 配置来源（environment环境变量 / database数据库）
- `env_set`: 是否通过环境变量设置
- `db_set`: 是否在数据库中设置

---

### 2.3 管理后台 - 系统设置 (`/admin/settings`)

#### ⚙️ 群组上传相关配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| **群组管理员ID** | 允许群组上传的管理员TG用户ID | 空 |
| **仅管理员上传** | 是否仅允许管理员在群组上传 | 否 |
| **群组上传回复** | 上传成功后是否回复消息 | 是 |
| **回复延迟删除** | 回复消息自动删除延迟（秒） | 0（不删除） |
| **TG同步删除** | 后台删除图片时同步删除TG消息 | 是 |

**配置位置：**
- 文件：`tg_imagebed/api/settings.py`
- 表单字段：`group_upload_admin_only`, `group_admin_ids`, `group_upload_reply`, `group_upload_delete_delay`, `tg_sync_delete_enabled`

**API接口：**
```
GET /api/admin/system/settings         # 获取系统设置
PUT /api/admin/system/settings         # 更新系统设置
```

---

## 三、数据库配置表

### 3.1 admin_config 表

存储管理员配置和敏感设置。

**Telegram相关键值：**

| Key | 说明 | 默认值 |
|-----|------|--------|
| `telegram_bot_token` | Bot Token（数据库方式） | 空 |
| `group_admin_ids` | 群组管理员ID列表 | 空 |
| `group_upload_admin_only` | 仅管理员群组上传 | `0` |
| `group_upload_reply` | 群组上传回复 | `1` |
| `group_upload_delete_delay` | 回复删除延迟 | `0` |
| `tg_sync_delete_enabled` | TG消息同步删除 | `1` |

**存储配置：**

| Key | 说明 |
|-----|------|
| `storage_config_json` | 存储后端配置（JSON格式） |
| `storage_active_backend` | 当前激活的存储后端名称 |
| `storage_upload_policy_json` | 上传路由策略配置 |

---

## 四、配置优先级

### 4.1 Bot Token 优先级
```
环境变量 BOT_TOKEN
    ↓（优先级最高）
数据库 telegram_bot_token
    ↓（如果环境变量未设置）
默认值（空）
```

### 4.2 Storage Chat ID 优先级
```
存储配置 storage_config_json 中的 chat_id
    ↓（优先级最高）
环境变量 STORAGE_CHAT_ID
    ↓（如果配置未设置）
默认值（0）
```

### 4.3 配置迁移机制

**自动迁移：**
- 首次启动时，环境变量会自动迁移到数据库
- 迁移后，管理员可通过网页修改
- 迁移标记：`__env_settings_migrated_v1__`

---

## 五、网页配置流程

### 5.1 初次配置流程

1. **配置环境变量（可选）**
   ```bash
   # 编辑 .env 文件
   BOT_TOKEN=你的Bot Token
   STORAGE_CHAT_ID=你的频道ID
   ```

2. **启动服务**
   ```bash
   python main.py
   # 或
   docker-compose up -d
   ```

3. **访问管理后台**
   - URL: `http://localhost:18793/admin`
   - 默认账号: `admin` / 查看日志获取密码

4. **配置存储设置**
   - 进入：存储设置 (`/admin/storage`)
   - 选择驱动：Telegram
   - 填写 Bot Token 和 Chat ID
   - 点击保存

5. **测试上传**
   - 使用"管理员上传测试"功能
   - 验证配置是否正确

---

### 5.2 动态修改配置（不重启）

#### 修改Bot Token
1. 访问：`/admin/storage`
2. 编辑 Telegram 存储配置
3. 更新 Bot Token
4. 点击"重启Bot"按钮

**注意：** 如果通过环境变量设置，则无法通过网页修改。

#### 修改群组上传配置
1. 访问：`/admin/settings`
2. 滚动到"群组上传配置"部分
3. 修改相关设置
4. 点击"保存设置"

---

## 六、配置文件位置

### 6.1 后端配置文件

| 文件 | 说明 |
|------|------|
| `tg_imagebed/config.py` | 环境变量配置读取 |
| `tg_imagebed/database.py` | 数据库配置管理 |
| `tg_imagebed/api/settings.py` | 系统设置API |
| `tg_imagebed/api/admin.py` | Telegram Bot管理API |
| `tg_imagebed/bot_control.py` | Bot控制逻辑 |
| `tg_imagebed/storage/router.py` | 存储路由配置 |
| `tg_imagebed/storage/backends/telegram.py` | Telegram存储后端 |

### 6.2 前端配置界面

| 文件 | 说明 |
|------|------|
| `frontend/pages/admin/storage.vue` | 存储设置页面 |
| `frontend/pages/admin/settings.vue` | 系统设置页面 |

---

## 七、环境变量完整列表

### 7.1 Telegram相关环境变量

```env
# === Telegram Bot 配置 ===
BOT_TOKEN=                          # Telegram Bot Token（必需）
STORAGE_CHAT_ID=                    # 存储频道/群组ID（必需）

# === 代理配置（可选） ===
HTTP_PROXY=http://127.0.0.1:7890    # HTTP代理
HTTPS_PROXY=http://127.0.0.1:7890   # HTTPS代理
NO_PROXY=localhost,127.0.0.1        # 不使用代理的地址

# === 群组上传配置（已迁移到数据库） ===
ENABLE_GROUP_UPLOAD=false           # 是否启用群组上传（已弃用）
GROUP_UPLOAD_ADMIN_ONLY=false       # 仅管理员群组上传（已弃用）
GROUP_ADMIN_IDS=                    # 管理员ID列表（已弃用）
GROUP_UPLOAD_ALLOWED_CHAT_IDS=      # 允许的群组ID（已弃用）
GROUP_UPLOAD_REPLY=true             # 上传后回复（已弃用）
GROUP_UPLOAD_DELETE_DELAY=0         # 回复删除延迟（已弃用）
TG_SYNC_DELETE_ENABLED=true         # TG消息同步删除（已弃用）
```

**注意：** 
- 标记为"已弃用"的环境变量仅在首次启动时迁移到数据库
- 迁移后通过网页管理后台修改
- 环境变量优先级低于数据库配置

---

## 八、常见问题

### Q1: 如何获取Bot Token？
**A:** 
1. 在Telegram搜索 `@BotFather`
2. 发送 `/newbot` 创建新Bot
3. 按提示设置Bot名称和用户名
4. 复制返回的Token

### Q2: 如何获取Chat ID？
**A:**
1. 创建一个Telegram频道或超级群组
2. 将Bot添加为管理员
3. 使用以下方法之一：
   - 转发频道消息到 `@userinfobot`
   - 使用API: `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - 频道ID通常为负数（如 `-1001234567890`）

### Q3: 环境变量和数据库配置冲突怎么办？
**A:**
- Bot Token: 环境变量优先级最高
- 其他配置: 数据库优先级最高
- 建议：生产环境用环境变量，测试环境用数据库

### Q4: 如何切换配置方式？
**A:**
```bash
# 方式1 → 方式2：删除环境变量
# 编辑 .env，删除或注释 BOT_TOKEN
# BOT_TOKEN=

# 方式2 → 方式1：添加环境变量
# 编辑 .env，添加 BOT_TOKEN
BOT_TOKEN=你的Token

# 重启服务
docker-compose restart
```

### Q5: 网页修改后需要重启吗？
**A:**
- Bot Token: 需要点击"重启Bot"按钮（不需要重启容器）
- 系统设置: 立即生效，无需重启
- 存储配置: 立即生效，无需重启

---

## 九、安全建议

### 9.1 生产环境配置
✅ **推荐做法：**
- Bot Token 使用环境变量
- 设置强密码 `ADMIN_PASSWORD`
- 配置 `SECRET_KEY` 随机密钥
- 限制管理后台访问（nginx反向代理+IP白名单）

❌ **不推荐做法：**
- 将Bot Token直接写入代码
- 使用默认管理员密码
- 在公网暴露管理后台

### 9.2 敏感配置保护
项目已自动保护以下配置：
- `telegram_bot_token` - 数据库加密存储
- `cloudflare_api_token` - API响应时不返回明文
- `storage_config_json` - 敏感字段脱敏

---

## 十、配置检查清单

### ✅ 部署前检查
- [ ] `.env` 文件已配置 `BOT_TOKEN`
- [ ] `.env` 文件已配置 `STORAGE_CHAT_ID`
- [ ] Bot已添加到目标频道为管理员
- [ ] 已设置 `ADMIN_PASSWORD`
- [ ] 已设置 `SECRET_KEY`
- [ ] 如需代理，已配置 `HTTP_PROXY` / `HTTPS_PROXY`

### ✅ 启动后检查
- [ ] 访问 `/admin` 可以登录
- [ ] 访问 `/admin/storage` 可以看到存储配置
- [ ] 测试上传功能正常
- [ ] 查看 `/api/bot/status` 确认Bot状态
- [ ] 检查日志无错误信息

---

## 📚 相关文档

- [主README](../README.md) - 项目总览
- [Docker部署](../docker-compose.yml) - 容器部署配置
- [环境变量模板](../.env.example) - 配置模板
- [前端文档](../frontend/README.md) - 前端开发文档

---

## 🆘 获取帮助

如遇到配置问题：
1. 查看服务日志：`docker logs telegram-imagebed`
2. 检查Bot状态：访问 `/api/bot/status`
3. 提交Issue：https://github.com/lansepyy/tg-telegram-imagebed/issues

---

**更新时间：** 2025-12-18  
**版本：** v2.0.0
