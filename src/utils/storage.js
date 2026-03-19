/**
 * AgentDict — chrome.storage 封装
 * 
 * ⚙️ FullStack Agent 实现
 * 
 * 封装 chrome.storage.local，管理学习进度和用户设置。
 */

const AgentDictStorage = {
  // ─── 默认值 ────────────────────────────────────────

  DEFAULTS: {
    enabled: true,
    level: 'beginner',     // beginner | intermediate | advanced
    theme: 'auto',         // auto | dark | light
    learnedTerms: {},      // { termId: { status, firstSeen, lastSeen, viewCount } }
    stats: {
      totalViewed: 0,
      totalLearned: 0,
      streakDays: 0,
      startDate: null
    },
    siteSettings: {},      // { hostname: { enabled: boolean } }
    syncUrl: '',
    lastSync: null,
    remoteTerms: {},
    quietMode: {
      maxTermsPerPage: 8,        // 每页最多标注的唯一术语数
      difficultyFilter: ['medium', 'high']  // 只标注这些难度的术语
    }
  },

  // ─── Quiet 模式配置 ────────────────────────────────────

  FADED_THRESHOLD: 3,  // viewCount >= 此值时自动进入 faded 状态

  // ─── 读写 ──────────────────────────────────────────

  async get(keys) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
          chrome.storage.local.get(keys, resolve);
        } catch (e) { resolve({}); }
      } else {
        // Fallback for non-extension env
        const result = {};
        const store = JSON.parse(localStorage.getItem('agentdict') || '{}');
        if (Array.isArray(keys)) {
          keys.forEach(k => { result[k] = store[k] ?? this.DEFAULTS[k]; });
        } else if (typeof keys === 'string') {
          result[keys] = store[keys] ?? this.DEFAULTS[keys];
        } else {
          Object.assign(result, this.DEFAULTS, store);
        }
        resolve(result);
      }
    });
  },

  /**
   * 获取合并后的最完整词库
   * @param {Object} fallbackTerms - 扩展内置存储的 terms.json
   */
  async getMergedTerms(fallbackTerms = {}) {
    const { remoteTerms } = await this.get(['remoteTerms']);
    return { ...fallbackTerms, ...(remoteTerms || {}) };
  },

  async set(data) {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
          chrome.storage.local.set(data, resolve);
        } catch (e) { resolve(); }
      } else {
        const store = JSON.parse(localStorage.getItem('agentdict') || '{}');
        Object.assign(store, data);
        localStorage.setItem('agentdict', JSON.stringify(store));
        resolve();
      }
    });
  },

  // ─── 学习进度 ──────────────────────────────────────

  async markTermViewed(termId) {
    const { learnedTerms, stats } = await this.get(['learnedTerms', 'stats']);
    const now = Date.now();

    if (!learnedTerms[termId]) {
      // 首次出现：new
      learnedTerms[termId] = {
        status: 'new',       // new | faded | mastered
        firstSeen: now,
        lastSeen: now,
        viewCount: 1
      };
      stats.totalViewed++;
    } else {
      const entry = learnedTerms[termId];
      entry.lastSeen = now;
      entry.viewCount++;

      // 自动消退：viewCount >= 阈值 且 尚未掌握 → faded
      if (entry.status !== 'mastered' && entry.viewCount >= this.FADED_THRESHOLD) {
        entry.status = 'faded';
      } else if (entry.status === 'new') {
        // new 在未达到阈值时保持 new（不再有 learning 中间状态）
        // 仅当首次 viewCount 就达到阈值时直接变 faded，否则保持 new
      }
    }

    if (!stats.startDate) stats.startDate = now;

    await this.set({ learnedTerms, stats });
    return learnedTerms[termId];
  },

  async markTermMastered(termId) {
    const { learnedTerms, stats } = await this.get(['learnedTerms', 'stats']);

    if (!learnedTerms[termId]) {
      // upsert：首次直接标记为 mastered（竞态场景：markTermViewed 尚未完成）
      learnedTerms[termId] = { status: 'mastered', firstSeen: Date.now(), lastSeen: Date.now(), viewCount: 1 };
      stats.totalLearned++;
    } else {
      if (learnedTerms[termId].status !== 'mastered') {
        stats.totalLearned++;
      }
      learnedTerms[termId].status = 'mastered';
      learnedTerms[termId].lastSeen = Date.now();
    }

    await this.set({ learnedTerms, stats });
    this.trackEvent('mark_mastered', { termId });
    return learnedTerms[termId];
  },

  async getTermStatus(termId) {
    const { learnedTerms } = await this.get(['learnedTerms']);
    return learnedTerms[termId]?.status || null;
  },

  async getStats() {
    const { stats } = await this.get(['stats']);
    return stats;
  },

  // ─── 站点设置 ──────────────────────────────────────

  async isSiteEnabled(hostname) {
    const { enabled, siteSettings } = await this.get(['enabled', 'siteSettings']);
    if (!enabled) return false;
    if (siteSettings[hostname] !== undefined) return siteSettings[hostname].enabled;
    return true; // 默认启用
  },

  async toggleSite(hostname, enabled) {
    const { siteSettings } = await this.get(['siteSettings']);
    siteSettings[hostname] = { enabled };
    await this.set({ siteSettings });
  },

  // ─── 埋点 Analytics ────────────────────────────────

  /**
   * 追踪事件，追加到 analytics 数组
   * 事件类型：page_scan | tooltip_open | mark_mastered
   * @param {string} eventName
   * @param {Object} data
   */
  async trackEvent(eventName, data = {}) {
    const record = {
      event: eventName,
      data,
      timestamp: Date.now(),
      url: (typeof location !== 'undefined') ? location.href : ''
    };
    return new Promise((resolve) => {
      const MAX_EVENTS = 1000;
      if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
          chrome.storage.local.get(['analytics'], ({ analytics = [] }) => {
            analytics.push(record);
            if (analytics.length > MAX_EVENTS) analytics = analytics.slice(-MAX_EVENTS);
            chrome.storage.local.set({ analytics }, resolve);
          });
        } catch (e) {
          // Extension context invalidated (e.g. after reload) — silently ignore
          resolve();
        }
      } else {
        const store = JSON.parse(localStorage.getItem('agentdict') || '{}');
        let analytics = store.analytics || [];
        analytics.push(record);
        if (analytics.length > MAX_EVENTS) analytics = analytics.slice(-MAX_EVENTS);
        store.analytics = analytics;
        localStorage.setItem('agentdict', JSON.stringify(store));
        resolve();
      }
    });
  },

  /**
   * 返回所有追踪数据
   * @returns {Promise<Array>}
   */
  async getAnalytics() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['analytics'], ({ analytics = [] }) => resolve(analytics));
      } else {
        const store = JSON.parse(localStorage.getItem('agentdict') || '{}');
        resolve(store.analytics || []);
      }
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AgentDictStorage };
}
