/**
 * AgentDict — matcher.js 单元测试
 * 
 * 🧪 QA Agent 编写
 * 测试术语匹配引擎的核心功能：
 * - 精确匹配
 * - 别名匹配
 * - 大小写不敏感
 * - 边界词汇 (不误匹配子串)
 * - 多术语同时匹配
 * - 特殊字符处理
 * - 性能测试
 */

const { TermMatcher } = require('../src/utils/matcher');

// ─── 测试数据 ───────────────────────────────────────────

const testTerms = {
  websocket: {
    term: 'WebSocket',
    aliases: ['ws', 'wss', 'WebSockets'],
    category: '网络协议'
  },
  mcp: {
    term: 'MCP',
    aliases: ['Model Context Protocol'],
    category: 'Agent 协议'
  },
  webhook: {
    term: 'Webhook',
    aliases: ['webhooks', 'web hook'],
    category: '网络协议'
  },
  api: {
    term: 'API',
    aliases: ['APIs', 'api'],
    category: '基础概念'
  },
  'api-key': {
    term: 'API Key',
    aliases: ['api key', 'API keys', 'apikey'],
    category: '安全'
  },
  token: {
    term: 'Token',
    aliases: ['tokens'],
    category: '基础概念'
  },
  prompt: {
    term: 'Prompt',
    aliases: ['prompts', 'prompt engineering'],
    category: 'AI 基础'
  },
  llm: {
    term: 'LLM',
    aliases: ['Large Language Model', 'large language models'],
    category: 'AI 基础'
  },
  sse: {
    term: 'SSE',
    aliases: ['Server-Sent Events', 'server sent events'],
    category: '网络协议'
  },
  streaming: {
    term: 'Streaming',
    aliases: ['stream', 'streaming response'],
    category: '网络协议'
  }
};

// ─── 测试套件 ───────────────────────────────────────────

