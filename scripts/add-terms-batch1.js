#!/usr/bin/env node
// 批量新增词条 - 第1批：AI产品与平台 + 提示工程扩充
const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '../src/dictionary/terms.json');
const existing = JSON.parse(fs.readFileSync(termsPath, 'utf8'));

const newTerms = {

  // ========== AI 产品与平台 ==========
  'claude': {
    term: 'Claude',
    aliases: ['Claude AI', 'Anthropic Claude'],
    category: 'AI 产品与平台',
    levels: {
      beginner: 'Anthropic 公司做的 AI 助手，跟 ChatGPT 类似，擅长长文本理解和写作，被很多人认为回答更有深度、更安全。',
      intermediate: '由 Anthropic 开发的 LLM 系列，包括 Claude 3.5 Sonnet/Haiku/Opus 等版本。以长上下文窗口（200K tokens）、安全对齐和指令遵循能力著称。',
      advanced: 'Claude 基于 Constitutional AI 训练方法，通过 RLHF 和 CAI 双重对齐机制减少有害输出。支持 extended thinking 模式，内部使用更长的推理链。架构细节未公开，但据推测为稀疏激活的 MoE 变体。'
    },
    relatedTerms: ['chatgpt', 'llm', 'constitutional-ai', 'rlhf'],
    contexts: ['ai-assistant', 'coding', 'writing'],
    emoji: '🤖',
    difficulty: 'low'
  },

  'chatgpt': {
    term: 'ChatGPT',
    aliases: ['Chat GPT', 'ChatGPT-4'],
    category: 'AI 产品与平台',
    levels: {
      beginner: 'OpenAI 做的 AI 聊天机器人，是现在最知名的 AI 产品，可以聊天、写代码、写文章，几乎什么都能问。',
      intermediate: 'OpenAI 推出的对话式 AI 产品，底层使用 GPT 系列模型。支持插件、代码解释器、图片生成（DALL-E）等功能，有免费版和 Plus 订阅版。',
      advanced: 'ChatGPT 是 GPT 模型的对话封装，通过 RLHF 进行指令对齐。系统架构包含安全过滤层、工具调用层和多模态处理层。ChatGPT Plus 使用 GPT-4o，支持实时语音、视觉输入。'
    },
    relatedTerms: ['gpt', 'llm', 'claude', 'gpt-4o'],
    contexts: ['ai-assistant', 'general-purpose'],
    emoji: '💬',
    difficulty: 'low'
  },

  'gpt-4o': {
    term: 'GPT-4o',
    aliases: ['GPT4o', 'gpt4o', 'omni'],
    category: 'AI 产品与平台',
    levels: {
      beginner: 'OpenAI 最新的旗舰模型，"o"代表"omni（全能）"，能同时理解文字、图片和声音，反应速度也更快。',
      intermediate: 'OpenAI 的多模态旗舰模型，原生支持文本、图像、音频输入输出，延迟大幅降低。相比 GPT-4 Turbo，速度快 2 倍，价格降低 50%。',
      advanced: 'GPT-4o 是首个端到端原生多模态模型，音频不再经过 Whisper+TTS 中转，而是直接在统一模型内处理，减少了信息损耗和延迟。支持实时对话和情感感知。'
    },
    relatedTerms: ['gpt', 'chatgpt', 'multimodal'],
    contexts: ['multimodal', 'ai-assistant'],
    emoji: '⚡',
    difficulty: 'low'
  },

  'gemini': {
    term: 'Gemini',
    aliases: ['Gemini AI', 'Google Gemini', 'Bard'],
    category: 'AI 产品与平台',
    levels: {
      beginner: 'Google 做的 AI 助手，原来叫 Bard，现在改名叫 Gemini。内置在 Google 搜索和 Gmail 等产品里，用起来很方便。',
      intermediate: 'Google DeepMind 开发的多模态大模型系列，包括 Gemini Ultra/Pro/Flash/Nano。原生支持文本、图像、音频、视频输入，上下文窗口可达 1M tokens。',
      advanced: 'Gemini 1.5 采用 MoE 架构，实现百万 token 长上下文。通过 ALiBi 位置编码改进解决长距离依赖问题。Gemini 2.0 支持原生工具调用和多模态输出，是 Google 的 Agent 核心底座。'
    },
    relatedTerms: ['llm', 'multimodal', 'chatgpt', 'claude'],
    contexts: ['ai-assistant', 'google-ecosystem'],
    emoji: '💎',
    difficulty: 'low'
  },

  'midjourney': {
    term: 'Midjourney',
    aliases: ['MJ', 'mid journey'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '用文字生成图片的 AI 工具，你描述你想要的画面，它就帮你画出来，风格非常精美，是设计师和创作者常用的工具。',
      intermediate: '基于 Diffusion 模型的图像生成服务，通过 Discord 机器人操作。以艺术风格强、审美水准高著称，支持 --style、--ar（宽高比）等参数控制。',
      advanced: 'Midjourney 使用自研的扩散模型，V6 版本引入了更精准的文本理解和图像一致性控制。与开源 Stable Diffusion 不同，其模型和训练数据不公开，以服务订阅形式提供。'
    },
    relatedTerms: ['stable-diffusion', 'dall-e', 'diffusion-model', 'image-generation'],
    contexts: ['image-generation', 'creative'],
    emoji: '🎨',
    difficulty: 'low'
  },

  'stable-diffusion': {
    term: 'Stable Diffusion',
    aliases: ['SD', 'StableDiffusion', 'SDXL'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '开源的 AI 画图工具，和 Midjourney 类似，但可以免费下载在自己电脑上跑，有大量社区风格可选，完全免费。',
      intermediate: '由 Stability AI 开源的扩散模型，支持本地部署。生态丰富，有 ControlNet（姿态控制）、LoRA（风格微调）等扩展。SDXL、SD 3.0 是其主要迭代版本。',
      advanced: '基于 Latent Diffusion Model（LDM）架构，在压缩的潜空间而非像素空间执行扩散过程，大幅降低计算量。使用 CLIP 文本编码器将 prompt 转为条件向量引导去噪。'
    },
    relatedTerms: ['diffusion-model', 'midjourney', 'dall-e', 'lora'],
    contexts: ['image-generation', 'open-source'],
    emoji: '🖼️',
    difficulty: 'medium'
  },

  'dall-e': {
    term: 'DALL-E',
    aliases: ['DALL·E', 'DALLE', 'DALL-E 3'],
    category: 'AI 产品与平台',
    levels: {
      beginner: 'OpenAI 做的 AI 画图工具，ChatGPT Plus 里就内置了，直接在对话里说"帮我画一只猫"，它就能生成图片。',
      intermediate: 'OpenAI 的图像生成模型系列，DALL-E 3 与 ChatGPT 深度集成，文本理解能力强，能准确渲染复杂描述和文字内容。',
      advanced: 'DALL-E 3 相比前代引入了重新描述（recaptioning）技术，用 GPT-4 自动扩展和优化用户 prompt，大幅提升图文对齐质量。底层基于 Diffusion Transformer 架构。'
    },
    relatedTerms: ['midjourney', 'stable-diffusion', 'image-generation'],
    contexts: ['image-generation', 'chatgpt'],
    emoji: '🎭',
    difficulty: 'low'
  },

  'cursor': {
    term: 'Cursor',
    aliases: ['Cursor IDE', 'Cursor Editor'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '一个内置 AI 的代码编辑器，写代码时可以直接跟 AI 对话、让它帮你改代码，是程序员最喜欢的 AI 工具之一。',
      intermediate: '基于 VS Code 的 AI 代码编辑器，深度集成 Claude/GPT-4 等模型。支持 Tab 自动补全、Composer 多文件编辑、@codebase 全库问答等功能。',
      advanced: 'Cursor 通过 LSP 协议获取代码语义信息，结合 RAG 技术检索相关代码上下文，再输入给 LLM 进行推理。Cursor Agent 模式可自主执行终端命令，实现端到端的编码任务。'
    },
    relatedTerms: ['copilot', 'claude', 'llm', 'code-interpreter'],
    contexts: ['coding', 'development'],
    emoji: '⌨️',
    difficulty: 'low'
  },

  'copilot': {
    term: 'Copilot',
    aliases: ['GitHub Copilot', 'Microsoft Copilot'],
    category: 'AI 产品与平台',
    levels: {
      beginner: 'GitHub（微软）做的 AI 编程助手，装在代码编辑器里，写代码时它会自动猜你接下来要写什么，帮你补全代码。',
      intermediate: 'GitHub 推出的 AI 代码补全服务，基于 OpenAI Codex 模型。支持 VS Code、JetBrains 等主流 IDE，可补全函数、生成注释、编写测试。',
      advanced: 'GitHub Copilot 使用针对代码微调的 GPT 模型，通过 FIM（Fill-in-the-Middle）技术同时利用光标前后的上下文进行补全。Copilot Workspace 进一步向 Agent 化演进，支持从 Issue 到 PR 的全流程自动化。'
    },
    relatedTerms: ['cursor', 'gpt', 'code-interpreter', 'github-actions'],
    contexts: ['coding', 'development'],
    emoji: '🚁',
    difficulty: 'low'
  },

  'perplexity-ai': {
    term: 'Perplexity',
    aliases: ['Perplexity AI', 'perplexity.ai'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '一个 AI 搜索引擎，和 Google 不同的是，它不只给你链接，而是直接整合多个网页的信息给你一个完整的答案，还附带来源。',
      intermediate: 'AI 原生搜索引擎，结合了实时网络检索和 LLM 生成能力。每次回答都附带引用来源，支持追问，适合需要信息聚合的研究场景。',
      advanced: 'Perplexity 采用 RAG 架构：先用搜索引擎检索实时网页，再将检索结果作为上下文输入 LLM 生成答案。相比传统 RAG，其检索是实时互联网级别而非私有知识库。'
    },
    relatedTerms: ['rag', 'llm', 'web-browsing', 'embedding'],
    contexts: ['search', 'research'],
    emoji: '🔍',
    difficulty: 'low'
  },

  'runway': {
    term: 'Runway',
    aliases: ['Runway ML', 'RunwayML', 'Gen-3'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '一个 AI 视频生成工具，可以把文字或图片变成视频，是现在最热门的 AI 视频创作平台之一，常被影视人用来做创意原型。',
      intermediate: 'Runway 提供 Gen-2、Gen-3 等视频生成模型，支持文生视频、图生视频、视频风格转换等功能，是专业创作者常用的 AI 视频工具。',
      advanced: 'Runway Gen-3 采用 Diffusion Transformer 架构，在时序一致性和运动流畅度上有显著提升。支持精细的摄像机控制（运镜指令），适合专业影视制作流程集成。'
    },
    relatedTerms: ['suno', 'video-generation', 'diffusion-model', 'image-generation'],
    contexts: ['video-generation', 'creative'],
    emoji: '🎬',
    difficulty: 'low'
  },

  'suno': {
    term: 'Suno',
    aliases: ['Suno AI', 'Suno Music'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '用 AI 生成完整歌曲的工具，你输入一句歌词或描述风格，它就能生成带人声的完整歌曲，非常神奇，人人都能做音乐了。',
      intermediate: 'Suno 是领先的 AI 音乐生成平台，支持文字描述生成完整歌曲（含人声、旋律、伴奏）。可指定风格、情绪、语言，也支持上传歌词。',
      advanced: 'Suno 使用自回归 Transformer 架构处理音频 token，将连续音频离散化为 token 序列再生成。与图像生成不同，音乐生成需要处理时序依赖、和声逻辑等额外约束。'
    },
    relatedTerms: ['elevenlabs', 'runway', 'text-to-speech'],
    contexts: ['music-generation', 'creative'],
    emoji: '🎵',
    difficulty: 'low'
  },

  'elevenlabs': {
    term: 'ElevenLabs',
    aliases: ['Eleven Labs', '11labs'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '做 AI 语音的工具，可以克隆声音、把文字转成逼真的语音，质量在同类产品里是最好的之一，常用于播客和有声书。',
      intermediate: 'ElevenLabs 提供高质量文本转语音（TTS）和语音克隆服务，支持 29 种语言，情感表达自然。API 友好，常用于播客、有声书、游戏配音等场景。',
      advanced: 'ElevenLabs 使用基于 Diffusion 的 TTS 模型，通过少量样本（约 1 分钟）即可克隆说话人音色。V3 版本引入了 Turbo 模式，将延迟降至实时对话可接受范围。'
    },
    relatedTerms: ['suno', 'text-to-speech', 'speech-to-text'],
    contexts: ['voice', 'tts'],
    emoji: '🎙️',
    difficulty: 'low'
  },

  'replicate': {
    term: 'Replicate',
    aliases: ['replicate.com'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '一个可以直接在网上运行各种 AI 模型的平台，不用自己配置环境，按使用量付费，开发者非常喜欢用，几行代码就能调用。',
      intermediate: '云端 AI 模型托管平台，提供数千个开源模型（图像、视频、音频、LLM）的 API 访问。按 GPU 秒数计费，支持自定义模型部署（Cog 容器）。',
      advanced: 'Replicate 的 Cog 框架将模型打包成标准化容器，底层使用 Kubernetes 动态调度 GPU 资源。冷启动时间是主要痛点，通过 warmup 机制可缓解。'
    },
    relatedTerms: ['stable-diffusion', 'api', 'serverless', 'gpu'],
    contexts: ['model-hosting', 'api'],
    emoji: '🔁',
    difficulty: 'medium'
  },

  'groq': {
    term: 'Groq',
    aliases: ['Groq AI', 'GroqCloud', 'LPU'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '一个跑 AI 模型特别快的平台，比一般的 AI 服务快很多倍，适合需要极低延迟的应用，比如实时对话和语音助手。',
      intermediate: 'Groq 使用自研的 LPU（Language Processing Unit）芯片运行开源 LLM（如 Llama、Mixtral），推理速度极快（可达 500+ tokens/秒），适合实时对话场景。',
      advanced: 'Groq LPU 采用 SIMD 向量处理架构，避免了 GPU 的内存带宽瓶颈。通过编译时确定数据流（无动态调度），实现确定性延迟。代价是灵活性低，只支持固定模型架构。'
    },
    relatedTerms: ['gpu', 'inference', 'llm', 'latency'],
    contexts: ['inference', 'low-latency'],
    emoji: '⚡',
    difficulty: 'medium'
  },

  'mistral': {
    term: 'Mistral',
    aliases: ['Mistral AI', 'Mistral 7B', 'Mixtral'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '法国 AI 公司 Mistral AI 做的开源大模型，性能很强但体积小，可以在普通电脑上跑，是开源模型里的明星选手。',
      intermediate: 'Mistral AI 的旗舰开源模型系列，包括 Mistral 7B、Mixtral 8x7B（MoE 架构）等。以小参数量实现高性能著称，商业友好的 Apache 2.0 许可证。',
      advanced: 'Mistral 7B 使用 Grouped Query Attention（GQA）和 Sliding Window Attention（SWA）优化长序列处理效率。Mixtral 使用 8 个专家的 MoE，每次推理只激活 2 个，有效参数量相当于 13B。'
    },
    relatedTerms: ['llm', 'mixture-of-experts', 'open-source-llm', 'llama'],
    contexts: ['open-source', 'efficient-model'],
    emoji: '🌪️',
    difficulty: 'medium'
  },

  'llama': {
    term: 'Llama',
    aliases: ['LLaMA', 'Llama 2', 'Llama 3', 'Meta Llama'],
    category: 'AI 产品与平台',
    levels: {
      beginner: 'Meta（Facebook 母公司）做的开源 AI 大模型，因为是开源免费的，所以很多公司和研究者都基于它来开发自己的 AI 产品。',
      intermediate: 'Meta 发布的开源 LLM 系列，Llama 2/3 支持商业使用。是目前最流行的开源基础模型，Ollama、vLLM 等本地部署工具都以 Llama 为核心支持对象。',
      advanced: 'Llama 3 采用 GQA（Grouped Query Attention）减少 KV Cache 内存占用，使用 128K 词表（较 Llama 2 的 32K 大幅扩展）。通过 RLHF 和 DPO 进行指令对齐，发布了 8B、70B、405B 不同规模版本。'
    },
    relatedTerms: ['llm', 'open-source-llm', 'mistral', 'ollama', 'fine-tuning'],
    contexts: ['open-source', 'local-deployment'],
    emoji: '🦙',
    difficulty: 'low'
  },

  'deepseek': {
    term: 'DeepSeek',
    aliases: ['DeepSeek AI', 'DeepSeek-R1', 'DeepSeek-V3', '深度求索'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '中国 AI 公司深度求索做的大模型，性能接近 GPT-4 但成本极低，2025 年初震惊了全球 AI 圈，是开源领域的重大突破。',
      intermediate: 'DeepSeek 是深度求索（中国）开发的高性价比 LLM 系列，DeepSeek-V3 和 R1 在多个基准测试上媲美 GPT-4o，训练成本仅为竞争对手的 1/10，引发全球关注。',
      advanced: 'DeepSeek-V3 使用 MoE 架构（671B 总参数，37B 激活），配合 Multi-Head Latent Attention（MLA）压缩 KV Cache。DeepSeek-R1 使用纯 RL 训练推理能力，无需人工监督数据，是推理模型的重要突破。'
    },
    relatedTerms: ['llm', 'mixture-of-experts', 'open-source-llm'],
    contexts: ['open-source', 'efficient-model'],
    emoji: '🌊',
    difficulty: 'low'
  },

  'qwen': {
    term: 'Qwen',
    aliases: ['通义千问', '千问', 'Qwen2', 'Alibaba Qwen'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '阿里巴巴做的 AI 大模型，叫"通义千问"，是国内最强的开源大模型之一，中文理解能力特别好，有免费版可以用。',
      intermediate: '阿里云发布的 LLM 系列（通义千问），包括 Qwen2.5 等版本，中文能力突出。开源版本广泛支持本地部署，商业版通过阿里云 API 访问。',
      advanced: 'Qwen2.5 在中文 benchmark 上达到 SOTA，使用了大量中文预训练语料和针对性的指令微调数据。支持 7B 到 72B 多个规模，并有专门的 Qwen-Coder、Qwen-VL 等专用版本。'
    },
    relatedTerms: ['llm', 'open-source-llm', 'wenxin', 'kimi'],
    contexts: ['chinese-ai', 'open-source'],
    emoji: '🌐',
    difficulty: 'low'
  },

  'wenxin': {
    term: '文心一言',
    aliases: ['ERNIE Bot', 'ErnieBot', '文心', 'ERNIE'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '百度做的 AI 聊天助手，是国内最早上线的大模型产品之一，和 ChatGPT 类似，可以聊天、写作、回答问题。',
      intermediate: '百度推出的对话式 AI 产品，基于 ERNIE（文心）大模型。深度集成百度搜索和知识图谱，对中文语境和时事信息理解较好。',
      advanced: '文心大模型基于 ERNIE（Enhanced Representation through kNowledge IntEgration）架构，通过知识增强预训练融合百度知识图谱。ERNIE 4.0 引入多模态能力和工具调用。'
    },
    relatedTerms: ['llm', 'qwen', 'kimi', 'doubao'],
    contexts: ['chinese-ai', 'baidu'],
    emoji: '📝',
    difficulty: 'low'
  },

  'kimi': {
    term: 'Kimi',
    aliases: ['Kimi AI', '月之暗面', 'Moonshot AI', 'Kimi k1.5'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '月之暗面公司做的 AI 助手，最大的特点是能处理超长文档，你可以把整本书发给它来分析，非常适合做资料整理和文献阅读。',
      intermediate: '由月之暗面（Moonshot AI）开发的 LLM 产品，以超长上下文处理著称（支持 200K+ tokens），适合长文档分析、PDF 阅读等任务。',
      advanced: 'Kimi 在长上下文处理上做了专项优化，通过改进的注意力机制和内存管理支持超长输入。Kimi k1.5 采用强化学习提升推理能力，是国内首批推理模型之一。'
    },
    relatedTerms: ['llm', 'context-window', 'wenxin', 'qwen'],
    contexts: ['chinese-ai', 'long-context'],
    emoji: '🌙',
    difficulty: 'low'
  },

  'doubao': {
    term: '豆包',
    aliases: ['Doubao', '字节跳动AI', 'ByteDance AI'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '字节跳动（抖音母公司）做的 AI 助手，功能全面，有网页版和手机 App，是国内用户增长最快的 AI 产品之一，完全免费。',
      intermediate: '字节跳动推出的 AI 助手产品，基于自研 Doubao 模型。支持对话、写作、搜索、图片生成等功能，与抖音生态深度整合。',
      advanced: 'Doubao 模型在字节内部大规模工程化部署，针对高并发、低成本推理做了专项优化。字节同时开放了 Doubao API 供开发者使用，定价极具竞争力。'
    },
    relatedTerms: ['llm', 'wenxin', 'qwen', 'kimi'],
    contexts: ['chinese-ai', 'bytedance'],
    emoji: '🫘',
    difficulty: 'low'
  },

  'coze': {
    term: 'Coze',
    aliases: ['扣子', 'ByteDance Coze', 'Coze平台'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '字节跳动做的 AI 机器人搭建平台，不用写代码就能创建自己的 AI 助手，可以发布到微信、飞书等平台使用，门槛很低。',
      intermediate: '字节跳动的 Agent/Bot 构建平台，提供可视化工作流编排、插件市场、知识库集成等功能，支持发布到多渠道（飞书、抖音、Discord 等）。',
      advanced: 'Coze 采用 Workflow + Plugin 架构，Workflow 是 DAG（有向无环图）编排，Plugin 封装外部 API 调用。底层模型可选 Doubao 或 GPT 系列，支持 RAG 知识库注入。'
    },
    relatedTerms: ['dify', 'langchain', 'agent', 'rag'],
    contexts: ['no-code', 'agent-platform'],
    emoji: '🤖',
    difficulty: 'low'
  },

  'dify': {
    term: 'Dify',
    aliases: ['Dify AI', 'dify.ai'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '一个开源的 AI 应用搭建平台，可以把 AI 模型和你自己的数据结合起来做成专属的 AI 工具，不需要太多技术基础，非常适合创业者。',
      intermediate: '开源的 LLM 应用开发平台，提供 RAG 管道、Prompt 管理、工作流编排、模型对接等功能。支持自托管，内置 100+ 模型适配器。',
      advanced: 'Dify 采用模块化架构，核心组件包括：Dataset（向量存储抽象）、LLMNode（模型调用）、Tool（工具集成）和 Workflow（流程编排）。API 网关层统一处理鉴权、限流、日志。'
    },
    relatedTerms: ['langchain', 'coze', 'rag', 'agent'],
    contexts: ['llm-platform', 'open-source'],
    emoji: '🔧',
    difficulty: 'medium'
  },

  'crewai': {
    term: 'CrewAI',
    aliases: ['Crew AI', 'crew ai'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '一个让多个 AI Agent 协作完成任务的框架，就像组建一个 AI 团队，每个成员负责不同的工作，最后合力完成目标。',
      intermediate: 'Python 框架，用于构建多 Agent 协作系统。通过定义 Agent（角色、工具）和 Task（任务）来组建 AI 团队，支持顺序、并行等执行模式。',
      advanced: 'CrewAI 的 Crew 对象协调多个 Agent 的任务分配和结果传递，底层通过 LLM 实现任务理解和工具调用。相比 LangGraph，CrewAI 更偏向声明式角色定义，适合业务流程自动化。'
    },
    relatedTerms: ['multi-agent', 'langchain', 'agent', 'orchestrator'],
    contexts: ['multi-agent', 'automation'],
    emoji: '👥',
    difficulty: 'medium'
  },

  'autogpt': {
    term: 'AutoGPT',
    aliases: ['Auto-GPT', 'AutoGPT Agent'],
    category: 'AI 产品与平台',
    levels: {
      beginner: '最早流行的自主 AI Agent 项目，你给它一个目标，它会自己拆解任务、搜索资料、写代码去完成，不需要你一步步指挥。',
      intermediate: '早期著名的 Autonomous Agent 项目，基于 GPT-4 实现自主任务分解和工具调用。虽然实际效果有限，但推动了 Agent 领域的公众认知，是里程碑式产品。',
      advanced: 'AutoGPT 采用 ReAct 框架，每个循环包括 Thought（思考）、Action（工具调用）、Observation（结果观察）。其失败案例揭示了 LLM 长期规划能力不足、错误累积等核心 Agent 挑战。'
    },
    relatedTerms: ['autonomous-agent', 'agent', 'planning', 'task-decomposition'],
    contexts: ['autonomous-agent', 'early-agent'],
    emoji: '🤖',
    difficulty: 'medium'
  },

  // ========== 提示工程扩充 ==========
  'chain-of-thought': {
    term: 'Chain of Thought',
    aliases: ['CoT', '思维链', 'chain-of-thought prompting'],
    category: '提示工程',
    levels: {
      beginner: '让 AI 像人一样"先想再回答"的技巧。加上"请一步步思考"这句话，AI 的回答质量会明显提升，尤其是数学题和逻辑题。',
      intermediate: '提示工程技术，通过在 prompt 中加入"step by step"或示范推理过程，引导模型显式输出中间推理步骤，显著提升复杂推理任务准确率。',
      advanced: 'CoT 的效果来源于：中间推理步骤充当"草稿纸"，允许模型分配更多 token 计算到子问题上。Zero-shot CoT 只需一句"step by step"，Few-shot CoT 需提供推理示例。与 Process Reward Model 结合可进一步提升。'
    },
    relatedTerms: ['few-shot', 'zero-shot', 'tree-of-thought', 'react-prompting', 'prompt-engineering'],
    contexts: ['reasoning', 'prompt-design'],
    emoji: '🔗',
    difficulty: 'medium'
  },

  'one-shot': {
    term: 'One-shot',
    aliases: ['1-shot', 'one shot learning'],
    category: '提示工程',
    levels: {
      beginner: '在问 AI 时只给它看一个例子，它就能按照这个格式或方式来回答，比"零样本"多了一个参考案例，理解起来更准确。',
      intermediate: '提示策略：在 prompt 中提供一个示例（输入-输出对），让模型理解期望的格式或风格后再完成任务。效果介于 zero-shot 和 few-shot 之间。',
      advanced: 'One-shot 属于 in-context learning 的特殊情况。单个示例的选择对结果影响较大——示例的质量、格式和领域相关性都会影响模型的类比推理效果。'
    },
    relatedTerms: ['few-shot', 'zero-shot', 'in-context-learning', 'prompt-engineering'],
    contexts: ['prompt-design', 'in-context-learning'],
    emoji: '1️⃣',
    difficulty: 'low'
  },

  'system-prompt': {
    term: 'System Prompt',
    aliases: ['系统提示词', '系统提示', 'system message'],
    category: '提示工程',
    levels: {
      beginner: '在跟 AI 对话开始之前，给它的"角色设定"和"规则说明"，就像告诉一个新员工他的职责是什么、哪些事不能做。',
      intermediate: '对话开始前设置的全局指令，定义模型的角色、行为规范、输出格式和约束条件。对整个对话有持续影响，优先级高于用户消息。',
      advanced: '系统提示在 attention 机制中通过位置偏置获得更高权重，但并非绝对不可覆盖（存在 jailbreak 风险）。企业应用中系统提示通常包含：角色定义、RAG 上下文、工具说明、安全边界等。'
    },
    relatedTerms: ['prompt-engineering', 'user-message', 'jailbreak', 'assistant-message'],
    contexts: ['prompt-design', 'chatbot'],
    emoji: '⚙️',
    difficulty: 'low'
  },

  'user-prompt': {
    term: 'User Prompt',
    aliases: ['用户提示词', '用户消息', 'user input'],
    category: '提示工程',
    levels: {
      beginner: '你发给 AI 的那条消息，就是你在对话框里输入的内容，是人机对话中"用户说的话"。怎么问决定了 AI 怎么答。',
      intermediate: '对话中用户角色发送的消息，区别于 system prompt（全局设置）和 assistant message（AI 回复）。好的 user prompt 应清晰、具体，提供足够上下文。',
      advanced: '在 Chat Completions API 中，消息列表按 role 区分（system/user/assistant）。user prompt 的工程化重点：任务描述 + 约束条件 + 输出格式 + 示例，形成结构化 prompt 模板。'
    },
    relatedTerms: ['system-prompt', 'prompt-engineering', 'assistant-message', 'prompt-template'],
    contexts: ['prompt-design', 'conversation'],
    emoji: '💬',
    difficulty: 'low'
  },

  'top-k': {
    term: 'Top-k',
    aliases: ['topk', 'top_k', 'top k sampling'],
    category: '提示工程',
    levels: {
      beginner: '控制 AI 每次选词时"候选池大小"的参数。设置 k=50 意味着 AI 从概率最高的 50 个词里随机选一个，k 越小 AI 越保守谨慎。',
      intermediate: '生成参数，限制每个 token 的候选池大小，只从概率最高的 k 个 token 中采样。k 小则输出更保守、可预测；k 大则更多样。通常与 top-p 配合使用。',
      advanced: 'Top-k 截断在 logit 空间操作：将前 k 名之外的 token 概率置零后重新归一化。缺点是 k 是固定数量，无法适应概率分布形态变化。Top-p 更动态，实践中更常用，两者可叠加使用。'
    },
    relatedTerms: ['top-p', 'temperature', 'token'],
    contexts: ['generation', 'inference'],
    emoji: '🎯',
    difficulty: 'medium'
  },

  'prompt-template': {
    term: 'Prompt Template',
    aliases: ['提示词模板', '提示模板'],
    category: '提示工程',
    levels: {
      beginner: '可以重复使用的 AI 提示词格式，像填空题一样，把变量部分换成不同的内容就能得到不同的回答，省去每次重新写提示词的麻烦。',
      intermediate: '包含变量占位符的结构化 prompt，通过动态填充变量实现复用。例如"请把以下{language}代码翻译成{target_language}"。LangChain 等框架对此有完整的模板管理支持。',
      advanced: 'Prompt Template 工程化时需考虑：变量转义（防注入）、条件分支（jinja2 等模板语法）、token 预算管理。结合 LLMChain 可形成可组合的 prompt 流水线。'
    },
    relatedTerms: ['prompt-engineering', 'langchain', 'prompt-chaining', 'few-shot'],
    contexts: ['prompt-design', 'automation'],
    emoji: '📋',
    difficulty: 'medium'
  },

  'prompt-chaining': {
    term: 'Prompt Chaining',
    aliases: ['提示词链', 'chain prompting'],
    category: '提示工程',
    levels: {
      beginner: '把一个复杂任务拆成多步，每一步的输出作为下一步的输入，像流水线一样让 AI 分步完成，比一次性让它做完效果更好更准确。',
      intermediate: '将复杂任务分解为多个子 prompt，每步的输出作为下一步的输入。可提高准确率，便于中间结果检查和错误定位。是构建 LLM Pipeline 的基础模式。',
      advanced: 'Prompt Chaining 本质是将单次超复杂推理分解为多次简单推理，降低每步出错概率。结合条件判断可形成分支流程，结合工具调用可形成 ReAct 风格的 Agent 循环。'
    },
    relatedTerms: ['chain-of-thought', 'prompt-template', 'agent', 'task-decomposition'],
    contexts: ['prompt-design', 'automation'],
    emoji: '⛓️',
    difficulty: 'medium'
  },

  'role-prompting': {
    term: 'Role Prompting',
    aliases: ['角色提示', '角色扮演提示', 'persona prompting'],
    category: '提示工程',
    levels: {
      beginner: '让 AI 扮演某个角色来回答问题的技巧，比如"你是一个资深医生，请回答..."，这样能让 AI 的回答更专业、更有针对性。',
      intermediate: '通过在 prompt 中为模型设定角色/专家身份，引导其以特定视角和风格生成回复。有效利用了模型在预训练中积累的角色相关知识。',
      advanced: 'Role prompting 通过激活与特定角色相关的神经网络激活模式来影响生成。研究显示，专家角色提示能小幅提升专业领域任务表现，但效果受限于基础模型的领域知识深度。'
    },
    relatedTerms: ['system-prompt', 'prompt-engineering', 'few-shot'],
    contexts: ['prompt-design', 'chatbot'],
    emoji: '🎭',
    difficulty: 'low'
  },

  'instruction-tuning': {
    term: 'Instruction Tuning',
    aliases: ['指令微调', 'instruction fine-tuning', 'FLAN'],
    category: '提示工程',
    levels: {
      beginner: '让 AI 学会"听指令"的训练方式，用大量"指令→回答"的例子来训练，让模型更好地理解和执行各种要求，变得更"听话"。',
      intermediate: '用指令格式（任务描述 + 输入 + 期望输出）的数据集对预训练模型进行微调，使模型能泛化地遵循新指令，而不只是做特定任务。Google 的 FLAN 是代表性工作。',
      advanced: '指令微调使模型从"补全下一个 token"转变为"理解并执行指令"。关键发现：在多样化任务上做指令微调能提升对未见任务的泛化能力（跨任务泛化）。通常与 RLHF 结合，先 SFT 再 RL 对齐。'
    },
    relatedTerms: ['fine-tuning', 'rlhf', 'prompt-engineering'],
    contexts: ['training', 'alignment'],
    emoji: '📚',
    difficulty: 'medium'
  },

  'prompt-leaking': {
    term: 'Prompt Leaking',
    aliases: ['提示词泄露', 'system prompt leaking'],
    category: '提示工程',
    levels: {
      beginner: '通过特殊方式让 AI 说出它被要求保密的系统提示词的攻击方法，很多 AI 产品的"秘密配方"就是这么被人发现的。',
      intermediate: '攻击者通过精心构造的 prompt 诱导模型输出系统提示词内容，暴露产品的 prompt 设计、安全边界等敏感信息。属于 Prompt Injection 的一种变体。',
      advanced: 'Prompt Leaking 利用 LLM 对指令边界的模糊处理。防御手段：在系统提示中明确禁止；输出过滤层检测泄露模式；避免在系统提示中放置真正机密信息（正确做法是通过后端鉴权控制）。'
    },
    relatedTerms: ['jailbreak', 'prompt-injection', 'system-prompt', 'red-teaming'],
    contexts: ['security', 'prompt-attack'],
    emoji: '🔓',
    difficulty: 'medium'
  },

  'prompt-compression': {
    term: 'Prompt Compression',
    aliases: ['提示词压缩', 'context compression'],
    category: '提示工程',
    levels: {
      beginner: '把很长的 AI 上下文压缩变短的技术，既节省费用（按 token 数计费），又能避免超出模型的长度限制，很实用。',
      intermediate: '在不显著损失信息的前提下减少 prompt 的 token 数量，降低推理成本和延迟。方法包括：摘要、关键信息提取、LLMLingua 等专用压缩模型。',
      advanced: 'LLMLingua 等工具通过小模型计算每个 token 的"信息量"（基于困惑度），删除低信息量 token。Selective Context 则通过句子级别的语义相似度过滤冗余内容。'
    },
    relatedTerms: ['context-window', 'context-compression', 'token', 'rag'],
    contexts: ['optimization', 'cost'],
    emoji: '🗜️',
    difficulty: 'medium'
  },

  'tree-of-thought': {
    term: 'Tree of Thought',
    aliases: ['ToT', '思维树'],
    category: '提示工程',
    levels: {
      beginner: '比"思维链"更强的 AI 推理方式，让 AI 同时探索多条解题路径，像下棋一样提前想好几步，然后选出最优的一条。',
      intermediate: '在 Chain of Thought 基础上扩展，让模型并行探索多个推理路径，通过启发式评估剪枝，适合需要规划和搜索的复杂任务。',
      advanced: 'ToT 框架将问题求解形式化为树搜索：节点是中间思维状态，边是推理步骤，搜索算法（BFS/DFS）探索解空间，评估器（LLM 或外部函数）对节点打分。代价是推理成本大幅增加（多次 LLM 调用）。'
    },
    relatedTerms: ['chain-of-thought', 'react-prompting', 'planning', 'self-consistency'],
    contexts: ['reasoning', 'planning'],
    emoji: '🌳',
    difficulty: 'high'
  },

  'react-prompting': {
    term: 'ReAct',
    aliases: ['ReAct Prompting', 'Reasoning and Acting'],
    category: '提示工程',
    levels: {
      beginner: '让 AI 边思考边行动的方法，AI 先想"我该做什么"，然后去查资料或调用工具，看到结果后再继续想，循环直到完成任务。',
      intermediate: 'Reasoning + Acting 的结合，模型交替生成 Thought（推理）和 Action（工具调用），通过 Observation（工具返回）形成闭环。是现代 LLM Agent 的核心架构模式。',
      advanced: 'ReAct 解决了纯推理（幻觉）和纯行动（无方向）的缺陷。实现上每个 step 包括 [Thought] [Action] [Observation] 三个标记段，通过 few-shot 示例告知模型格式，外层 while 循环执行工具调用。'
    },
    relatedTerms: ['chain-of-thought', 'tool-use', 'agent', 'function-calling'],
    contexts: ['agent', 'reasoning'],
    emoji: '⚡',
    difficulty: 'medium'
  },

  'self-consistency': {
    term: 'Self-consistency',
    aliases: ['自一致性', 'self consistency decoding'],
    category: '提示工程',
    levels: {
      beginner: '让 AI 对同一个问题回答多次，然后选大多数答案一致的那个，就像"少数服从多数"，能有效提高 AI 的准确率。',
      intermediate: '对同一 prompt 进行多次采样生成（temperature > 0），对所有输出的答案做多数投票，选择最一致的答案。在数学推理任务上能显著提升准确率。',
      advanced: 'Self-consistency 基于假设：正确的推理路径多种多样，但都指向同一答案；错误的路径则各有各的错法。通过边际化推理路径（而非贪心选最优路径），得到更鲁棒的答案。'
    },
    relatedTerms: ['chain-of-thought', 'tree-of-thought', 'temperature'],
    contexts: ['reasoning', 'accuracy'],
    emoji: '🔄',
    difficulty: 'medium'
  },

  'json-mode': {
    term: 'JSON Mode',
    aliases: ['JSON 模式', 'structured output mode'],
    category: '提示工程',
    levels: {
      beginner: '让 AI 的回答一定是 JSON 格式的模式，这样程序可以直接读取和处理 AI 的输出，不需要再手动整理格式，开发者必备。',
      intermediate: 'API 参数，强制模型输出合法的 JSON 格式，避免模型输出额外的解释文字导致 JSON 解析失败。不同于 structured output（需提供 JSON Schema），JSON Mode 只保证格式合法。',
      advanced: 'JSON Mode 底层通过 logit bias 将非 JSON 结构的 token 概率降为 0，强制语法合规。Structured Output（OpenAI）进一步利用 CFG（Context-Free Grammar）约束输出符合特定 JSON Schema，实现字段级别的类型保证。'
    },
    relatedTerms: ['structured-output', 'response-format', 'json', 'api'],
    contexts: ['api', 'development'],
    emoji: '📊',
    difficulty: 'medium'
  }
};

// 过滤掉已有词条
let added = 0;
let skipped = 0;
const skippedIds = [];

for (const [id, term] of Object.entries(newTerms)) {
  if (existing[id]) {
    skipped++;
    skippedIds.push(id);
  } else {
    existing[id] = term;
    added++;
  }
}

fs.writeFileSync(termsPath, JSON.stringify(existing, null, 2), 'utf8');
console.log(`第1批完成：新增 ${added} 条，跳过已有 ${skipped} 条`);
if (skippedIds.length) console.log('跳过ID:', skippedIds.join(', '));
console.log('当前总词条数:', Object.keys(existing).length);
