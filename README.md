# 📖 AgentDict — AI 术语智能学习扩展

> 在 AI 页面自动识别技术术语，零 Prompt 侵入，越用越安静。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![Terms](https://img.shields.io/badge/术语库-193条-blueviolet.svg)

## ✨ 核心特性

- **🤫 Quiet 模式**：每页最多标注 8 个术语，同词只标首次，高频常见词自动跳过——不打扰你的阅读
- **📉 越用越安静**：看过 3 次的术语自动淡化，点"我知道了"立刻消失——你越来越懂，词越来越少
- **🎓 三级解释**：每个术语提供入门 → 进阶 → 深入三级中文解释，鼠标悬停即查
- **🚀 零 Prompt 侵入**：纯客户端运行，不改你跟 AI 的对话上下文，不消耗 Token
- **📚 193 个 AI/Agent 核心术语**：覆盖 LLM、Agent、RAG、DevOps、安全、Web3 等 12 大领域
- **🔗 术语关系图谱**：1052 条前置/关联关系，构建完整的知识网络

## 📦 安装

### Chrome 开发者模式

1. 下载源码并解压
2. 打开 `chrome://extensions/` → 开启**开发者模式**
3. 点击**加载已解压的扩展程序** → 选择 `AgentDict` 文件夹
4. 将 📖 AgentDict 固定在工具栏

### 支持的站点

ChatGPT、Claude、Gemini、Poe、HuggingFace、GitHub、Stack Overflow、arXiv、Medium、Notion、OpenClaw、OpenRouter、Perplexity 及本地开发环境。

## 🧠 学习系统

```
页面出现术语 → 自动虚线标注（Quiet 模式，最多 8 个）
      ↓
悬停查看 3 次 → 虚线自动淡化（faded）
      ↓
点击"我知道了 ✓" → 虚线消失（mastered）
```

- **difficulty 分级**：low（常见词，默认不标注）/ medium / high
- **每页预算**：默认 8 个唯一术语，high 优先于 medium

## 🛠 技术架构

| 层 | 模块 | 说明 |
|---|------|------|
| Engine | Aho-Corasick + MutationObserver | O(n) 多模式匹配，实时流式检测 |
| Content | 193 术语 + 12 分类 + 1052 关系 | 含 difficulty 和 prerequisites |
| Learning | Quiet 标注 + Faded 消退 | 渐进式学习，自动状态升级 |
| UI | Shadow DOM 浮窗 + 侧边面板 | 样式隔离，三级解释 |
| Storage | chrome.storage + 埋点 | 学习进度持久化 + 使用分析 |

- **Manifest V3** Chrome Extension
- **Zero-Dependency** 纯 Vanilla JS
- **Shadow DOM** 样式隔离

## 📊 词库分布

| 领域 | 术语数 | 示例 |
|------|--------|------|
| AI 基础 | 42 | Transformer, Attention, Token, LLM |
| Agent | 35 | MCP, A2A, ReAct, Tool Use, Planning |
| 基础设施与部署 | 25 | Docker, K8s, vLLM, GPU, CI/CD |
| 模型训练 | 16 | RLHF, LoRA, Fine-tuning, Quantization |
| RAG 与检索 | 15 | RAG, Chunking, Vector DB, Re-ranking |
| 网络与协议 | 14 | WebSocket, SSE, HTTP, gRPC |
| 安全与对齐 | 12 | Guardrails, Prompt Injection, RLHF |
| 开发工具 | 11 | Git, npm, LangChain, Ollama |
| 其他 | 23 | Web3, Cloud, 提示工程 |

## 🙋‍♂️ 贡献

欢迎提交 Issue 或 PR！添加新术语：编辑 `src/dictionary/terms.json`。

术语 Schema：
```json
{
  "term-id": {
    "term": "术语名",
    "aliases": ["别名"],
    "category": "分类",
    "levels": {
      "beginner": "一句话中文解释",
      "intermediate": "技术细节",
      "advanced": "底层原理"
    },
    "relatedTerms": ["相关词"],
    "contexts": ["场景"],
    "emoji": "📌",
    "difficulty": "medium"
  }
}
```

## 📜 许可证

[MIT](LICENSE)
