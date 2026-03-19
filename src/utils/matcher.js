/**
 * AgentDict — 术语匹配引擎
 * 
 * ⚙️ FullStack Agent 实现
 * 
 * 使用 Aho-Corasick 多模式匹配算法，一次扫描匹配所有术语。
 * O(n) 复杂度，适合实时 DOM 扫描场景。
 */

class TrieNode {
  constructor() {
    this.children = new Map();
    this.fail = null;
    this.output = [];  // [{id, term, pattern}]
  }
}

class TermMatcher {
  constructor(termsData) {
    this.termsData = termsData || {};
    this.root = new TrieNode();
    this.termCount = Object.keys(this.termsData).length;
    this._patterns = [];  // {pattern, id, term}
    
    this._buildTrie();
    this._buildFailLinks();
  }

  /**
   * 构建 Trie 树，插入所有术语及别名
   */
  _buildTrie() {
    for (const [id, data] of Object.entries(this.termsData)) {
      // 插入主术语
      this._insertPattern(data.term, id, data.term);
      
      // 插入别名
      if (data.aliases) {
        for (const alias of data.aliases) {
          this._insertPattern(alias, id, data.term);
        }
      }
    }
  }

  /**
   * 插入一个模式到 Trie 中
   */
  _insertPattern(pattern, id, term) {
    const lowerPattern = pattern.toLowerCase();
    let node = this.root;
    
    for (const ch of lowerPattern) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch);
    }
    
    node.output.push({ id, term, pattern, length: pattern.length });
    this._patterns.push({ pattern: lowerPattern, id, term });
  }

  /**
   * 构建 Aho-Corasick 失败链接 (BFS)
   */
  _buildFailLinks() {
    const queue = [];
    
    // 第一层节点的 fail → root
    for (const child of this.root.children.values()) {
      child.fail = this.root;
      queue.push(child);
    }
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      for (const [ch, child] of current.children) {
        queue.push(child);
        
        let fail = current.fail;
        while (fail && !fail.children.has(ch)) {
          fail = fail.fail;
        }
        child.fail = fail ? fail.children.get(ch) : this.root;
        
        // 合并 fail 链上的 output
        if (child.fail.output.length > 0) {
          child.output = child.output.concat(child.fail.output);
        }
      }
    }
  }

  /**
   * 判断字符是否为词边界
   * 用于避免子串误匹配 (如 "newspaper" 中的 "ws")
   */
  _isWordBoundary(text, pos) {
    if (pos < 0 || pos >= text.length) return true;
    const ch = text[pos];
    // 中文、日文、韩文字符视为自然边界
    if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(ch)) return true;
    // 空格、标点、特殊字符视为边界
    if (/[\s\.,;:!?\-—–()[\]{}<>'"\/\\`~@#$%^&*+=|]/.test(ch)) return true;
    return false;
  }

  /**
   * 检查匹配是否在词边界上
   */
  _checkBoundary(text, start, end) {
    const beforeOk = start === 0 || this._isWordBoundary(text, start - 1);
    const afterOk = end >= text.length || this._isWordBoundary(text, end);
    return beforeOk && afterOk;
  }

  /**
   * 在文本中匹配所有术语
   * @param {string} text - 待匹配文本
   * @returns {Array} - 匹配结果数组 [{id, term, matchedText, start, end}]
   */
  match(text) {
    if (!text || typeof text !== 'string') return [];
    
    const lowerText = text.toLowerCase();
    const rawMatches = [];
    let node = this.root;
    
    for (let i = 0; i < lowerText.length; i++) {
      const ch = lowerText[i];
      
      while (node && !node.children.has(ch)) {
        node = node.fail;
      }
      
      if (!node) {
        node = this.root;
        continue;
      }
      
      node = node.children.get(ch);
      
      // 收集所有匹配
      if (node.output.length > 0) {
        for (const out of node.output) {
          const start = i - out.length + 1;
          const end = i + 1;
          const matchedText = text.substring(start, end);
          
          // 词边界检查
          if (this._checkBoundary(text, start, end)) {
            rawMatches.push({
              id: out.id,
              term: out.term,
              matchedText,
              start,
              end,
              length: out.length
            });
          }
        }
      }
    }
    
    // 去重 + 最长匹配优先
    const filtered = this._filterOverlapping(rawMatches);
    
    // 按位置排序
    filtered.sort((a, b) => a.start - b.start);
    
    return filtered;
  }

  /**
   * 过滤重叠匹配，优先保留最长匹配
   */
  _filterOverlapping(matches) {
    if (matches.length === 0) return [];
    
    // 按起始位置排序，相同起始位置时长匹配优先
    matches.sort((a, b) => a.start - b.start || b.length - a.length);
    
    const result = [];
    let lastEnd = -1;
    
    for (const match of matches) {
      // 如果完全被之前的匹配覆盖，跳过
      if (match.start < lastEnd && match.end <= lastEnd) continue;
      
      // 如果同位置有更长的匹配已被选中，跳过
      if (match.start < lastEnd) continue;
      
      result.push(match);
      lastEnd = match.end;
    }
    
    return result;
  }

  /**
   * 返回词条数量
   */
  getTermCount() {
    return this.termCount;
  }
}

// 支持 Node.js (测试) 和浏览器 (扩展) 两种环境
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TermMatcher };
}
