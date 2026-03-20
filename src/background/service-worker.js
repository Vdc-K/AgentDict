/**
 * AgentDict — Service Worker (Background)
 * 
 * 🧠 Lead Agent 实现
 * 
 * 消息中枢，管理扩展生命周期和跨组件通信。
 */

// ─── 安装事件 ──────────────────────────────────────────

// jsDelivr CDN（国内有节点，比 raw.githubusercontent.com 可靠）
const GITHUB_TERMS_URL = 'https://cdn.jsdelivr.net/gh/Vdc-K/AgentDict@main/src/dictionary/terms.json';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装，初始化存储（syncUrl 直接指向 GitHub）
    chrome.storage.local.set({
      enabled: true,
      level: 'beginner',
      theme: 'auto',
      learnedTerms: {},
      stats: {
        totalViewed: 0,
        totalLearned: 0,
        streakDays: 0,
        startDate: Date.now()
      },
      siteSettings: {},
      syncUrl: GITHUB_TERMS_URL,
      lastSync: null,
      remoteTerms: {}
    });
    console.log('[AgentDict] 首次安装，已初始化数据');
    // 首次安装后自动同步最新词库
    autoSync();
  } else {
    // 更新时：修正旧版空 URL 或占位符 URL
    chrome.storage.local.get(['syncUrl'], (data) => {
      if (!data.syncUrl || data.syncUrl.includes('user/AgentDict')) {
        chrome.storage.local.set({ syncUrl: GITHUB_TERMS_URL });
      }
    });
  }
});

// ─── 消息处理 ──────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_ENABLED':
      chrome.storage.local.get(['enabled', 'siteSettings'], (data) => {
        const hostname = message.hostname || '';
        const siteEnabled = data.siteSettings?.[hostname]?.enabled;
        const globalEnabled = data.enabled !== false;
        sendResponse({ enabled: siteEnabled !== undefined ? siteEnabled : globalEnabled });
      });
      return true; // 异步响应

    case 'TOGGLE_ENABLED':
      chrome.storage.local.get(['enabled'], (data) => {
        const newState = !data.enabled;
        chrome.storage.local.set({ enabled: newState });
        // 通知所有 content script
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { type: 'STATE_CHANGED', enabled: newState }).catch(() => {});
          });
        });
        sendResponse({ enabled: newState });
      });
      return true;

    case 'GET_STATS':
      chrome.storage.local.get(['stats', 'learnedTerms'], (data) => {
        const today = new Date().toDateString();
        const todayNew = Object.values(data.learnedTerms || {}).filter(t => {
          return new Date(t.firstSeen).toDateString() === today;
        }).length;
        sendResponse({
          ...data.stats,
          todayNew,
          totalTerms: Object.keys(data.learnedTerms || {}).length
        });
      });
      return true;

    case 'MARK_MASTERED':
      chrome.storage.local.get(['learnedTerms', 'stats'], (data) => {
        const terms = data.learnedTerms || {};
        const stats = data.stats || {};
        if (terms[message.termId] && terms[message.termId].status !== 'mastered') {
          terms[message.termId].status = 'mastered';
          stats.totalLearned = (stats.totalLearned || 0) + 1;
          chrome.storage.local.set({ learnedTerms: terms, stats });
        }
        sendResponse({ success: true });
      });
      return true;

    case 'SYNC_DICTIONARY':
      (async () => {
        try {
          const url = (message.url || '').trim();
          if (!url) throw new Error("请先填入词库 URL");
          
          console.log(`[AgentDict] Fetching remote dictionary from: ${url}`);
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const remoteData = await res.json();
          
          if (typeof remoteData !== 'object' || Array.isArray(remoteData)) {
            throw new Error("Invalid dictionary format, expected an object");
          }

          const timestamp = Date.now();
          const count = Object.keys(remoteData).length;
          
          await chrome.storage.local.set({ 
            remoteTerms: remoteData,
            lastSync: timestamp
          });
          
          console.log(`[AgentDict] Successfully synced ${count} terms`);
          
          // Broadcast to all content scripts to reload matcher
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, { type: 'TERMS_UPDATED' }).catch(() => {});
            });
          });
          
          sendResponse({ success: true, count, timestamp });
        } catch (err) {
          console.warn('[AgentDict] Sync skipped:', err.message);
          sendResponse({ success: false, error: err.message });
        }
      })();
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

// ─── Badge 更新 ────────────────────────────────────────

// 定期更新 badge 显示已学词汇数
function updateBadge() {
  chrome.storage.local.get(['stats', 'enabled'], (data) => {
    if (data.enabled === false) {
      chrome.action.setBadgeText({ text: 'OFF' });
      chrome.action.setBadgeBackgroundColor({ color: '#666' });
    } else {
      const count = data.stats?.totalLearned || 0;
      chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
      chrome.action.setBadgeBackgroundColor({ color: '#533483' });
    }
  });
}

chrome.storage.onChanged.addListener(() => {
  updateBadge();
});

updateBadge();

// ─── 自动同步词库 ─────────────────────────────────────

async function autoSync() {
  try {
    const { syncUrl } = await chrome.storage.local.get(['syncUrl']);
    const url = syncUrl || GITHUB_TERMS_URL;
    console.log('[AgentDict] 自动同步词库:', url);
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (typeof data !== 'object' || Array.isArray(data)) throw new Error('格式错误');
    await chrome.storage.local.set({ remoteTerms: data, lastSync: Date.now() });
    console.log('[AgentDict] 自动同步成功:', Object.keys(data).length, '条');
  } catch (e) {
    console.warn('[AgentDict] 自动同步跳过:', e.message);
  }
}

// 每次 service worker 启动时静默同步
autoSync();
