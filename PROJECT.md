# AgentDict — AI 术语智能学习扩展

> 最后更新：2026-03-17

## Goal

将 AgentDict 从 42 词的原型打造成 500+ 词的 AI 术语智能学习工具，上架 Chrome 商店。

**核心设计哲学**：让用户懒得舒服。系统知道用户可能不认识什么，用户只需排除已会的词。

## Done when (v2.0 上架版)

- [ ] AI/Agent 核心词库 120~200（三级解释 + relations.json）
- [ ] Quiet 默认标注（每页预算 5-10 词 + 同词去重 + difficulty 分级）
- [ ] "我知道了"一键标记
- [ ] Faded 消退（viewCount>=3 → faded，mastered 只给手动确认）
- [ ] manifest 收窄到明确支持的站点
- [ ] 埋点：每页高亮数、tooltip 打开率、"我知道了"比率
- [ ] Chrome 商店上架（隐私政策 + 截图 + 描述）

## Done when (v2.1)

- [ ] 多领域分包（DevOps / Cloud / Web3 / 前后端）
- [ ] 领域选择 UI
- [ ] 词库 500+
- [ ] Gemini 免费 tier 自动扩词
- [ ] GitHub 开源

## State

`规划中`

## 设计原则

### 翻转假设

v1：用户知道自己不认识哪些词 → 主动查词
v2：**系统默认标注所有未掌握的词** → 用户只需说"我知道了"

### 渐进消退

```
未见 → [页面出现] → 新词（虚线标注）
    → [悬停看过 3 次] → 学习中
    → [7天未再悬停] → 已掌握（虚线消失）
    → [用户主动点"我知道了"] → 立刻已掌握
```

越用词越少 = 你越来越懂了。这本身就是成就感。

### 定位调整

v1："零 Token 消耗"
v2："**零 Prompt 侵入**" — 不影响你跟 AI 的对话上下文，但后台用免费 LLM 扩词

## 现有基础（v1.1.0）

| 模块 | 状态 | 说明 |
|------|------|------|
| Aho-Corasick 匹配引擎 | 完成 | O(n) 多模式匹配 |
| DOM 扫描 + MutationObserver | 完成 | 支持流式输出 |
| Shadow DOM 浮窗卡片 | 完成 | 三级解释，样式隔离 |
| 侧边学习面板 | 完成 | FAB + 术语列表 |
| Chrome Storage 持久化 | 完成 | 学习进度追踪 |
| Popup 管理面板 | 完成 | 3 tabs |
| 云端词库同步 | 完成 | 自定义 URL + 热重载 |
| 术语库 | 42 个 | 需扩展到 500+ |

## 架构设计

```
┌──────────────────────────────────────────┐
│             AgentDict v2.0               │
├──────────────────────────────────────────┤
│                                          │
│  Content Layer（内容层，扩容）             │
│  ├── terms.json (500+ 术语，按领域分包)   │
│  ├── categories.json (扩展分类)          │
│  └── relations.json (前置/关联关系,NEW)   │
│                                          │
│  Engine Layer（引擎层，不动）              │
│  ├── matcher.js (Aho-Corasick)           │
│  ├── scanner.js (MutationObserver)       │
│  ├── highlighter.js (标注渲染)           │
│  └── tooltip.js (浮窗卡片)               │
│                                          │
│  Learning Layer（学习层，NEW）            │
│  ├── decay.js (渐进消退 + 自动状态升级)  │
│  ├── recommender.js (上下文推荐)         │
│  └── analytics.js (统计 + 热力图)        │
│                                          │
│  AI Layer（v2.1, NEW）                   │
│  └── expander.js (Gemini 自动扩词)       │
│                                          │
│  Storage Layer（存储层，增强）             │
│  ├── storage.js (扩展学习数据)           │
│  └── sync.js (chrome.storage.sync)       │
│                                          │
│  UI Layer（展示层，增强）                 │
│  ├── panel.js (加领域选择 + 推荐区)      │
│  ├── popup.js (加统计看板 + 领域开关)    │
│  └── tooltip.js (加"我知道了"一键标记)   │
│                                          │
└──────────────────────────────────────────┘
```

