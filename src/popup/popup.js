/**
 * AgentDict — Popup 面板逻辑
 * 
 * 📚 LXD + 🧠 Lead Agent 联合实现
 */

// ─── 初始化 ──────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('version-display').textContent = 'v' + chrome.runtime.getManifest().version;
  await loadStats();
  await loadTermsList();
  loadTeamDashboard();
  loadSettings();
  bindEvents();
});

// ─── 数据加载 ────────────────────────────────────────

async function loadStats() {
  try {
    const response = await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_STATS' }, resolve);
    });
    
    document.getElementById('stat-today').textContent = response.todayNew || 0;
    document.getElementById('stat-total').textContent = response.totalTerms || 0;
    document.getElementById('stat-mastered').textContent = response.totalLearned || 0;
    
    if (response.startDate) {
      const days = Math.ceil((Date.now() - response.startDate) / (1000 * 60 * 60 * 24));
      document.getElementById('stat-days').textContent = days;
    }
  } catch (e) {
    console.log('[AgentDict Popup] Stats not available:', e);
  }
}

async function loadTermsList() {
  try {
    const termsUrl = chrome.runtime.getURL('src/dictionary/terms.json');
    const termsRes = await fetch(termsUrl);
    const localTerms = await termsRes.json();
    
    // Get merged terms (local + remote)
    const terms = await AgentDictStorage.getMergedTerms(localTerms);
    
    document.getElementById('term-count').textContent = Object.keys(terms).length;
    
    const learnedData = await new Promise(resolve => {
      chrome.storage.local.get(['learnedTerms'], resolve);
    });
    const learnedTerms = learnedData.learnedTerms || {};
    
    renderTermsList(terms, learnedTerms);
  } catch (e) {
    console.log('[AgentDict Popup] Terms load error:', e);
    document.getElementById('term-list').innerHTML = '<div class="empty">无法加载词条</div>';
  }
}

function renderTermsList(terms, learnedTerms, filter = '') {
  const list = document.getElementById('term-list');
  const entries = Object.entries(terms)
    .filter(([id, data]) => {
      if (!filter) return true;
      const lowerFilter = filter.toLowerCase();
      return data.term.toLowerCase().includes(lowerFilter) ||
             (data.aliases || []).some(a => a.toLowerCase().includes(lowerFilter)) ||
             (data.category || '').toLowerCase().includes(lowerFilter);
    })
    .sort((a, b) => a[1].term.localeCompare(b[1].term));
  
  if (entries.length === 0) {
    list.innerHTML = '<div class="empty">没有找到匹配的术语</div>';
    return;
  }
  
  list.innerHTML = entries.map(([id, data]) => {
    const status = learnedTerms[id]?.status || 'unseen';
    const statusLabel = {
      unseen: '未见',
      new: '🟢 新词',
      faded: '🔵 已淡化',
      mastered: '✅ 已掌握'
    }[status];
    const statusClass = `term-item__status--${status}`;
    
    return `
      <div class="term-item" data-term-id="${id}">
        <span class="term-item__emoji">${data.emoji || '📖'}</span>
        <div class="term-item__info">
          <span class="term-item__name">${data.term}</span>
          <span class="term-item__category">${data.category || ''}</span>
        </div>
        <span class="term-item__status ${statusClass}">${statusLabel}</span>
      </div>
    `;
  }).join('');

  // 保存 terms 引用供搜索使用
  list._terms = terms;
  list._learnedTerms = learnedTerms;
}

// ─── Team Dashboard ──────────────────────────────────

