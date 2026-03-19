/**
 * AgentDict — 术语高亮器
 * 
 * 🏗️ FE-Arch Agent 实现
 * 
 * 将匹配到的术语用 <agentdict-term> 自定义元素包裹，
 * 添加虚线下划线标注（沉浸式翻译风格）。
 */

const AgentDictHighlighter = {
  TERM_TAG: 'agentdict-term',
  PROCESSED_ATTR: 'data-agentdict-processed',

  // ─── Quiet 模式状态（每次页面扫描重置） ────────────────

  // 本页已标注的唯一术语 ID 集合
  _pageTermIds: new Set(),

  // Quiet 模式配置（从 Storage 加载，默认值兜底）
  _quietConfig: {
    maxTermsPerPage: 8,
    difficultyFilter: ['medium', 'high']
  },

  /**
   * 加载 Quiet 模式配置（异步，由 scanner 初始化时调用）
   */
  async loadQuietConfig() {
    if (typeof AgentDictStorage !== 'undefined') {
      const { quietMode } = await AgentDictStorage.get(['quietMode']);
      if (quietMode) {
        this._quietConfig = Object.assign({}, this._quietConfig, quietMode);
      }
    }
  },

  /**
   * 重置页面术语计数（每次全量扫描前调用）
   */
  resetPageTerms() {
    this._pageTermIds = new Set();
  },

  /**
   * 判断某术语是否允许在 Quiet 模式下标注
   * @param {string} termId
   * @param {Object} termData - terms.json 中该术语的完整数据
   * @returns {boolean}
   */
  _isTermAllowedByQuiet(termId, termData) {
    // 1. 难度过滤：difficulty 字段缺省时视为 medium
    const difficulty = termData?.difficulty || 'medium';
    if (!this._quietConfig.difficultyFilter.includes(difficulty)) {
      return false;
    }

    // 2. 同一术语只标第一次出现（跨页面文本节点）
    if (this._pageTermIds.has(termId)) {
      return false;
    }

    // 3. 每页最多 N 个唯一术语
    if (this._pageTermIds.size >= this._quietConfig.maxTermsPerPage) {
      return false;
    }

    return true;
  },

  /**
   * 对 matches 数组按 difficulty 优先级排序并过滤
   * high > medium，low 丢弃
   * @param {Array} matches - matcher.match() 的结果
   * @param {Object} termsData - 完整词典数据（用于读取 difficulty）
   * @returns {Array} 过滤+排序后的 matches
   */
  _filterAndSortMatchesByQuiet(matches, termsData) {
    const PRIORITY = { high: 0, medium: 1, low: 2 };

    return matches
      .filter(m => {
        const termData = termsData ? termsData[m.id] : null;
        const difficulty = termData?.difficulty || 'medium';
        return this._quietConfig.difficultyFilter.includes(difficulty);
      })
      .sort((a, b) => {
        const da = termsData?.[a.id]?.difficulty || 'medium';
        const db = termsData?.[b.id]?.difficulty || 'medium';
        return (PRIORITY[da] ?? 1) - (PRIORITY[db] ?? 1);
      });
  },

  /**
   * 高亮文本节点中的术语
   * @param {Node} textNode - 需要处理的文本节点
   * @param {Array} matches - matcher.match() 的结果
   * @param {Object} [termsData] - 完整词典数据（用于 Quiet 模式过滤）
   */
  highlightTextNode(textNode, matches, termsData) {
    if (!matches || matches.length === 0) return;
    if (textNode.parentElement?.closest(this.TERM_TAG)) return; // 已高亮

    // Quiet 模式：过滤并按优先级排序（high 优先）
    const filteredMatches = this._filterAndSortMatchesByQuiet(matches, termsData);
    if (filteredMatches.length === 0) return;

    // 在 filteredMatches 中，再逐条检查"同术语只标第一次"和"每页上限"
    // 保留在 start 位置上允许标注的 match，同时记录已用术语
    const allowedMatchIds = new Set();
    const allowedMatches = [];

    // 先收集本次文本节点里通过 Quiet 检查的 match（按原文位置排序，保留语序）
    for (const match of filteredMatches) {
      if (allowedMatchIds.has(match.id)) continue; // 同节点内同一术语只标一次
      const termData = termsData ? termsData[match.id] : null;
      if (this._isTermAllowedByQuiet(match.id, termData)) {
        allowedMatchIds.add(match.id);
        this._pageTermIds.add(match.id); // 注册到页面已用集合
        allowedMatches.push(match);
      }
    }

    if (allowedMatches.length === 0) return;

    // 按 start 位置排序，以便顺序构建 fragment
    allowedMatches.sort((a, b) => a.start - b.start);

    const text = textNode.textContent;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    for (const match of allowedMatches) {
      // 添加匹配前的普通文本
      if (match.start > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.substring(lastIndex, match.start))
        );
      }

      // 创建术语标签
      const termEl = document.createElement(this.TERM_TAG);
      termEl.textContent = match.matchedText;
      termEl.dataset.termId = match.id;
      termEl.dataset.term = match.term;
      termEl.setAttribute('role', 'button');
      termEl.setAttribute('tabindex', '0');
      termEl.setAttribute('aria-label', `术语: ${match.term}`);

      fragment.appendChild(termEl);
      lastIndex = match.end;
    }

    // 添加剩余文本
    if (lastIndex < text.length) {
      fragment.appendChild(
        document.createTextNode(text.substring(lastIndex))
      );
    }

    // 替换原文本节点
    textNode.parentNode.replaceChild(fragment, textNode);
  },

  /**
   * 处理一个 DOM 元素，高亮其中的术语
   * @param {Element} element - 需要处理的元素
   * @param {TermMatcher} matcher - 术语匹配器实例
   * @param {Object} [termsData] - 完整词典数据（用于 Quiet 模式过滤）
   */
  processElement(element, matcher, termsData) {
    if (element.hasAttribute?.(this.PROCESSED_ATTR)) return;

    // 跳过不应处理的元素
    if (this._shouldSkip(element)) return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (this._shouldSkipParent(node.parentElement)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.textContent.trim().length < 2) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    // 逆序处理以避免 DOM 偏移问题
    for (let i = textNodes.length - 1; i >= 0; i--) {
      const textNode = textNodes[i];
      const matches = matcher.match(textNode.textContent);
      if (matches.length > 0) {
        this.highlightTextNode(textNode, matches, termsData);
      }
    }

    if (element.setAttribute) {
      element.setAttribute(this.PROCESSED_ATTR, 'true');
    }
  },

  /**
   * 判断元素是否应跳过
   */
  _shouldSkip(el) {
    if (!el || !el.tagName) return true;
    const skipTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'CODE', 'PRE', 'SVG', 'CANVAS', 'IFRAME'];
    return skipTags.includes(el.tagName);
  },

  /**
   * 判断父元素是否应跳过
   */
  _shouldSkipParent(el) {
    if (!el) return false;
    if (el.tagName === this.TERM_TAG.toUpperCase()) return true;
    if (this._shouldSkip(el)) return true;
    if (el.isContentEditable) return true;
    return false;
  },

  /**
   * 清除所有高亮
   */
  clearAll() {
    document.querySelectorAll(this.TERM_TAG).forEach(el => {
      const text = document.createTextNode(el.textContent);
      el.parentNode.replaceChild(text, el);
    });
    document.querySelectorAll(`[${this.PROCESSED_ATTR}]`).forEach(el => {
      el.removeAttribute(this.PROCESSED_ATTR);
    });
  }
};
