#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const termsPath = path.join(__dirname, '..', 'src', 'dictionary', 'terms.json');
const terms = JSON.parse(fs.readFileSync(termsPath, 'utf-8'));

const newTerms = {
  "json-format": {
    "term": "JSON",
    "aliases": ["json 格式", ".json", "JSON 文件"],
    "category": "通用 IT",
    "levels": {
      "beginner": "一种\"数据格式\"，用花括号和方括号组织信息。你看到的 API 返回结果、配置文件大多是 JSON。长这样：{\"name\": \"张三\", \"age\": 25}。",
      "intermediate": "JavaScript Object Notation，轻量级数据交换格式。支持字符串、数字、布尔、数组、对象、null 六种类型。人类可读，机器易解析，已成为 Web API 的事实标准。",
      "advanced": "JSON 由 Douglas Crockford 提出，是 JavaScript 对象字面量的子集。不支持注释、日期类型、undefined。JSON Schema 可以校验结构。替代品：YAML（更易读）、MessagePack/CBOR（二进制，更快）、Protocol Buffers（强类型）。"
    },
    "relatedTerms": ["api", "yaml-format", "csv-format"],
    "contexts": ["API 交互", "配置文件", "数据存储"],
    "emoji": "📋",
    "difficulty": "low"
  },
  "yaml-format": {
    "term": "YAML",
    "aliases": [".yml", ".yaml", "yaml 配置"],
    "category": "通用 IT",
    "levels": {
      "beginner": "另一种\"配置文件格式\"，用缩进代替花括号，比 JSON 更好读。Docker、GitHub Actions、K8s 的配置文件都用 YAML。缩进必须用空格不能用 Tab，否则会报错。",
      "intermediate": "YAML Ain't Markup Language，强调人类可读性。支持锚点引用（&/\\*）、多行字符串（|/>）、注释（#）。常见于 CI/CD 配置、容器编排、应用配置。",
      "advanced": "YAML 是 JSON 的超集（合法 JSON 就是合法 YAML）。安全风险：默认解析器可能执行任意代码（yaml.safe_load 替代 yaml.load）。YAML 1.2 规范修复了布尔值歧义（\"no\" 不再被解析为 false）。"
    },
    "relatedTerms": ["json-format", "docker", "ci-cd"],
    "contexts": ["Docker Compose", "GitHub Actions", "K8s 配置"],
    "emoji": "📝",
    "difficulty": "low"
  },
  "csv-format": {
    "term": "CSV",
    "aliases": [".csv", "逗号分隔", "表格文件"],
    "category": "通用 IT",
    "levels": {
      "beginner": "最简单的\"表格文件\"——每行一条数据，字段之间用逗号隔开。Excel 可以打开，任何编程语言都能读。数据导出、批量处理最常用的格式。",
      "intermediate": "Comma-Separated Values，纯文本表格格式。第一行通常是表头。含逗号的字段用引号包裹。Excel 导出 CSV 时注意编码（UTF-8 vs GBK）。TSV 用 Tab 分隔。",
      "advanced": "CSV 没有官方标准（RFC 4180 是非正式规范），不同工具的引号转义、换行处理不一致。大数据场景推荐 Parquet/Arrow（列式存储，压缩率高，类型安全）。pandas 的 read_csv 是 Python 中最常用的数据加载函数。"
    },
    "relatedTerms": ["json-format", "database"],
    "contexts": ["数据导出", "Excel 处理", "数据分析"],
    "emoji": "📊",
    "difficulty": "low"
  },
  "cache-concept": {
    "term": "缓存（Cache）",
    "aliases": ["Cache", "缓存", "CDN 缓存", "浏览器缓存"],
    "category": "通用 IT",
    "levels": {
      "beginner": "把经常用的东西存在离你更近的地方，下次用就更快。就像把常看的书放在桌上而不是书架上。\"清除缓存\"就是扔掉这些临时存的旧东西。",
      "intermediate": "缓存存在于多个层级：CPU 缓存（L1/L2/L3）、内存缓存（Redis/Memcached）、CDN 缓存、浏览器缓存。Cache-Control 头控制 HTTP 缓存策略。缓存失效是计算机科学两大难题之一。",
      "advanced": "缓存策略：LRU（最近最少使用）、LFU（最不经常使用）、TTL（时间过期）。分布式缓存面临一致性问题（Cache Aside/Write Through/Write Behind）。缓存穿透/雪崩/击穿是高并发场景的常见问题。"
    },
    "relatedTerms": ["cdn", "redis", "latency"],
    "contexts": ["性能优化", "Web 开发", "系统设计"],
    "emoji": "⚡",
    "difficulty": "low"
  },
  "latency": {
    "term": "延迟（Latency）",
    "aliases": ["Latency", "延迟", "响应时间", "ping 值"],
    "category": "通用 IT",
    "levels": {
      "beginner": "从你发出请求到收到回复的等待时间。打游戏时说\"延迟高\"就是这个意思。延迟越低体验越好，AI 对话的\"思考时间\"也是一种延迟。",
      "intermediate": "网络延迟用 ping 测量（毫秒）。影响因素：物理距离、网络拥堵、服务器处理时间。P50/P95/P99 延迟分别代表 50%/95%/99% 请求的响应时间上界。",
      "advanced": "尾延迟（tail latency）比平均延迟更重要——P99 延迟高意味着 1% 的用户体验极差。降低延迟的手段：CDN 就近服务、连接池复用、异步处理、边缘计算。光速限制了理论最低延迟。"
    },
    "relatedTerms": ["cache-concept", "cdn", "api"],
    "contexts": ["性能优化", "游戏", "AI 推理"],
    "emoji": "⏱️",
    "difficulty": "low"
  },
  "proxy-vpn": {
    "term": "代理 / VPN",
    "aliases": ["Proxy", "VPN", "翻墙", "科学上网", "梯子"],
    "category": "通用 IT",
    "levels": {
      "beginner": "让你的网络请求\"绕道\"通过另一台服务器，可以访问被限制的网站或隐藏你的真实位置。VPN 加密整个网络连接，代理只转发特定流量。",
      "intermediate": "代理类型：HTTP 代理、SOCKS5 代理、透明代理、反向代理。VPN 在传输层加密（WireGuard/OpenVPN/IPSec），代理在应用层工作。企业 VPN 用于远程办公访问内网。",
      "advanced": "常见协议：Shadowsocks（AEAD 加密）、VMess/VLESS（V2Ray/Xray）、Trojan（TLS 伪装）、WireGuard（内核级高性能）。Cloudflare WARP 是免费的 WireGuard VPN。代理链（proxy chain）可多跳增加匿名性。"
    },
    "relatedTerms": ["firewall", "ssl-tls", "cdn"],
    "contexts": ["网络访问", "隐私保护", "远程办公"],
    "emoji": "🌐",
    "difficulty": "low"
  },
  "firewall": {
    "term": "防火墙",
    "aliases": ["Firewall", "WAF", "网络防火墙"],
    "category": "安全与对齐",
    "levels": {
      "beginner": "网络的\"门卫\"——检查每个进出的数据包，决定放行还是拦截。你电脑上的防火墙阻止恶意程序联网，公司防火墙限制员工访问某些网站。",
      "intermediate": "分为网络防火墙（iptables/nftables，过滤 IP/端口）和应用防火墙（WAF，过滤 HTTP 请求内容如 SQL 注入/XSS）。云服务通常提供安全组（Security Group）作为虚拟防火墙。",
      "advanced": "下一代防火墙（NGFW）集成深度包检测（DPI）、入侵防御（IPS）、应用识别。零信任架构（Zero Trust）假设防火墙内外都不可信，每次访问都需验证。GFW 是国家级防火墙的典型实现。"
    },
    "relatedTerms": ["proxy-vpn", "ssl-tls", "api"],
    "contexts": ["网络安全", "服务器管理", "企业网络"],
    "emoji": "🛡️",
    "difficulty": "medium"
  },
  "ssl-tls": {
    "term": "SSL / TLS / HTTPS",
    "aliases": ["SSL 证书", "HTTPS", "小锁图标", "加密连接"],
    "category": "通用 IT",
    "levels": {
      "beginner": "浏览器地址栏的小锁图标就代表 HTTPS——你和网站之间的通信是加密的，别人偷看不到。没有小锁的 HTTP 网站，输入的密码可能被截获。",
      "intermediate": "TLS（Transport Layer Security）是 SSL 的升级版。HTTPS = HTTP + TLS。工作流程：客户端验证服务器证书→协商加密算法→建立加密通道。Let's Encrypt 提供免费证书。",
      "advanced": "TLS 1.3 简化了握手（1-RTT，支持 0-RTT 恢复）。证书链：根 CA→中间 CA→服务器证书。HSTS 强制 HTTPS。证书透明度（CT）防止 CA 私自签发。mTLS 双向认证用于服务间通信。"
    },
    "relatedTerms": ["api", "proxy-vpn", "firewall"],
    "contexts": ["网站安全", "API 通信", "隐私保护"],
    "emoji": "🔒",
    "difficulty": "low"
  },
  "two-factor-auth": {
    "term": "双因素认证（2FA）",
    "aliases": ["2FA", "MFA", "两步验证", "验证码", "Authenticator"],
    "category": "安全与对齐",
    "levels": {
      "beginner": "除了密码之外，还要第二种方式证明\"是你本人\"——比如手机验证码、指纹、或 Authenticator App 上的动态码。即使密码泄露，没有第二个因素也登不进去。",
      "intermediate": "三种因素：你知道的（密码）、你拥有的（手机/硬件密钥）、你本人（指纹/面部）。TOTP（基于时间的一次性密码）最常用，Google Authenticator/Authy 生成 30 秒刷新的 6 位码。",
      "advanced": "FIDO2/WebAuthn 是下一代认证标准，用公钥加密替代共享密钥，抗钓鱼。Passkey（通行密钥）基于 FIDO2，用设备生物识别替代密码。硬件密钥（YubiKey）提供最高安全等级。"
    },
    "relatedTerms": ["ssl-tls", "oauth"],
    "contexts": ["账号安全", "登录保护"],
    "emoji": "🔐",
    "difficulty": "low"
  },
  "http-status-code": {
    "term": "HTTP 状态码",
    "aliases": ["200", "404", "500", "403", "301", "状态码"],
    "category": "网络与协议",
    "levels": {
      "beginner": "服务器回复你的\"暗号\"：200 表示\"成功\"，404 表示\"找不到页面\"，500 表示\"服务器挂了\"，403 表示\"没权限\"。看到这些数字就知道请求结果。",
      "intermediate": "2xx 成功（200 OK、201 Created、204 No Content），3xx 重定向（301 永久、302 临时、304 未修改），4xx 客户端错误（400 Bad Request、401 未认证、403 禁止、404 Not Found、429 限流），5xx 服务器错误（500、502 Bad Gateway、503 Service Unavailable）。",
      "advanced": "API 设计中状态码的选择影响客户端处理逻辑。RESTful 最佳实践：创建返回 201+Location 头、删除返回 204、幂等操作返回 200。429 配合 Retry-After 头实现限流。418 I'm a teapot 是愚人节彩蛋。"
    },
    "relatedTerms": ["api", "rest-api", "ssl-tls"],
    "contexts": ["Web 开发", "API 调试", "错误排查"],
    "emoji": "🔢",
    "difficulty": "low"
  },
  "api-endpoint": {
    "term": "API 端点（Endpoint）",
    "aliases": ["Endpoint", "端点", "接口地址"],
    "category": "通用 IT",
    "levels": {
      "beginner": "API 的\"门牌号\"——一个具体的网址，你向它发请求就能获取数据或执行操作。比如 api.example.com/users 就是获取用户列表的端点。",
      "intermediate": "端点由 HTTP 方法 + URL 路径组成：GET /users（查询）、POST /users（创建）、PUT /users/1（更新）、DELETE /users/1（删除）。RESTful API 用名词表示资源，动词用 HTTP 方法。",
      "advanced": "端点设计原则：资源导向、版本化（/v1/users）、分页（?page=1&limit=20）、过滤（?status=active）。GraphQL 用单一端点替代多个 REST 端点。API Gateway 统一管理端点的认证、限流、监控。"
    },
    "relatedTerms": ["api", "rest-api", "http-status-code"],
    "contexts": ["API 开发", "前后端对接", "第三方集成"],
    "emoji": "🔌",
    "difficulty": "low"
  },
  "rest-api": {
    "term": "REST API",
    "aliases": ["RESTful", "REST 接口", "RESTful API"],
    "category": "通用 IT",
    "levels": {
      "beginner": "目前最流行的 API 设计风格——用网址表示\"资源\"，用 GET/POST/PUT/DELETE 表示\"操作\"。就像图书馆：GET /books 是查书，POST /books 是上新书，DELETE /books/1 是下架。",
      "intermediate": "REST（Representational State Transfer）六大约束：客户端-服务器分离、无状态、可缓存、统一接口、分层系统、按需代码。响应格式通常是 JSON。认证常用 Bearer Token 或 API Key。",
      "advanced": "Richardson 成熟度模型：Level 0（单一端点，如 SOAP）→ Level 1（多资源）→ Level 2（HTTP 动词）→ Level 3（HATEOAS，超媒体驱动）。REST 的局限性催生了 GraphQL（灵活查询）和 gRPC（高性能）。"
    },
    "relatedTerms": ["api", "api-endpoint", "graphql", "http-status-code"],
    "contexts": ["Web 开发", "微服务", "移动端开发"],
    "emoji": "🌐",
    "difficulty": "medium"
  },
  "cookie-session": {
    "term": "Cookie / Session",
    "aliases": ["Cookie", "Session", "会话", "浏览器 Cookie"],
    "category": "通用 IT",
    "levels": {
      "beginner": "Cookie 是网站存在你浏览器里的小纸条，记住你的登录状态、偏好设置。Session 是服务器端记住你是谁的方式。\"清除 Cookie\"后需要重新登录就是因为这个。",
      "intermediate": "Cookie 通过 Set-Cookie 响应头写入，每次请求自动带上。属性：HttpOnly（JS 不可读）、Secure（仅 HTTPS）、SameSite（防 CSRF）、Max-Age（过期时间）。Session ID 通常存在 Cookie 中。",
      "advanced": "无状态架构中 Session 被 JWT 替代（服务器不存状态）。Cookie 大小限制 4KB。第三方 Cookie 正在被浏览器淘汰（隐私保护）。替代方案：localStorage、sessionStorage、IndexedDB。"
    },
    "relatedTerms": ["jwt", "two-factor-auth", "ssl-tls"],
    "contexts": ["用户登录", "隐私设置", "Web 开发"],
    "emoji": "🍪",
    "difficulty": "low"
  },
  "git-branch-merge": {
    "term": "Git 分支与合并",
    "aliases": ["Branch", "Merge", "分支", "合并", "Commit", "提交"],
    "category": "开源与社区",
    "levels": {
      "beginner": "分支就是代码的\"平行世界\"——你在自己的分支上改代码，不影响主线。改好了再\"合并\"回去。Commit 是\"存档点\"，每次有意义的修改都 commit 一次。",
      "intermediate": "git branch 创建分支，git checkout/switch 切换，git merge 合并。常见工作流：main 主分支 + feature 功能分支 + PR 审查后合并。冲突（conflict）发生在两个分支改了同一处代码。",
      "advanced": "Git 分支本质是指向 commit 的指针，创建分支几乎零成本。合并策略：fast-forward、recursive（三路合并）、rebase（变基，线性历史）。Trunk-based Development 主张短命分支，尽快合并。"
    },
    "relatedTerms": ["git", "pull-request", "fork", "open-source"],
    "contexts": ["代码协作", "版本管理", "开源贡献"],
    "emoji": "🌿",
    "difficulty": "medium"
  },
  "log-debugging": {
    "term": "日志（Log）",
    "aliases": ["Log", "日志", "console.log", "日志文件"],
    "category": "通用 IT",
    "levels": {
      "beginner": "程序运行时自动记录的\"日记\"。出了问题就看日志找原因，就像监控录像回放一样。console.log 是前端最常用的打日志方式。",
      "intermediate": "日志级别：DEBUG→INFO→WARN→ERROR→FATAL，生产环境通常只记录 WARN 以上。结构化日志（JSON 格式）方便机器解析。ELK（Elasticsearch+Logstash+Kibana）是主流日志分析栈。",
      "advanced": "分布式系统中用 Trace ID 串联跨服务的日志（分布式追踪）。日志采样降低存储成本。OpenTelemetry 统一了日志、指标、追踪三大可观测性信号。日志不要记敏感信息（密码、Token）。"
    },
    "relatedTerms": ["debug", "cli", "api"],
    "contexts": ["错误排查", "性能监控", "运维"],
    "emoji": "📜",
    "difficulty": "low"
  },
  "stack-trace": {
    "term": "堆栈跟踪（Stack Trace）",
    "aliases": ["Stack Trace", "报错信息", "Traceback", "错误栈"],
    "category": "通用 IT",
    "levels": {
      "beginner": "程序崩溃时吐出来的那一大串错误信息。从下往上看：最下面是出错的位置，往上是\"谁调用了它\"。把这段信息发给开发者或贴到 Google 搜，通常能找到解决办法。",
      "intermediate": "Stack Trace 展示了函数调用链（调用栈）。关键信息：错误类型（TypeError/ReferenceError）、错误消息、出错文件和行号。Python 叫 Traceback，Java 叫 Exception Stack Trace。",
      "advanced": "Source Map 将压缩后的代码映射回源码，让生产环境的 Stack Trace 可读。异步代码的 Stack Trace 可能丢失上下文（async stack traces 解决此问题）。Sentry 等工具自动收集和聚合 Stack Trace。"
    },
    "relatedTerms": ["log-debugging", "debug", "bug"],
    "contexts": ["错误排查", "代码调试", "Bug 报告"],
    "emoji": "🔴",
    "difficulty": "medium"
  },
  "boilerplate": {
    "term": "样板代码（Boilerplate）",
    "aliases": ["Boilerplate", "模板代码", "脚手架", "Scaffold"],
    "category": "开发工具",
    "levels": {
      "beginner": "每次开新项目都要写的那些重复代码/配置。脚手架工具（如 create-react-app、Vite）帮你一键生成这些样板，省得从零开始。",
      "intermediate": "Boilerplate 包括项目结构、构建配置、代码规范、测试框架等。常见脚手架：create-react-app、create-next-app、Vite、Vue CLI。Cookiecutter/Yeoman 是通用脚手架生成器。",
      "advanced": "过多 Boilerplate 是框架设计的 code smell（如早期 Redux）。Convention over Configuration（约定优于配置）是减少 Boilerplate 的设计哲学。元编程和代码生成（如 Prisma schema → client）也是消除 Boilerplate 的方式。"
    },
    "relatedTerms": ["framework", "npm", "git"],
    "contexts": ["项目初始化", "开发效率", "框架选择"],
    "emoji": "🏗️",
    "difficulty": "low"
  },
  "rollback-deploy": {
    "term": "回滚（Rollback）",
    "aliases": ["Rollback", "回滚", "版本回退"],
    "category": "基础设施与部署",
    "levels": {
      "beginner": "发布了新版本发现有问题？回滚就是\"退回到上一个好的版本\"。就像 Word 的撤销（Ctrl+Z），但是是给整个系统用的。",
      "intermediate": "回滚策略：蓝绿部署（切换流量到旧版）、金丝雀发布（先给 1% 用户测试）、特性开关（关闭有问题的功能）。数据库回滚用 migration down。容器化让回滚更简单（切换镜像版本）。",
      "advanced": "并非所有变更都可以回滚——数据库 schema 变更（删列、改类型）需要前向修复。Backward-compatible changes（向后兼容变更）是可安全回滚的前提。GitOps 通过 git revert 实现声明式回滚。"
    },
    "relatedTerms": ["ci-cd", "docker", "git-branch-merge"],
    "contexts": ["发布管理", "故障恢复", "运维"],
    "emoji": "⏪",
    "difficulty": "medium"
  },
  "base64-encoding": {
    "term": "Base64",
    "aliases": ["Base64 编码", "base64"],
    "category": "通用 IT",
    "levels": {
      "beginner": "把二进制数据（比如图片）变成纯文本字母的编码方式。你见过 HTML 里那些以 data:image 开头的超长字符串吗？那就是图片被 Base64 编码后的样子。",
      "intermediate": "Base64 用 64 个字符（A-Z、a-z、0-9、+、/）表示任意二进制数据。编码后体积增大约 33%。常见场景：邮件附件（MIME）、JWT、Data URI、API 传输二进制。",
      "advanced": "Base64 不是加密（可逆且无密钥），不要用来保护敏感数据。变体：URL-safe Base64（+/→-_）、Base64url（JWT 使用）。流式编码按 3 字节输入→4 字符输出处理，末尾用 = 填充。"
    },
    "relatedTerms": ["jwt", "api", "json-format"],
    "contexts": ["数据传输", "图片内嵌", "API 开发"],
    "emoji": "🔣",
    "difficulty": "medium"
  },
  "rate-limiting": {
    "term": "限流（Rate Limiting）",
    "aliases": ["Rate Limit", "限流", "429", "API 配额"],
    "category": "通用 IT",
    "levels": {
      "beginner": "API 对你说\"别刷太快了\"。比如 ChatGPT API 每分钟只能调 60 次，超了就返回 429 错误，让你等一会再试。就像排队限流一样。",
      "intermediate": "常见策略：固定窗口（每分钟 N 次）、滑动窗口（更平滑）、令牌桶（允许突发）、漏桶（恒定速率）。响应头 X-RateLimit-Remaining 告诉你还剩多少次。",
      "advanced": "分布式限流用 Redis（INCR+EXPIRE 或 Lua 脚本）实现。API Gateway 通常内置限流。按用户/IP/API Key 维度限流。DDoS 防护是限流的极端场景。自适应限流根据系统负载动态调整阈值。"
    },
    "relatedTerms": ["api", "http-status-code", "cache-concept"],
    "contexts": ["API 使用", "系统保护", "成本控制"],
    "emoji": "🚦",
    "difficulty": "medium"
  },
  "markdown-format": {
    "term": "Markdown",
    "aliases": ["md", ".md", "Markdown 语法"],
    "category": "通用 IT",
    "levels": {
      "beginner": "一种超简单的\"排版语法\"——用 # 表示标题，用 ** 加粗，用 - 列清单。GitHub、Notion、飞书都支持。你现在看到的 README.md 就是 Markdown 写的。",
      "intermediate": "常用语法：# 标题、**加粗**、*斜体*、[链接](url)、![图片](url)、> 引用、```代码块```、- 列表、| 表格。GitHub Flavored Markdown（GFM）增加了任务列表、表格、删除线。",
      "advanced": "Markdown 由 John Gruber 于 2004 年创建，目标是\"易读易写的纯文本格式\"。CommonMark 是标准化规范。MDX 允许在 Markdown 中嵌入 React 组件。Pandoc 可以将 Markdown 转换为几乎任何格式。"
    },
    "relatedTerms": ["git", "open-source", "json-format"],
    "contexts": ["写文档", "GitHub", "笔记"],
    "emoji": "✍️",
    "difficulty": "low"
  }
};

let added = 0;
for (const [id, term] of Object.entries(newTerms)) {
  if (terms[id]) {
    console.log('跳过已存在:', id);
    continue;
  }
  terms[id] = term;
  added++;
}

fs.writeFileSync(termsPath, JSON.stringify(terms, null, 2));
console.log('新增', added, '条常用词汇');
console.log('总计:', Object.keys(terms).length);
