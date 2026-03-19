# Changelog

## [2.0.0] - 2026-03-18

### Added
- **Quiet 标注模式**：每页最多 8 个唯一术语，同词只标首次，difficulty 过滤（low 不标）
- **Faded 消退**：viewCount >= 3 自动淡化，mastered 只通过手动"我知道了"确认
- **193 个 AI/Agent 核心术语**（从 42 扩展），覆盖 12 大领域
- **术语关系图谱**（relations.json）：1052 条 prerequisites + related 关系
- **difficulty 三级分类**：low / medium / high，控制标注密度
- **埋点系统**：page_scan / tooltip_open / mark_mastered 三类事件
- **"我知道了 ✓" 按钮**：一键标记 mastered，支持 upsert 防竞态

### Changed
- categories.json 从 40+ 碎分类归并到 12 个大分类
- manifest 从 `<all_urls>` 收窄到 20 个明确 AI/技术站点
- storage.js 注入 content_scripts（修复学习功能静默失效）
- popup.html 加载 storage.js + 版本号动态化
- faded 状态在 panel/popup 正确显示
- analytics 数组加容量保护（MAX 1000）

### Fixed
- 12 个 alias 模式冲突（Aho-Corasick 不确定行为）
- markTermMastered 竞态（首次点击可能不持久化）
- popup 缺 storage.js 导致词库列表无法加载

## [1.1.0] - 2026-03-12

### Added
- 云端词库同步（自定义 URL + 热重载）
- OpenClaw 场景检测和专属提示

### Changed
- 匹配引擎优化

## [1.0.0] - 2026-03-08

### Added
- 初始版本：42 个术语
- Aho-Corasick 匹配引擎
- Shadow DOM 三级浮窗
- 侧边学习面板
- Chrome Storage 持久化
- Popup 管理面板
