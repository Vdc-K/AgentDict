/**
 * AgentDict — DOM 扫描器
 * 
 * 🏗️ FE-Arch Agent 实现
 * 
 * 使用 MutationObserver 监听 Agent 页面的 DOM 变化，
 * 在 Agent 实时 streaming 输出时即时扫描新增节点。
 */

const AgentDictScanner = {
  _observer: null,
  _matcher: null,
  _enabled: true,
  _scanQueue: [],
  _scanTimer: null,
  _THROTTLE_MS: 100,  // 节流间隔

  /**
   * 初始化扫描器
   */
  async init() {
    // 加载词条数据
    const termsData = await this._loadTerms();
    
    if (!termsData || Object.keys(termsData).length === 0) {
      console.log('[AgentDict] 无可用词条数据');
      return;
    }

    // 初始化匹配器
    this._matcher = new TermMatcher(termsData);
    this._termsData = termsData;
    console.log(`[AgentDict] 已加载 ${this._matcher.getTermCount()} 个术语`);

    // 加载 Quiet 模式配置
    await AgentDictHighlighter.loadQuietConfig();

    // 初始化浮窗
    AgentDictTooltip.init(termsData);

    // 初始化侧边学习面板 (沉浸式翻译浮动球)
    AgentDictPanel.init(termsData);

    // 初始扫描当前页面（重置页面术语计数）
    AgentDictHighlighter.resetPageTerms();
    this._scanElement(document.body);

    // 监听 DOM 变化
    if (!this._observer) {
      this._startObserving();
    }
    
    // 监听后台消息 (如词库更新)
    this._listenMessages();

    console.log('[AgentDict] 扫描器已启动 / 更新');
  },

  /**
   * 监听 Runtime 消息
   */
  _listenMessages() {
    if (this._messageListenerBound) return;
    this._messageListenerBound = true;
    
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'TERMS_UPDATED') {
        console.log('[AgentDict] 收到词库更新包，正在热重载匹配引擎...');
        // 清理旧高亮 + 重置页面术语计数
        AgentDictHighlighter.clearAll();
        AgentDictHighlighter.resetPageTerms();
        // 重新初始化
        this.init();
      }
    });
  },

  /**
   * 加载词条数据 (优先合并远端)
   */
  async _loadTerms() {
    try {
      const url = chrome.runtime.getURL('src/dictionary/terms.json');
      const response = await fetch(url);
      const localTerms = await response.json();
      
      // Get merged terms via Storage wrapper
      return await AgentDictStorage.getMergedTerms(localTerms);
    } catch (e) {
      console.error('[AgentDict] 加载词条失败:', e);
      return {};
    }
  },

  /**
   * 开始监听 DOM 变化
   */
  _startObserving() {
    this._observer = new MutationObserver((mutations) => {
      if (!this._enabled) return;
      
      for (const mutation of mutations) {
        // 处理新增节点
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this._enqueueScan(node);
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 2) {
            this._enqueueScan(node.parentElement);
          }
        }

        // 处理文本内容变化
        if (mutation.type === 'characterData' && mutation.target.parentElement) {
          this._enqueueScan(mutation.target.parentElement);
        }
      }
    });

    this._observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  },

  /**
   * 节流扫描队列
   */
  _enqueueScan(element) {
    if (!element || element.closest?.('agentdict-term') || element.closest?.('agentdict-tooltip-host')) {
      return;
    }

    this._scanQueue.push(element);
    
    if (!this._scanTimer) {
      this._scanTimer = setTimeout(() => {
        this._flushScanQueue();
        this._scanTimer = null;
      }, this._THROTTLE_MS);
    }
  },

  /**
   * 批量处理扫描队列
   */
  _flushScanQueue() {
    const elements = [...new Set(this._scanQueue)];
    this._scanQueue = [];

    for (const el of elements) {
      if (el && el.isConnected) {
        this._scanElement(el);
      }
    }
  },

  /**
   * 扫描元素
   */
  _scanElement(element) {
    if (!element || !this._matcher) return;

    // 扫描前获取文本用于术语发现
    const textContent = element.textContent || '';
    const matches = this._matcher.match(textContent);

    // 通知侧边面板发现的术语
    if (matches.length > 0 && typeof AgentDictPanel !== 'undefined') {
      const uniqueIds = new Set(matches.map(m => m.id));
      uniqueIds.forEach(id => AgentDictPanel.addPageTerm(id));
    }

    // 传入 termsData 以支持 Quiet 模式过滤
    AgentDictHighlighter.processElement(element, this._matcher, this._termsData);

    // 埋点：页面扫描完成
    if (typeof AgentDictStorage !== 'undefined') {
      AgentDictStorage.trackEvent('page_scan', { matchedCount: matches.length, hostname: location.hostname });
    }
  },

  /**
   * 暂停/恢复扫描
   */
  toggle(enabled) {
    this._enabled = enabled;
    if (!enabled) {
      AgentDictHighlighter.clearAll();
    } else {
      this._scanElement(document.body);
    }
  },

  /**
   * 销毁扫描器
   */
  destroy() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    clearTimeout(this._scanTimer);
    AgentDictHighlighter.clearAll();
  }
};

// ─── 启动 ─────────────────────────────────────────────

// 等 DOM 就绪后启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AgentDictScanner.init());
} else {
  AgentDictScanner.init();
}
