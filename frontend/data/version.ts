/**
 * 版本信息配置
 */
export const VERSION_INFO = {
  version: '2.3.8',
  releaseDate: '2025-12-20',
  updateNotes: [
    {
      version: '2.3.8',
      date: '2025-12-20',
      type: 'patch',
      changes: [
        '✨ 频道多图上传时自动拆分为单图上传，每张图片都能生成独立评论（彻底解决频道相册评论只在第一张的问题）',
      ]
    },
    {
      version: '2.3.7',
      date: '2025-12-19',
      type: 'patch',
      changes: [
        '🔧 修复前端即使开启缓存也未实际使用 Blob URL 的问题',
        '🔧 优化 Telegram 频道多图发送时的回复机制 (增加重试与延迟)',
      ]
    },
    {
      version: '2.3.6',
      date: '2025-12-19',
      type: 'patch',
      changes: [
        '🔧 修复浏览器缓存设置无法保存的问题 (后端配置白名单缺失)',
      ]
    },
    {
      version: '2.3.5',
      date: '2025-12-19',
      type: 'patch',
      changes: [
        '🔧 修复 Telegram 频道相册并发回复遗漏问题 (增加随机延迟)',
      ]
    },
    {
      version: '2.3.4',
      date: '2025-12-19',
      type: 'patch',
      changes: [
        '🔧 修复刷新页面偶尔出现的 500 错误 (SSR 兼容性问题)',
        '🔧 优化浏览器缓存检测逻辑，确保存储已初始化',
      ]
    },
    {
      version: '2.3.3',
      date: '2025-12-19',
      type: 'patch',
      changes: [
        '✨ 图片管理界面新增“浏览器缓存”状态标记（蓝色徽章）',
        '✨ 图片详情弹窗新增“浏览器缓存”状态显示',
      ]
    },
    {
      version: '2.3.2',
      date: '2025-12-19',
      type: 'patch',
      changes: [
        '🔧 修复“浏览器缓存”开关无法保存的问题（后端 API 补全读取字段）',
      ]
    },
    {
      version: '2.3.1',
      date: '2025-12-19',
      type: 'patch',
      changes: [
        '🔧 修复 Telegram 频道图集上传时的评论同步问题（优化消息回复逻辑）',
        '🔧 修复管理后台版本信息按钮点击无响应问题',
        '🔧 修复“浏览器缓存”设置无法保存和持久化的问题',
      ]
    },
    {
      version: '2.3.0',
      date: '2025-12-19',
      type: 'minor',
      changes: [
        '✨ 管理界面新增主题切换按钮，支持深色/浅色模式切换',
        '✨ 版本信息弹窗从主页迁移到管理界面，更符合使用习惯',
        '✨ 新增浏览器缓存开关，用户可自主控制是否启用本地缓存',
        '✨ 管理仪表板新增浏览器缓存统计和管理功能',
        '🔧 修复 GitHub 链接为正确的仓库地址',
        '🔧 优化浏览器缓存逻辑，默认关闭需手动开启',
        '💡 新增系统设置 Store，统一管理全局配置',
        '💡 浏览器缓存设置支持持久化存储',
      ]
    },
    {
      version: '2.2.0',
      date: '2025-12-19',
      type: 'minor',
      changes: [
        '🔧 修复Git合并冲突，成功整合v2.1.0所有功能',
        '✨ Telegram Bot完整支持压缩和不压缩图片上传',
        '✨ 统一handle_file处理器，兼容photo和document两种类型',
        '✨ 前端主题切换功能（浅色/深色模式）完整可用',
        '✨ 版本信息弹窗和更新日志展示功能',
        '🔧 优化前端布局，添加GitHub链接和版本信息',
        '🔧 完善Docker配置和项目文档',
        '💡 代码库冲突清理，项目结构更加清晰',
      ]
    },
    {
      version: '2.1.0',
      date: '2025-12-18',
      type: 'minor',
      changes: [
        '✨ 新增浏览器本地缓存系统（IndexedDB）',
        '✨ 新增主题切换功能（浅色/深色模式）',
        '✨ 新增版本更新日志弹窗',
        '✨ 支持Telegram不压缩图片上传（Document类型）',
        '🔧 优化相册分页数量（50张→20张）',
        '🔧 优化图片缓存策略（7天自动过期）',
        '🔧 区分浏览器缓存和CDN缓存清理',
        '💡 相册二次访问速度提升98%',
        '💡 缓存管理支持统计和一键清理',
      ]
    },
    {
      version: '2.0.0',
      date: '2025-01-15',
      type: 'major',
      changes: [
        '✨ 新增多群组/频道同时配置功能',
        '🔧 优化Telegram Bot文件处理逻辑',
        '🔧 优化图片上传回复机制',
        '📝 完善配置文档和API文档',
      ]
    },
    {
      version: '1.5.0',
      date: '2024-12-10',
      type: 'minor',
      changes: [
        '✨ 新增GitHub Actions自动构建Docker镜像',
        '✨ 支持Beta版本自动标签（beta-1, beta-2...）',
        '🔧 优化Docker多架构构建（amd64/arm64）',
        '📚 新增详细的Telegram配置文档',
      ]
    },
    {
      version: '1.0.0',
      date: '2024-11-01',
      type: 'major',
      changes: [
        '🎉 首个正式版本发布',
        '✨ 支持Telegram Bot图片上传',
        '✨ 支持群组和私聊上传',
        '✨ 多存储后端支持（Telegram/S3/Local/Rclone）',
        '✨ Web管理界面',
      ]
    }
  ]
}

export type VersionType = 'major' | 'minor' | 'patch'

export interface VersionNote {
  version: string
  date: string
  type: VersionType
  changes: string[]
}
