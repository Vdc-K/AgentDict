#!/usr/bin/env node
// 批量新增词条 - 第2批：通用IT + 数据科学基础
const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '../src/dictionary/terms.json');
const existing = JSON.parse(fs.readFileSync(termsPath, 'utf8'));

const newTerms = {

  // ========== 通用 IT ==========
  'sdk': {
    term: 'SDK',
    aliases: ['Software Development Kit', '软件开发工具包'],
    category: '通用 IT',
    levels: {
      beginner: '开发者用来构建应用的"工具箱"，包含了调用某个服务所需的代码库、文档和示例，比自己从头写省很多事。',
      intermediate: 'Software Development Kit，提供特定平台/服务的封装库、API 客户端、文档和示例代码。区别于 API（通信接口），SDK 是具体语言的客户端实现，简化了直接调用 API 的工作。',
      advanced: 'SDK 通常包含：客户端库（封装 HTTP/gRPC 调用）、类型定义（TypeScript types/Pydantic models）、错误处理、重试逻辑、流式输出支持等。AI SDK（如 OpenAI Python SDK、Anthropic SDK）还封装了 SSE streaming 解析。'
    },
    relatedTerms: ['api', 'npm', 'langchain'],
    contexts: ['development', 'integration'],
    emoji: '🧰',
    difficulty: 'low'
  },

  'frontend': {
    term: 'Frontend',
    aliases: ['前端', '前端开发', 'Front-end'],
    category: '通用 IT',
    levels: {
      beginner: '网站或 App 上你能看到、能点击的那部分，就是"前端"。前端开发者负责做出好看好用的界面，让用户能操作。',
      intermediate: '负责用户界面的开发，主要技术栈包括 HTML（结构）、CSS（样式）、JavaScript（交互），以及 React、Vue 等现代框架。',
      advanced: '现代前端工程化涉及：构建工具（Vite/Webpack）、状态管理（Redux/Zustand）、SSR/SSG（Next.js）、Web性能优化（代码分割、懒加载、Web Vitals）等。在 AI 应用中，前端还需处理 SSE streaming 渲染。'
    },
    relatedTerms: ['backend', 'api', 'javascript'],
    contexts: ['development', 'web'],
    emoji: '🖥️',
    difficulty: 'low'
  },

  'backend': {
    term: 'Backend',
    aliases: ['后端', '后端开发', 'Back-end', '服务端'],
    category: '通用 IT',
    levels: {
      beginner: '网站或 App 背后看不见的部分，负责处理数据、运行逻辑、存储信息。前端是展示，后端是真正"干活"的地方。',
      intermediate: '负责服务器端逻辑、数据库交互和 API 提供的开发层。常用语言包括 Python、Node.js、Go、Java 等，负责业务逻辑、数据持久化、鉴权等核心功能。',
      advanced: '现代后端架构涵盖：RESTful/GraphQL API 设计、数据库选型（关系型/NoSQL/向量数据库）、消息队列（Kafka/Redis）、缓存策略、容器化部署（Docker/K8s）、微服务拆分等。'
    },
    relatedTerms: ['frontend', 'api', 'database', 'server'],
    contexts: ['development', 'server'],
    emoji: '⚙️',
    difficulty: 'low'
  },

  'database': {
    term: 'Database',
    aliases: ['数据库', 'DB', '数据存储'],
    category: '通用 IT',
    levels: {
      beginner: '专门存储和管理数据的系统，就像一个超级有组织的表格，可以快速查找、增加、修改和删除数据，是几乎所有 App 的核心。',
      intermediate: '数据存储和管理系统，分为关系型数据库（MySQL、PostgreSQL，用表格和 SQL 查询）和非关系型数据库（MongoDB、Redis，更灵活的数据结构）。',
      advanced: '数据库选型需考虑：ACID 特性（原子性/一致性/隔离性/持久性）、CAP 定理权衡、读写负载模式、分片和复制策略。AI 时代还出现了向量数据库（Pinecone/Chroma）用于语义检索。'
    },
    relatedTerms: ['backend', 'vector-database', 'sql', 'supabase'],
    contexts: ['development', 'data'],
    emoji: '🗄️',
    difficulty: 'low'
  },

  'server': {
    term: 'Server',
    aliases: ['服务器', '服务端', '主机'],
    category: '通用 IT',
    levels: {
      beginner: '一台一直开着的电脑，专门用来处理其他人发来的请求、提供网站或 API 服务。你访问的每个网站背后都有服务器在运行。',
      intermediate: '提供服务的计算机或软件程序。硬件服务器是高性能机器；软件服务器（如 Nginx、Express）是监听端口、处理请求的程序。两者经常一起被提到。',
      advanced: '服务器架构从传统单机演进到分布式集群，再到容器化和无服务器（Serverless）。AI 推理服务器（如 vLLM、TGI）专门优化了 LLM 的批处理和内存管理，以提升吞吐量。'
    },
    relatedTerms: ['backend', 'cloud-computing', 'docker', 'serverless'],
    contexts: ['infrastructure', 'deployment'],
    emoji: '🖥️',
    difficulty: 'low'
  },

  'cloud-computing': {
    term: 'Cloud Computing',
    aliases: ['云计算', '云服务', 'cloud'],
    category: '通用 IT',
    levels: {
      beginner: '把电脑的算力、存储、软件放到"云端"（互联网上的远程服务器），按需使用、按量付费，不需要自己买硬件。AWS、阿里云都是云计算服务商。',
      intermediate: '通过互联网提供计算资源（服务器、存储、数据库、AI 服务等）的模式。主要分为 IaaS（基础设施）、PaaS（平台）、SaaS（软件）三层。代表厂商：AWS、Azure、GCP、阿里云。',
      advanced: '云计算核心技术包括：虚拟化（Hypervisor/容器）、分布式存储（对象存储/块存储）、弹性伸缩（Auto Scaling）、全球 CDN 分发。AI 云服务还专门提供 GPU 集群和 MLOps 平台。'
    },
    relatedTerms: ['iaas', 'paas', 'saas', 'serverless', 'docker'],
    contexts: ['infrastructure', 'deployment'],
    emoji: '☁️',
    difficulty: 'low'
  },

  'saas': {
    term: 'SaaS',
    aliases: ['Software as a Service', '软件即服务'],
    category: '通用 IT',
    levels: {
      beginner: '直接在网上用的软件，不需要下载安装，按月或按年订阅，比如 Google Docs、Notion、ChatGPT Plus 都是 SaaS 产品。',
      intermediate: '软件即服务，是云计算的交付模式之一。用户通过浏览器访问软件，提供商负责维护基础设施、更新、安全。商业模式通常是订阅制（月费/年费）。',
      advanced: 'SaaS 的核心挑战：多租户架构（数据隔离）、订阅计费系统、客户成功（降低流失率/Churn）。AI SaaS 还需考虑 LLM 推理成本控制，通常通过用量限制和分层定价来平衡毛利。'
    },
    relatedTerms: ['paas', 'iaas', 'cloud-computing', 'subscription'],
    contexts: ['business', 'product'],
    emoji: '💻',
    difficulty: 'low'
  },

  'paas': {
    term: 'PaaS',
    aliases: ['Platform as a Service', '平台即服务'],
    category: '通用 IT',
    levels: {
      beginner: '一种云服务，提供了开发和部署应用所需的平台环境，开发者不用操心服务器、操作系统等底层问题，专注写代码就行。Heroku、Vercel 都是 PaaS。',
      intermediate: '平台即服务，在 IaaS 之上提供了完整的开发部署环境（运行时、中间件、数据库、构建工具）。开发者只负责代码，平台负责运维。',
      advanced: 'PaaS 和 IaaS 的核心区别是控制粒度：PaaS 抽象了操作系统和中间件层，但灵活性较低；IaaS 提供虚拟机，控制权更高但运维负担大。Kubernetes 托管服务（GKE/EKS）模糊了二者边界。'
    },
    relatedTerms: ['saas', 'iaas', 'cloud-computing', 'serverless'],
    contexts: ['infrastructure', 'deployment'],
    emoji: '🏗️',
    difficulty: 'medium'
  },

  'iaas': {
    term: 'IaaS',
    aliases: ['Infrastructure as a Service', '基础设施即服务'],
    category: '通用 IT',
    levels: {
      beginner: '云服务的最底层，提供虚拟服务器、网络、存储等基础硬件资源，你可以在上面自己装系统、部署应用，灵活但需要自己管理。',
      intermediate: '基础设施即服务，提供虚拟化的计算（VM/裸金属）、网络（VPC/负载均衡）、存储（块存储/对象存储）资源。代表：AWS EC2、Azure VM、阿里云 ECS。',
      advanced: 'IaaS 的核心是虚拟化技术（KVM/Xen）和软件定义网络（SDN）。GPU 实例（A100/H100）是 AI 训练的标准 IaaS 形态，定价按小时或按需 spot 实例，成本优化是 MLOps 的核心课题。'
    },
    relatedTerms: ['saas', 'paas', 'cloud-computing', 'docker'],
    contexts: ['infrastructure', 'deployment'],
    emoji: '🏭',
    difficulty: 'medium'
  },

  'open-source': {
    term: 'Open Source',
    aliases: ['开源', '开放源代码', 'OSS'],
    category: '通用 IT',
    levels: {
      beginner: '代码公开让所有人免费查看、使用、修改的软件。很多优秀的 AI 工具（如 Llama、Stable Diffusion）都是开源的，人人都可以下载和修改。',
      intermediate: '以公开源代码为核心的软件开发模式，通常通过 License（MIT/Apache/GPL）授权使用。相对于闭源软件，开源软件透明可审计，生态由社区共建。',
      advanced: '开源许可证分类：宽松型（MIT/Apache 2.0，可商用、无需开放修改）和 Copyleft 型（GPL，修改后的代码也需开源）。AI 模型的"开源"有争议——仅开放权重但不开放训练数据/代码的称为"开放权重"（如 Llama）。'
    },
    relatedTerms: ['github', 'git', 'license', 'fork'],
    contexts: ['development', 'community'],
    emoji: '🔓',
    difficulty: 'low'
  },

  'repository': {
    term: 'Repository',
    aliases: ['仓库', 'repo', 'git repo', '代码仓库'],
    category: '通用 IT',
    levels: {
      beginner: '存放项目代码的地方，就像代码的"档案室"，记录了所有文件和每次修改的历史，可以放在 GitHub 上和别人共享。',
      intermediate: '版本控制系统（如 Git）中存储项目代码、历史记录和元数据的存储单元。本地仓库（local repo）和远程仓库（remote repo，如 GitHub/GitLab）同步协作。',
      advanced: 'Git 仓库的底层是对象数据库（objects），存储 blob（文件内容）、tree（目录结构）、commit（提交记录）和 tag（标签）四种对象，以 SHA-1/SHA-256 内容寻址，天然去重。'
    },
    relatedTerms: ['git', 'github', 'open-source', 'pull-request'],
    contexts: ['development', 'version-control'],
    emoji: '📦',
    difficulty: 'low'
  },

  'terminal': {
    term: 'Terminal',
    aliases: ['终端', '命令行终端', 'Console', '控制台'],
    category: '通用 IT',
    levels: {
      beginner: '那个黑色窗口，通过输入文字命令来控制电脑，不用鼠标点界面。程序员每天都在用，很多 AI 工具也需要在这里操作。',
      intermediate: '命令行界面程序，提供文本输入输出的交互方式。macOS 用 Terminal/iTerm2，Windows 用 CMD/PowerShell/Windows Terminal，Linux 用各种终端模拟器。',
      advanced: '终端（Terminal Emulator）模拟了历史上的物理终端设备，通过 PTY（伪终端）与 Shell 进程通信。现代 AI 工具（如 Claude Code）大量使用终端执行命令，理解 stdin/stdout/stderr 和退出码对 Agent 工具集成至关重要。'
    },
    relatedTerms: ['shell', 'cli', 'command-line', 'ssh'],
    contexts: ['development', 'operations'],
    emoji: '⬛',
    difficulty: 'low'
  },

  'command-line': {
    term: 'Command Line',
    aliases: ['命令行', 'CLI', 'Command Line Interface', '命令行界面'],
    category: '通用 IT',
    levels: {
      beginner: '通过打字输入命令来操作电脑的方式，和图形界面（鼠标点击）相对。虽然看起来难，但用熟了比图形界面效率高很多。',
      intermediate: '基于文本的人机交互界面，通过输入命令字符串执行操作。程序员用它来运行脚本、管理文件、控制服务，效率高于图形界面，也易于自动化。',
      advanced: 'CLI 应用通常遵循 POSIX 标准：参数解析（flags/options/args）、stdin/stdout/stderr 流、退出码约定（0=成功，非0=失败）。AI Agent 通过调用 CLI 工具扩展能力，工具的 exit code 和 stdout 是 Agent 获取结果的主要方式。'
    },
    relatedTerms: ['terminal', 'shell', 'script', 'ssh'],
    contexts: ['development', 'operations'],
    emoji: '💻',
    difficulty: 'low'
  },

  'shell': {
    term: 'Shell',
    aliases: ['bash', 'zsh', 'sh', '脚本解释器'],
    category: '通用 IT',
    levels: {
      beginner: '终端里运行命令的程序，你输入的命令都是它来解析执行的。常见的有 bash、zsh（macOS 默认），功能比简单的命令行更强大，可以写自动化脚本。',
      intermediate: '命令行解释器，负责解析执行命令。Bash（Bourne Again Shell）是 Linux 标准，zsh 是 macOS 默认。支持变量、条件判断、循环，可编写 Shell Script 自动化任务。',
      advanced: 'Shell 脚本的核心特性：管道（|）实现进程间通信、重定向（>/>>/<）控制 I/O、子 shell（$()）捕获输出、信号处理（trap）。AI Agent 执行 shell 命令时，沙箱隔离（如 Docker）是防止代码注入的关键安全措施。'
    },
    relatedTerms: ['terminal', 'command-line', 'script', 'sandbox'],
    contexts: ['development', 'automation'],
    emoji: '🐚',
    difficulty: 'low'
  },

  'script': {
    term: 'Script',
    aliases: ['脚本', '自动化脚本', 'shell script'],
    category: '通用 IT',
    levels: {
      beginner: '一段写好的代码命令，可以一键执行一系列操作，省去重复手动操作的麻烦。就像录制了一段操作，下次点击就自动执行。',
      intermediate: '包含一系列命令的可执行文件，通过解释器（Python/Bash/Node.js）逐行执行而非编译。常用于自动化运维、数据处理、部署流程等场景。',
      advanced: 'AI 时代脚本的典型应用：LLM API 调用脚本（批处理/并发）、数据预处理 pipeline、部署自动化（CI/CD hooks）。Claude Code 等 AI 工具可自动生成和执行脚本，降低了脚本编写的门槛。'
    },
    relatedTerms: ['shell', 'python', 'cicd', 'automation'],
    contexts: ['development', 'automation'],
    emoji: '📜',
    difficulty: 'low'
  },

  'bug': {
    term: 'Bug',
    aliases: ['bug', '程序错误', '缺陷', '漏洞'],
    category: '通用 IT',
    levels: {
      beginner: '程序里的错误，导致它运行不正常或者产生意外结果。来源于早期计算机故障真的是因为虫子（bug）爬进了机器导致短路的传说。',
      intermediate: '软件中导致行为不符合预期的缺陷。分为逻辑错误（算法错误）、运行时错误（空指针/越界）、语法错误（编译失败）等类型，通过调试（Debug）定位和修复。',
      advanced: 'Bug 的严重程度分级（Critical/High/Medium/Low）影响修复优先级。AI 辅助编程（Cursor/Copilot）降低了 Bug 引入率，但也可能引入更难排查的 AI 幻觉型 bug——代码看起来正确但语义错误。'
    },
    relatedTerms: ['debug', 'testing', 'code-interpreter'],
    contexts: ['development', 'quality'],
    emoji: '🐛',
    difficulty: 'low'
  },

  'debug': {
    term: 'Debug',
    aliases: ['调试', '排错', 'debugging'],
    category: '通用 IT',
    levels: {
      beginner: '找到并修复程序错误的过程，就像当侦探找出代码哪里出了问题，然后修好它。是程序员花时间最多的工作之一。',
      intermediate: '定位和修复软件缺陷的过程。主要工具：IDE 断点调试器（逐行执行、查看变量）、日志分析、单元测试、错误追踪系统（Sentry）。',
      advanced: 'Debug 方法论：二分法缩小范围、最小可复现用例、添加日志打点、使用 profiler 分析性能。AI Agent 的 Debug 更复杂，需追踪 LLM 调用链路、工具调用的输入输出，通常需要专门的 observability 工具（LangSmith/Langfuse）。'
    },
    relatedTerms: ['bug', 'testing', 'logging'],
    contexts: ['development', 'quality'],
    emoji: '🔍',
    difficulty: 'low'
  },

  'deploy': {
    term: 'Deploy',
    aliases: ['部署', '上线', '发布', 'deployment'],
    category: '通用 IT',
    levels: {
      beginner: '把你写好的代码放到服务器上让别人能用的过程，就像把做好的产品从工厂运到商店上架，让用户可以访问。',
      intermediate: '将本地开发的代码发布到生产环境（服务器/云）的过程，包括构建、测试、推送镜像、更新服务等步骤。通常通过 CI/CD 流水线自动化完成。',
      advanced: '部署策略包括：蓝绿部署（Blue-Green，零停机切换）、金丝雀发布（Canary，按比例灰度）、滚动更新（Rolling Update）。AI 模型部署还需考虑模型版本管理、A/B 测试不同模型版本的效果。'
    },
    relatedTerms: ['cicd', 'docker', 'kubernetes', 'serverless'],
    contexts: ['deployment', 'infrastructure'],
    emoji: '🚀',
    difficulty: 'low'
  },

  'agile': {
    term: 'Agile',
    aliases: ['敏捷开发', '敏捷', 'Agile Development'],
    category: '通用 IT',
    levels: {
      beginner: '一种软件开发方式，把大项目拆成小阶段（Sprint），快速做出可用版本，根据反馈不断迭代，而不是花几年做完再发布。',
      intermediate: '迭代式软件开发方法论，强调快速交付、持续反馈和灵活响应变化。常见实践包括 Scrum（Sprint 冲刺）、Kanban（看板）、每日站会（Daily Standup）。',
      advanced: '敏捷的核心是缩短反馈循环（Feedback Loop）。在 AI 产品开发中，敏捷尤为重要——AI 能力快速迭代，需求频繁变化，快速原型验证比前期完整设计更有价值。'
    },
    relatedTerms: ['sprint', 'cicd', 'mvp'],
    contexts: ['development', 'management'],
    emoji: '🏃',
    difficulty: 'low'
  },

  'sprint': {
    term: 'Sprint',
    aliases: ['冲刺', 'Scrum Sprint', '迭代周期'],
    category: '通用 IT',
    levels: {
      beginner: '敏捷开发里的一个工作周期，通常 1-2 周，在这段时间内完成一批计划好的任务，结束后展示成果，再规划下一个冲刺。',
      intermediate: 'Scrum 框架中的时间盒（通常 1-4 周），团队在 Sprint 内完成一组 User Story，输出可交付的功能增量。每个 Sprint 包含：计划（Planning）、每日站会（Daily）、评审（Review）、回顾（Retro）。',
      advanced: 'Sprint 的核心价值是强制交付节奏和定期反馈。Sprint Velocity（速度）是团队的能力基准，用于未来规划。AI 辅助开发工具（Cursor/Copilot）正在改变 Sprint 的 Story Point 估算体系。'
    },
    relatedTerms: ['agile', 'mvp', 'cicd'],
    contexts: ['development', 'management'],
    emoji: '⏱️',
    difficulty: 'low'
  },

  'oauth': {
    term: 'OAuth',
    aliases: ['OAuth 2.0', '授权协议', 'Open Authorization'],
    category: '通用 IT',
    levels: {
      beginner: '允许用第三方账号登录的协议，就是"用 Google 账号登录"、"用微信登录"背后的技术。让你不用到处注册账号，也不用把密码给第三方应用。',
      intermediate: '开放授权标准协议（OAuth 2.0），允许用户授权第三方应用访问其账户资源，而无需共享密码。核心概念：Authorization Code Flow、Access Token、Refresh Token。',
      advanced: 'OAuth 2.0 的 Authorization Code + PKCE 流程：客户端生成 code_verifier/challenge → 重定向到授权服务器 → 用户授权 → 返回 code → 用 code + verifier 换 token。比隐式流（Implicit Flow）更安全，是 SPA 和移动端的推荐方案。'
    },
    relatedTerms: ['jwt', 'auth', 'api-key'],
    contexts: ['security', 'authentication'],
    emoji: '🔐',
    difficulty: 'medium'
  },

  'jwt': {
    term: 'JWT',
    aliases: ['JSON Web Token', 'JSON Web令牌'],
    category: '通用 IT',
    levels: {
      beginner: '一种用于登录验证的"通行证"，登录成功后服务器发给你一个 JWT，之后每次请求带上它，服务器就知道你是谁了，不需要每次重新验密码。',
      intermediate: 'JSON Web Token，用于无状态身份验证。由 Header.Payload.Signature 三部分组成（Base64 编码），服务器通过验证签名确认 Token 真实性，无需查数据库。',
      advanced: 'JWT 的签名算法：HS256（HMAC 对称加密，需共享密钥）和 RS256（RSA 非对称，公钥验证，适合微服务）。JWT 的主要风险：过期前无法撤销（需维护黑名单或使用短过期+Refresh Token 模式）。'
    },
    relatedTerms: ['oauth', 'auth', 'api-key'],
    contexts: ['security', 'authentication'],
    emoji: '🎫',
    difficulty: 'medium'
  },

  'dns': {
    term: 'DNS',
    aliases: ['Domain Name System', '域名解析', '域名系统'],
    category: '通用 IT',
    levels: {
      beginner: '互联网的"电话簿"，把网址（如 google.com）翻译成电脑能识别的 IP 地址（如 142.250.80.46），这样你输入域名就能找到网站。',
      intermediate: 'Domain Name System，将人类可读的域名解析为 IP 地址的分布式系统。包含 A 记录（IPv4）、AAAA 记录（IPv6）、CNAME（别名）、MX（邮件）等记录类型。',
      advanced: 'DNS 解析链：本地缓存 → 递归解析器 → 根域名服务器 → 顶级域服务器 → 权威域名服务器。TTL 控制缓存时间。DNSSEC 通过数字签名防止 DNS 劫持。CDN 通过 CNAME + Anycast 实现就近访问。'
    },
    relatedTerms: ['cdn', 'ssl-tls', 'cloud-computing'],
    contexts: ['networking', 'infrastructure'],
    emoji: '📖',
    difficulty: 'medium'
  },

  'ssl-tls': {
    term: 'SSL/TLS',
    aliases: ['HTTPS', 'SSL', 'TLS', '加密传输'],
    category: '通用 IT',
    levels: {
      beginner: '让网站通信加密的技术，浏览器地址栏里的"🔒"和"https"就代表启用了。有了它，黑客在网络上截获的数据是乱码，无法偷看你的密码。',
      intermediate: 'SSL（Secure Sockets Layer）的继任者 TLS（Transport Layer Security），为网络通信提供加密、身份认证和完整性保护。HTTPS = HTTP + TLS，通过数字证书（CA 签发）验证网站身份。',
      advanced: 'TLS 1.3 握手只需 1-RTT（相比 1.2 的 2-RTT），支持 0-RTT 恢复。密钥交换使用 ECDHE（完美前向保密），加密套件精简为 AEAD 算法。证书的 CT（Certificate Transparency）日志可防止 CA 滥发证书。'
    },
    relatedTerms: ['dns', 'cdn', 'oauth', 'api-key'],
    contexts: ['security', 'networking'],
    emoji: '🔒',
    difficulty: 'medium'
  },

  'env': {
    term: 'Environment Variable',
    aliases: ['环境变量', '.env', 'env var', 'process.env'],
    category: '通用 IT',
    levels: {
      beginner: '存储在系统里的配置信息，比如 API 密钥、数据库密码等，代码从这里读取而不是直接写在代码里，避免把秘密信息泄露到公开代码仓库。',
      intermediate: '操作系统层面的键值对配置，进程启动时从环境读取。在 Node.js 中通过 process.env 访问，在 Python 中通过 os.environ。敏感信息（密钥、密码）应通过环境变量注入而非硬编码。',
      advanced: '环境变量管理的最佳实践：.env 文件用于本地开发（加入 .gitignore），生产环境通过 Secret Manager（AWS Secrets Manager/Vault）注入，CI/CD 使用加密 Secrets。Docker 通过 --env-file 或 -e 参数传递环境变量。'
    },
    relatedTerms: ['api-key', 'docker', 'cicd', 'security'],
    contexts: ['development', 'security'],
    emoji: '🔑',
    difficulty: 'medium'
  },

  'package-manager': {
    term: 'Package Manager',
    aliases: ['包管理器', '依赖管理器', 'npm/pip/brew'],
    category: '通用 IT',
    levels: {
      beginner: '帮你自动下载和安装代码库的工具，就像 App Store，但是给开发者用的，一条命令就能安装别人写好的代码库，不用自己手动下载。',
      intermediate: '管理软件依赖的工具，负责安装、更新、卸载第三方库，并处理依赖关系。常见的有：npm/pnpm/yarn（JavaScript）、pip（Python）、cargo（Rust）、brew（macOS 系统工具）。',
      advanced: '包管理器的核心机制：依赖解析（SAT 求解器找到兼容版本集合）、lockfile（锁定精确版本保证可复现构建）、缓存（避免重复下载）。pnpm 通过硬链接共享包内容，大幅减少磁盘占用。'
    },
    relatedTerms: ['npm', 'python', 'open-source', 'repository'],
    contexts: ['development', 'tooling'],
    emoji: '📦',
    difficulty: 'low'
  },

  'javascript': {
    term: 'JavaScript',
    aliases: ['JS', 'js', 'ECMAScript', 'ES6'],
    category: '通用 IT',
    levels: {
      beginner: '网页上实现交互效果的编程语言，比如点击按钮弹出对话框、页面动态更新等都靠它。现在也可以用来做服务器端程序（Node.js）。',
      intermediate: '浏览器原生编程语言，也通过 Node.js 运行在服务器端。异步编程（Promise/async-await）是其核心特性，现代框架（React/Vue/Next.js）都基于 JavaScript/TypeScript。',
      advanced: 'JavaScript 的事件循环（Event Loop）是单线程非阻塞 I/O 模型的关键：Call Stack + Microtask Queue（Promise）+ Macrotask Queue（setTimeout）。V8 引擎通过 JIT 编译优化热点代码，性能接近原生。'
    },
    relatedTerms: ['npm', 'frontend', 'backend', 'typescript'],
    contexts: ['development', 'web'],
    emoji: '🟨',
    difficulty: 'low'
  },

  'typescript': {
    term: 'TypeScript',
    aliases: ['TS', 'ts', 'typed JavaScript'],
    category: '通用 IT',
    levels: {
      beginner: 'JavaScript 的升级版，加了类型检查，就像在代码里贴上标签说明每个变量是数字还是文字，让编辑器能提前发现错误，大项目必备。',
      intermediate: 'JavaScript 的静态类型超集，编译为 JS 运行。通过类型系统（interface、type、泛型）在编码阶段捕获错误，显著提升大型项目的可维护性。AI SDK 和 LangChain.js 等都用 TS 编写。',
      advanced: 'TypeScript 的高级类型特性：条件类型（Conditional Types）、映射类型（Mapped Types）、模板字面量类型、infer 关键字。这些特性使得构建类型安全的 AI SDK（如 Anthropic TypeScript SDK）成为可能，LLM 输出的 Zod schema 验证是典型应用。'
    },
    relatedTerms: ['javascript', 'npm', 'frontend', 'backend'],
    contexts: ['development', 'web'],
    emoji: '🔷',
    difficulty: 'medium'
  },

  'python': {
    term: 'Python',
    aliases: ['py', 'python3'],
    category: '通用 IT',
    levels: {
      beginner: 'AI 领域最流行的编程语言，语法简单像写英文，适合初学者，同时也是数据科学、机器学习的第一语言，几乎所有 AI 框架都支持 Python。',
      intermediate: '解释型通用编程语言，以简洁语法著称。在 AI/ML 领域几乎是标准语言：PyTorch、TensorFlow、HuggingFace Transformers、LangChain 等核心库都是 Python 优先。',
      advanced: 'Python 的 GIL（全局解释器锁）限制了多线程 CPU 并行，AI 计算通过 NumPy/PyTorch 调用 C++/CUDA 扩展绕过 GIL。异步 Python（asyncio）在 AI API 客户端中用于并发请求处理。'
    },
    relatedTerms: ['package-manager', 'pytorch', 'langchain', 'jupyter'],
    contexts: ['development', 'ai-ml'],
    emoji: '🐍',
    difficulty: 'low'
  },

  // ========== 数据科学基础 ==========
  'dataset': {
    term: 'Dataset',
    aliases: ['数据集', '训练数据集', 'data set'],
    category: '数据科学基础',
    levels: {
      beginner: '用来训练或测试 AI 的一批数据，就像给学生做的练习题集合。有多少好的训练数据，AI 就能学到多少知识，数据质量决定 AI 水平。',
      intermediate: '机器学习中用于训练、验证或测试模型的结构化数据集合。通常分为训练集（Training Set）、验证集（Validation Set）和测试集（Test Set）三部分，比例常为 8:1:1。',
      advanced: '高质量数据集的构建是 AI 工程的核心难题，涉及：数据采集、清洗（去重/去噪/格式统一）、标注（人工/半自动）、数据增强（扩充多样性）。现代 LLM 训练使用的 Pre-training 数据集规模达万亿 token（如 FineWeb、RedPajama）。'
    },
    relatedTerms: ['training-data', 'annotation', 'data-augmentation', 'fine-tuning'],
    contexts: ['ml', 'training'],
    emoji: '📊',
    difficulty: 'low'
  },

  'training-data': {
    term: 'Training Data',
    aliases: ['训练数据', '训练集', 'training set'],
    category: '数据科学基础',
    levels: {
      beginner: '喂给 AI 让它学习的数据，就像人学习需要教材。训练数据的质量和数量直接决定 AI 能力的上限，垃圾数据训练出垃圾模型。',
      intermediate: '机器学习模型学习的数据集部分。对于监督学习，训练数据包含输入-标签对；对于 LLM 预训练，是大规模无标注文本；对于 RLHF，是人类偏好标注对。',
      advanced: '训练数据的关键属性：规模（token 数量）、多样性（覆盖不同领域/语言/风格）、质量（低噪声、事实准确）。数据 flywheel 是现代 AI 公司的核心护城河：更多用户 → 更多数据 → 更好模型 → 更多用户。'
    },
    relatedTerms: ['dataset', 'annotation', 'fine-tuning', 'synthetic-data'],
    contexts: ['ml', 'training'],
    emoji: '📚',
    difficulty: 'low'
  },

  'test-data': {
    term: 'Test Data',
    aliases: ['测试集', '测试数据', 'test set', 'holdout set'],
    category: '数据科学基础',
    levels: {
      beginner: '留出来测试 AI 表现的数据，模型在训练时完全没见过这些数据，用它来检验 AI 真实水平，就像考试时不能提前看到考题。',
      intermediate: '与训练集完全隔离的数据集，用于评估模型的泛化能力（在未见数据上的表现）。不能用于调整模型，否则会造成数据泄露（data leakage）。',
      advanced: '测试集设计的关键：时间分割（预测未来的任务需用时间序列后段做测试集，防止未来数据泄露）、分布代表性（测试集分布应与生产分布一致）、对抗测试集（专门设计困难样本评估鲁棒性）。'
    },
    relatedTerms: ['dataset', 'training-data', 'validation-data', 'benchmark'],
    contexts: ['ml', 'evaluation'],
    emoji: '🧪',
    difficulty: 'low'
  },

  'validation-data': {
    term: 'Validation Data',
    aliases: ['验证集', '验证数据', 'validation set', 'dev set'],
    category: '数据科学基础',
    levels: {
      beginner: '训练过程中用来检验学习效果的数据，帮助调整 AI 的各种参数设置，就像做练习题后对答案，但不是最终考试（测试集）。',
      intermediate: '训练过程中用于超参数调优和早停（Early Stopping）的数据集。模型不直接学习验证集，但验证集用于监控过拟合和选择最优模型检查点。',
      advanced: 'K-fold 交叉验证（Cross-validation）通过轮换验证集充分利用有限数据。验证集与测试集的区别：验证集用于模型选择（反复查看），测试集用于最终评估（只查看一次）。数据泄露的常见原因是混淆了两者的用途。'
    },
    relatedTerms: ['dataset', 'training-data', 'test-data', 'cross-validation'],
    contexts: ['ml', 'training'],
    emoji: '✅',
    difficulty: 'medium'
  },

  'annotation': {
    term: 'Annotation',
    aliases: ['标注', '数据标注', 'labeling', '数据打标'],
    category: '数据科学基础',
    levels: {
      beginner: '人工给数据打标签的工作，比如看一张图片然后标注"这里是猫"，AI 通过这些标注来学习怎么识别物体，是 AI 训练的基础工序。',
      intermediate: '为机器学习数据添加标签的过程，包括图像分类/标注框/分割、文本分类/NER/情感、语音转写等。高质量标注是有监督学习的前提，也是 RLHF 的核心环节。',
      advanced: '标注工程涉及：标注工具（Label Studio/Scale AI）、标注指南设计（减少主观性）、一致性检验（Cohen\'s Kappa）、主动学习（优先标注信息量大的样本）。LLM 时代出现了"合成标注"（用 GPT-4 标注替代人工）降低成本。'
    },
    relatedTerms: ['dataset', 'training-data', 'rlhf', 'synthetic-data'],
    contexts: ['ml', 'data'],
    emoji: '🏷️',
    difficulty: 'medium'
  },

  'overfitting': {
    term: 'Overfitting',
    aliases: ['过拟合', '过度拟合'],
    category: '数据科学基础',
    levels: {
      beginner: 'AI 把训练数据"背得太熟"但不会举一反三的问题，就像学生死记硬背考题答案但不理解原理，换题就不会了。',
      intermediate: '模型在训练集上表现很好，但在验证集/测试集上表现显著更差的现象，说明模型记住了训练数据的噪声而非真正的规律。常见于模型过于复杂或训练数据不足时。',
      advanced: '过拟合的本质是偏差-方差权衡（Bias-Variance Tradeoff）中方差过高。缓解方法：正则化（L1/L2/Dropout）、数据增强、早停（Early Stopping）、集成方法、增加训练数据。对于 LLM，过拟合表现为在微调数据上的灾难性遗忘（Catastrophic Forgetting）。'
    },
    relatedTerms: ['underfitting', 'regularization', 'dropout', 'training-data'],
    contexts: ['ml', 'training'],
    emoji: '📈',
    difficulty: 'medium'
  },

  'underfitting': {
    term: 'Underfitting',
    aliases: ['欠拟合', '欠拟合问题'],
    category: '数据科学基础',
    levels: {
      beginner: 'AI 学得太浅，连训练数据都没学好的问题，就像学生连基础知识都没掌握，和"过拟合"相反的极端。',
      intermediate: '模型在训练集和测试集上都表现很差，说明模型过于简单，无法捕捉数据中的规律。通常需要增加模型复杂度、减少正则化或增加训练时间来解决。',
      advanced: '欠拟合的本质是偏差-方差权衡中偏差过高（Bias）。诊断方法：学习曲线（training loss 居高不下）。解决方案：增加模型容量（更多参数/层数）、降低正则化强度、使用更复杂的特征工程、延长训练时间。'
    },
    relatedTerms: ['overfitting', 'training-data', 'model-capacity'],
    contexts: ['ml', 'training'],
    emoji: '📉',
    difficulty: 'medium'
  },

  'accuracy': {
    term: 'Accuracy',
    aliases: ['准确率', '正确率', 'acc'],
    category: '数据科学基础',
    levels: {
      beginner: 'AI 答对题目的比例，比如 100 张图片里正确识别了 90 张，准确率就是 90%。是最直观的评估指标，但不一定是最好的指标。',
      intermediate: '分类任务中，预测正确的样本数占总样本数的比例：Accuracy = (TP + TN) / Total。简单直观，但在类别不平衡时（如诈骗检测）会产生误导——全猜"正常"也能有 99% 准确率。',
      advanced: '当正负样本极度不平衡时，准确率会失去意义，需改用 F1 Score、AUC-ROC 或 Matthews 相关系数（MCC）。在 LLM 评估中，准确率通常用于多选题基准（如 MMLU），但自然语言生成任务需要 BLEU/ROUGE 等专门指标。'
    },
    relatedTerms: ['precision', 'recall', 'f1-score', 'benchmark'],
    contexts: ['ml', 'evaluation'],
    emoji: '🎯',
    difficulty: 'low'
  },

  'precision': {
    term: 'Precision',
    aliases: ['精确率', '查准率', '精度'],
    category: '数据科学基础',
    levels: {
      beginner: 'AI 说"是"的时候有多少是真的"是"的比率，就像一个预言家说会下雨，100 次里有多少次真的下了——越高越准。',
      intermediate: '在所有被预测为正类的样本中，真正是正类的比例：Precision = TP / (TP + FP)。关注的是"预测为正的准不准"，适合误报代价高的场景（如垃圾邮件过滤，误把正常邮件标为垃圾很烦）。',
      advanced: 'Precision 和 Recall 存在权衡（Precision-Recall Tradeoff）：降低分类阈值可提高 Recall（捕获更多真正例）但降低 Precision（更多误报）。PR 曲线下面积（AUC-PR）在不平衡数据集中比 ROC-AUC 更有意义。'
    },
    relatedTerms: ['recall', 'f1-score', 'accuracy'],
    contexts: ['ml', 'evaluation'],
    emoji: '🎯',
    difficulty: 'medium'
  },

  'recall': {
    term: 'Recall',
    aliases: ['召回率', '查全率', '敏感度', 'Sensitivity'],
    category: '数据科学基础',
    levels: {
      beginner: '在所有真正的正例里，AI 找出了多少的比率，就像搜索引擎找资料，相关的东西有多少被找到了——越高漏报越少。',
      intermediate: '在所有真正是正类的样本中，被正确预测为正类的比例：Recall = TP / (TP + FN)。关注"真正的正例有没有被漏掉"，适合漏报代价高的场景（如癌症筛查，漏诊比误诊更危险）。',
      advanced: 'Recall 在信息检索（RAG）中有专门含义：检索到的相关文档数 / 所有相关文档数，衡量检索的"覆盖率"。在 AI 安全场景，Recall 通常是首要指标（宁可多报也不漏）。'
    },
    relatedTerms: ['precision', 'f1-score', 'accuracy'],
    contexts: ['ml', 'evaluation'],
    emoji: '📡',
    difficulty: 'medium'
  },

  'f1-score': {
    term: 'F1 Score',
    aliases: ['F1分数', 'F1值', 'F-measure'],
    category: '数据科学基础',
    levels: {
      beginner: '综合了"精确率"和"召回率"的评分，取两者的平衡值，当你既不想漏报也不想误报时用这个指标来衡量 AI 表现。',
      intermediate: 'Precision 和 Recall 的调和平均值：F1 = 2 * (P * R) / (P + R)。比算术平均更能体现两者的平衡——只有 P 和 R 都高，F1 才高。常用于 NER、分类、信息检索任务评估。',
      advanced: 'F1 的推广版本 Fβ 通过 β 参数调整 Recall 的权重：β>1 更重视 Recall，β<1 更重视 Precision。多分类任务需对每个类别计算 F1 再做 Macro/Micro/Weighted 平均，不同平均方式反映不同的性能侧重。'
    },
    relatedTerms: ['precision', 'recall', 'accuracy', 'benchmark'],
    contexts: ['ml', 'evaluation'],
    emoji: '⚖️',
    difficulty: 'medium'
  },

  'cross-validation': {
    term: 'Cross-validation',
    aliases: ['交叉验证', 'k-fold', 'K折交叉验证'],
    category: '数据科学基础',
    levels: {
      beginner: '把数据分成几份，轮流用不同的份来验证模型的方法，能更准确地评估 AI 的真实表现，避免因为运气好选了"好"验证集而高估性能。',
      intermediate: '将数据集分成 K 份（fold），轮流将其中一份作为验证集，其余 K-1 份做训练集，重复 K 次后取平均评分。在数据量有限时，能更充分利用数据，得到更可靠的性能估计。',
      advanced: '常见变体：Stratified K-fold（保持类别比例）、Leave-One-Out（K=N，计算代价高但估计无偏）、Time Series Split（时序数据专用，避免未来数据泄露）。对于 LLM 微调，交叉验证成本极高，通常用单次 train/val split。'
    },
    relatedTerms: ['validation-data', 'overfitting', 'dataset'],
    contexts: ['ml', 'evaluation'],
    emoji: '🔁',
    difficulty: 'medium'
  },

  'feature-engineering': {
    term: 'Feature Engineering',
    aliases: ['特征工程', '特征提取', 'feature extraction'],
    category: '数据科学基础',
    levels: {
      beginner: '把原始数据处理成 AI 能更好理解的格式的工作，比如把日期转成"星期几"、把文字转成数字，让模型更容易学到规律。',
      intermediate: '从原始数据中构造、选择、变换适合机器学习模型的特征的过程。包括：特征选择（删除无用特征）、特征变换（归一化/标准化/对数变换）、特征生成（交叉特征/时间特征）。',
      advanced: '在深度学习时代，特征工程的重要性有所降低（模型自动学习特征表示），但对于表格数据和传统 ML 仍至关重要。LLM 的 Embedding 可视为高层次的自动特征工程。在 RAG 中，文本的 Chunking 策略也是一种特征工程。'
    },
    relatedTerms: ['dataset', 'training-data', 'embedding', 'machine-learning'],
    contexts: ['ml', 'data'],
    emoji: '🔨',
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
console.log(`第2批完成：新增 ${added} 条，跳过已有 ${skipped} 条`);
if (skippedIds.length) console.log('跳过ID:', skippedIds.join(', '));
console.log('当前总词条数:', Object.keys(existing).length);
