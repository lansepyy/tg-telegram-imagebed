export const VERSION_INFO = {
  version: "2.0.4",
  updateNotes: [
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