function loadTeamDashboard() {
  const agents = [
    { id: 'pm', name: '产品经理', emoji: '🎯', status: 'done' },
    { id: 'ux', name: 'UX 设计师', emoji: '🎨', status: 'done' },
    { id: 'fe', name: '前端架构师', emoji: '🏗️', status: 'active' },
    { id: 'editor', name: '术语编辑', emoji: '📖', status: 'done' },
    { id: 'fs', name: '全栈工程师', emoji: '⚙️', status: 'done' },
    { id: 'qa', name: '测试工程师', emoji: '🧪', status: 'waiting' },
    { id: 'lxd', name: '学习设计师', emoji: '📚', status: 'waiting' },
    { id: 'growth', name: '运营增长', emoji: '📢', status: 'waiting' }
  ];

  const tasks = [
    { id: 'T1', name: '需求澄清', status: 'done', agent: '🎯 PM' },
    { id: 'T2', name: '写测试用例', status: 'done', agent: '🧪 QA' },
    { id: 'T3', name: '审查测试', status: 'done', agent: '📖 Editor' },
    { id: 'T4', name: '🖐 人审核', status: 'done', agent: 'Lead' },
    { id: 'T5', name: '写代码实现', status: 'active', agent: '🏗️ FE-Arch' },
    { id: 'T6', name: '跑测试', status: 'waiting', agent: '🧪 QA' },
    { id: 'T7', name: '🖐 人验收', status: 'waiting', agent: 'Lead' }
  ];

  // Progress bar
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const progress = Math.round((doneTasks / tasks.length) * 100);
  document.getElementById('pipeline-bar').style.width = `${progress}%`;

  // Task list
  document.getElementById('pipeline-tasks').innerHTML = tasks.map(t => {
    const icon = { done: '✅', active: '🔄', waiting: '⏳' }[t.status];
    const cls = `pipeline__task pipeline__task--${t.status}`;
    return `<div class="${cls}"><span>${icon} ${t.id} ${t.name}</span><span class="pipeline__agent">${t.agent}</span></div>`;
  }).join('');

  // Agent list
  document.getElementById('agents-list').innerHTML = agents.map(a => {
    const statusLabel = { done: '✅ 完成', active: '🔄 工作中', waiting: '⏳ 等待' }[a.status];
    return `
      <div class="agent-card agent-card--${a.status}">
        <span class="agent-card__emoji">${a.emoji}</span>
        <span class="agent-card__name">${a.name}</span>
        <span class="agent-card__status">${statusLabel}</span>
      </div>
    `;
  }).join('');
}

// ─── 设置 ────────────────────────────────────────────

async function loadSettings() {
  try {
    const data = await new Promise(resolve => {
      chrome.storage.local.get(['level', 'theme', 'enabled', 'syncUrl', 'lastSync'], resolve);
    });
    
    if (data.level) document.getElementById('setting-level').value = data.level;
    if (data.theme) document.getElementById('setting-theme').value = data.theme;
    if (data.syncUrl) document.getElementById('sync-url').value = data.syncUrl;
    
    updateSyncStatus(data.lastSync);
    updateToggleBtn(data.enabled !== false);
  } catch (e) {
    updateToggleBtn(true);
  }
}

function updateSyncStatus(timestamp) {
  const statusEl = document.getElementById('sync-status');
  if (!timestamp) {
    statusEl.textContent = '最近同步：未同步';
  } else {
    statusEl.textContent = `最近同步：${new Date(timestamp).toLocaleString()}`;
  }
}

function updateToggleBtn(enabled) {
  const btn = document.getElementById('toggle-btn');
  btn.classList.toggle('toggle-btn--off', !enabled);
  btn.title = enabled ? '点击关闭' : '点击开启';
}

// ─── 事件绑定 ────────────────────────────────────────

function bindEvents() {
  // Tab switching
  document.querySelectorAll('.tabs__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs__btn').forEach(b => b.classList.remove('tabs__btn--active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('tab-content--active'));
      btn.classList.add('tabs__btn--active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('tab-content--active');
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    const list = document.getElementById('term-list');
    if (list._terms) {
      renderTermsList(list._terms, list._learnedTerms, e.target.value);
    }
  });

  // Toggle
  document.getElementById('toggle-btn').addEventListener('click', async () => {
    try {
      const response = await new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'TOGGLE_ENABLED' }, resolve);
      });
      updateToggleBtn(response.enabled);
    } catch (e) {
      console.log('Toggle error:', e);
    }
  });

  // Settings changes
  document.getElementById('setting-level').addEventListener('change', (e) => {
    chrome.storage.local.set({ level: e.target.value });
  });

  document.getElementById('setting-theme').addEventListener('change', (e) => {
    chrome.storage.local.set({ theme: e.target.value });
  });
  
  // 云端同步已改为自动（service worker 启动时静默同步），无需手动 UI
  });
}