**原则**：Engine Layer 不动，新增 Learning + AI Layer，Content Layer 扩容。

## 发布路线图

```
v2.0 — AI/Agent 120~200 词 / Quiet 标注 / faded 消退 / Chrome 商店上架
  ↓
v2.1 — 多领域 500+ / 领域选择 / Gemini 扩词 / GitHub 开源
  ↓
v2.2 — 间隔重复 / 统计热力图 / 上下文感知解释
  ↓
v3.0（远期）— 社区贡献 / 通用技术领域 / Firefox
```

## 词库扩展计划

| 批次 | 数量 | 范围 | 方式 |
|------|------|------|------|
| v2.0-1 | 150 | AI 核心（LLM/Agent/RAG/MCP/A2A） | AI 生成初稿 + 人工校验 |
| v2.0-2 | 120 | 开发工具链（Docker/K8s/CI/CD/Git） | 同上 |
| v2.0-3 | 120 | Cloud + Web3（AWS/GCP/Blockchain） | 同上 |
| v2.0-4 | 110 | 前端 + 后端（React/Node/DB/API） | 同上 |

每个术语：term, aliases, category, emoji, 三级解释, relatedTerms, prerequisites, domain。

## Chrome 商店上架清单

- [ ] 隐私政策页面（chrome.storage.local，无远程收集）
- [ ] 商店截图 5 张
- [ ] 商店描述（中英双语）
- [ ] 图标 / Banner 设计

## 技术方案

- Gemini API 调用放在 service worker
- 学习状态存 chrome.storage.local
- 跨设备同步用 chrome.storage.sync
- 扩词结果缓存到 IndexedDB

## Now

v2.0 核心功能已完成，Opus + Codex 双 review 12 个问题全部修复。待 Chrome 加载测试。

## Done (v2.0)

- [x] Quiet 标注（每页预算 8 词 + 同词去重 + difficulty 过滤 + high 优先）
- [x] Faded 消退（viewCount>=3 → faded，mastered 只手动）
- [x] "我知道了 ✓" 按钮（upsert 防竞态）
- [x] 词库 42 → 193（12 大分类 + difficulty 三级）
- [x] relations.json（1052 条关系，100% 覆盖）
- [x] categories.json 归并（40+ → 12 个大分类）
- [x] manifest 收窄（20 个明确站点 + localhost）
- [x] 埋点 3 处（page_scan / tooltip_open / mark_mastered）
- [x] storage.js 注入 content_scripts
- [x] popup 加载 storage.js + 版本号动态化
- [x] faded 状态 panel/popup 显示修复
- [x] analytics 容量保护（MAX 1000）
- [x] alias 冲突清理（9 处）
- [x] README v2.0 更新

## Next

1. **Chrome 加载测试**（在真实 AI 页面验证效果）
2. **Chrome 商店上架**（隐私政策 + 截图 + 描述 + 图标）
3. **GitHub 仓库初始化**（.gitignore + LICENSE + 首次提交）

## Learnings

- Codex：自动消退和自动判定已掌握是两件事，前者可以早做，后者要非常保守
- Codex：首次安装前 30 秒的体验决定留存，默认 Quiet 比全标注安全
- Codex：500+ 后启动成本上升，需要按包加载
- Opus：storage.js 未注入是单点故障，会让所有学习功能静默失效——content_scripts 加载顺序很重要
- Opus：alias 冲突在 Aho-Corasick 中会导致不确定行为，专属术语应独占自己的名字
- Codex：difficulty:low 要有明确 rubric，不能把 niche vendor 词放进去

---

**项目位置**：`2-Projects/AgentDict/`
**技术栈**：Chrome Extension (Manifest V3) / Vanilla JS / Zero-dependency
