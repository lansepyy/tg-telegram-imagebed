export const VERSION_INFO = {
  version: "2.0.7",
  updateNotes: [
    {
      version: "2.0.7",
      date: "2025-12-21",
      type: "patch",
      changes: [
        "Telegram 机器人支持智能文件命名：有 Caption 时使用说明文字作为文件名",
        "无 Caption 时自动使用日期时间格式命名（IMG_YYYYMMDD_HHMMSS.jpg）",
        "文件名安全处理：自动过滤非法字符，保留字母数字和常用符号",
        "Caption 无扩展名时自动添加 .jpg 后缀"
      ]
    },
    {
      version: "2.0.6",
      date: "2025-12-21",
      type: "patch",
      changes: [
        "本地缓存逻辑优化：始终优先读取本地缓存（即使关闭开关），仅控制是否写入新缓存",
        "本地缓存默认状态改为关闭，需手动开启才会缓存新图片",
        "新增 X-Cache-Enabled 响应头，明确标识缓存开关状态",
        "图片管理列表 API 返回 local_cached 字段，支持详情模态框显示缓存状态",
        "完善日志输出：区分缓存读取/写入/跳过等操作",
        "修复本地缓存配置保存问题：settings.py API 正确处理字段"
      ]
    },
    {
      version: "2.0.5",
      date: "2025-12-21",
      type: "patch",
      changes: [
        "优化数据库并发性能：启用 WAL 模式，增加超时时间到 30 秒",
        "为关键数据库操作添加重试机制，解决高并发时 database locked 错误",
        "图片管理页面完整显示本地缓存状态（卡片徽章+详情）",
        "Settings 页面添加本地缓存配置区域（开关+路径设置）",
        "Dashboard 页面添加本地缓存统计卡片"
      ]
    },
    {
      version: "2.0.4",
      date: "2025-12-21",
      type: "minor",
      changes: [
        "新增本地缓存功能：大幅减少对 Telegram API 的请求，提升访问速度",
        "支持自定义缓存路径和开关配置",
        "管理 API 新增缓存统计和清理功能",
        "图片列表显示本地缓存状态",
        "修复频道多图评论问题：频道改为每张图单独评论，群组保持批量模式"
      ]
    },
    {
      version: "2.0.3",
      date: "2025-12-21",
      type: "patch",
      changes: [
        "修复管理页 Logo 重影及跳转问题",
        "Telegram 机器人升级为「集装箱」模式：静默收集多图，统一回复第一张图片消息",
        "优化前端版本弹窗逻辑"
      ]
    },
    {
      version: "2.0.2",
      date: "2025-12-20",
      type: "patch",
      changes: [
        "管理页顶部添加Logo并支持点击跳转主页",
        "主页移除版本信息按钮，版本弹窗仅在管理页显示",
        "主题切换按钮在主页和管理页均可用"
      ]
    },
    {
      version: "2.0.1",
      date: "2025-12-20",
      type: "minor",
      changes: [
        "前端构建产物路径修复，保证Docker镜像可成功构建",
        "新增/修复版本日志自动推送到beta分支"
      ]
    },
    {
      version: "2.0.0",
      date: "2025-12-20",
      type: "major",
      changes: [
        "新增主题切换按钮",
        "版本弹窗仅在管理页显示",
        "修复 Dockerfile 构建问题"
      ]
    }
  ]
}
