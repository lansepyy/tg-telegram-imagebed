export const VERSION_INFO = {
  version: "2.0.1",
  updateNotes: [
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