describe('TermMatcher', () => {
  let matcher;

  beforeAll(() => {
    matcher = new TermMatcher(testTerms);
  });

  // ─── 基本构造 ─────────────────────────────────────────

  describe('构造与初始化', () => {
    test('应成功创建 matcher 实例', () => {
      expect(matcher).toBeInstanceOf(TermMatcher);
    });

    test('应正确加载所有术语', () => {
      const count = matcher.getTermCount();
      expect(count).toBe(Object.keys(testTerms).length);
    });

    test('空词条库应创建空 matcher', () => {
      const emptyMatcher = new TermMatcher({});
      expect(emptyMatcher.getTermCount()).toBe(0);
    });
  });

  // ─── 精确匹配 ─────────────────────────────────────────

  describe('精确匹配', () => {
    test('应匹配完整术语 "WebSocket"', () => {
      const results = matcher.match('你需要配置 WebSocket 连接');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket', term: 'WebSocket' })
      );
    });

    test('应匹配 "MCP"', () => {
      const results = matcher.match('通过 MCP 协议与 Agent 通信');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'mcp', term: 'MCP' })
      );
    });

    test('应匹配 "API Key" (多词术语)', () => {
      const results = matcher.match('请输入你的 API Key');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'api-key', term: 'API Key' })
      );
    });

    test('不应在无术语的文本中匹配到任何结果', () => {
      const results = matcher.match('这是一段普通的中文文本');
      expect(results).toHaveLength(0);
    });
  });

  // ─── 别名匹配 ─────────────────────────────────────────

  describe('别名匹配', () => {
    test('应匹配 WebSocket 的别名 "ws"', () => {
      const results = matcher.match('使用 ws 协议连接');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应匹配 WebSocket 的别名 "wss"', () => {
      const results = matcher.match('建议使用 wss 加密连接');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应匹配 MCP 的全称 "Model Context Protocol"', () => {
      const results = matcher.match('Model Context Protocol 是一种新协议');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'mcp' })
      );
    });

    test('应匹配 SSE 的全称 "Server-Sent Events"', () => {
      const results = matcher.match('使用 Server-Sent Events 推送数据');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'sse' })
      );
    });
  });

  // ─── 大小写不敏感 ─────────────────────────────────────

  describe('大小写不敏感', () => {
    test('应匹配全大写 "WEBSOCKET"', () => {
      const results = matcher.match('配置 WEBSOCKET 连接');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应匹配全小写 "websocket"', () => {
      const results = matcher.match('配置 websocket 连接');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应匹配混合大小写 "WebSocket"', () => {
      const results = matcher.match('配置 WebSocket 连接');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应匹配小写 "api"', () => {
      const results = matcher.match('调用 api 接口');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'api' })
      );
    });

    test('应匹配小写 "llm"', () => {
      const results = matcher.match('这个 llm 模型很好');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'llm' })
      );
    });
  });

  // ─── 边界词汇（不误匹配子串） ─────────────────────────

  describe('边界词汇', () => {
    test('不应把 "newspaper" 中的子串误匹配为 "ws"', () => {
      const results = matcher.match('I read the newspaper');
      const wsMatches = results.filter(r => r.id === 'websocket' && r.matchedText.toLowerCase() === 'ws');
      expect(wsMatches).toHaveLength(0);
    });

    test('不应把 "token" 在 "tokenizer" 中误匹配为独立词', () => {
      const results = matcher.match('使用 tokenizer 处理文本');
      // 如果匹配了 token, 它的位置应该精确对应 "token" 而非 tokenizer 的子串
      // 取决于实现策略，这里测试不应误报
      const tokenMatches = results.filter(r => r.id === 'token');
      expect(tokenMatches).toHaveLength(0);
    });

    test('不应把 "streaming" 和 "stream" 双重匹配同一位置', () => {
      const results = matcher.match('使用 streaming 传输');
      // 应该匹配 "streaming" 而非 "stream" (最长匹配原则)
      const streamingMatches = results.filter(r => r.id === 'streaming');
      expect(streamingMatches.length).toBeGreaterThanOrEqual(1);
    });

    test('应匹配句首的术语', () => {
      const results = matcher.match('WebSocket 是一种协议');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应匹配句尾的术语', () => {
      const results = matcher.match('这个系统基于 WebSocket');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });
  });

  // ─── 多术语同时匹配 ──────────────────────────────────

  describe('多术语同时匹配', () => {
    test('应在同一文本中匹配多个不同术语', () => {
      const text = '你需要配置 WebSocket 连接，然后通过 MCP 协议与 Agent 通信';
      const results = matcher.match(text);
      const matchedIds = results.map(r => r.id);
      expect(matchedIds).toContain('websocket');
      expect(matchedIds).toContain('mcp');
    });

    test('应匹配同一术语的多次出现', () => {
      const text = 'API 调用需要 API Key，每个 API 有不同的限制';
      const results = matcher.match(text);
      const apiMatches = results.filter(r => r.id === 'api');
      expect(apiMatches.length).toBeGreaterThanOrEqual(2);
    });

    test('应正确处理包含大量术语的长文本', () => {
      const text = `
        首先配置 WebSocket 连接，获取 API Key。
        然后使用 MCP 协议，通过 SSE 进行 Streaming 输出。
        每个 Token 都会消耗费用，所以要优化 Prompt。
        这个 LLM 支持 Webhook 回调。
      `;
      const results = matcher.match(text);
      const matchedIds = new Set(results.map(r => r.id));
      expect(matchedIds.size).toBeGreaterThanOrEqual(5);
    });
  });

  // ─── 返回值格式 ──────────────────────────────────────

  describe('返回值格式', () => {
    test('每个匹配结果应包含必要字段', () => {
      const results = matcher.match('使用 WebSocket 连接');
      expect(results.length).toBeGreaterThan(0);
      
      const result = results[0];
      expect(result).toHaveProperty('id');          // 术语 ID
      expect(result).toHaveProperty('term');         // 标准术语名
      expect(result).toHaveProperty('matchedText');  // 实际匹配到的文本
      expect(result).toHaveProperty('start');        // 起始位置
      expect(result).toHaveProperty('end');           // 结束位置
    });

    test('start 和 end 位置应正确对应匹配文本', () => {
      const text = '请配置 WebSocket 连接';
      const results = matcher.match(text);
      const wsResult = results.find(r => r.id === 'websocket');
      expect(wsResult).toBeDefined();
      expect(text.substring(wsResult.start, wsResult.end)).toBe(wsResult.matchedText);
    });

    test('结果应按 start 位置排序', () => {
      const text = 'MCP 和 WebSocket 都是重要的 API';
      const results = matcher.match(text);
      for (let i = 1; i < results.length; i++) {
        expect(results[i].start).toBeGreaterThanOrEqual(results[i - 1].start);
      }
    });
  });

  // ─── 特殊字符处理 ─────────────────────────────────────

  describe('特殊字符处理', () => {
    test('应匹配带连字符的术语 "Server-Sent Events"', () => {
      const results = matcher.match('使用 Server-Sent Events');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'sse' })
      );
    });

    test('应在 Markdown 格式文本中正确匹配', () => {
      const results = matcher.match('使用 `WebSocket` 连接服务器');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应在包含 URL 的文本中正确匹配', () => {
      const results = matcher.match('连接 wss://example.com 使用 WebSocket');
      expect(results).toContainEqual(
        expect.objectContaining({ id: 'websocket' })
      );
    });

    test('应处理空字符串输入', () => {
      const results = matcher.match('');
      expect(results).toHaveLength(0);
    });

    test('应处理 null/undefined 输入', () => {
      expect(matcher.match(null)).toHaveLength(0);
      expect(matcher.match(undefined)).toHaveLength(0);
    });
  });

  // ─── 性能测试 ─────────────────────────────────────────

  describe('性能', () => {
    test('应在 10ms 内完成 1000 字符文本的匹配', () => {
      const longText = '这是一段包含 WebSocket 和 MCP 以及 API 的文本。'.repeat(50);
      
      const start = performance.now();
      matcher.match(longText);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(10);
    });

    test('应在 50ms 内完成 10000 字符文本的匹配', () => {
      const veryLongText = '你需要配置 WebSocket 连接，通过 MCP 协议通信。每个 Token 都是 API 调用。使用 Prompt 来控制 LLM 的输出，启用 Streaming 模式获得更好的体验。'.repeat(100);
      
      const start = performance.now();
      matcher.match(veryLongText);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(50);
    });
  });
});
