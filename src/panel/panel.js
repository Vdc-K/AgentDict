/**
 * AgentDict — 侧边学习面板
 * 
 * 📚 LXD + 🎨 UX Agent 联合实现
 * 
 * 沉浸式翻译风格「浮动球」→ 展开侧边面板
 * 显示当前页面术语列表、学习进度、统计数据
 */

const AgentDictPanel = {
  _fab: null,
  _panel: null,
  _isOpen: false,
  _termsData: null,
  _pageTerms: new Set(),

  /**
   * 初始化侧边面板
   */
  init(termsData) {
    this._termsData = termsData;
    this._createFAB();
    this._createPanel();
    this._bindEvents();
  },

  /**
   * 创建浮动按钮 (FAB)
   */
  _createFAB() {
    this._fab = document.createElement('button');
    this._fab.id = 'agentdict-fab';
    this._fab.innerHTML = '📖';
    this._fab.setAttribute('aria-label', 'AgentDict 学习面板');
    document.body.appendChild(this._fab);
  },

  /**
   * 创建侧边面板
   */
  _createPanel() {
    this._panel = document.createElement('div');
    this._panel.id = 'agentdict-panel';
    this._panel.innerHTML = this._renderPanel();
    document.body.appendChild(this._panel);
  },

  /**
   * 渲染面板内容
   */
  _renderPanel() {
    return `
      <div class="agentdict-panel__header">
        <span class="agentdict-panel__title">📖 AgentDict</span>
        <button class="agentdict-panel__close" id="agentdict-panel-close" aria-label="关闭">×</button>
      </div>
      <div id="agentdict-panel-banner" style="display: none; padding: 12px 16px; background: linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(15, 52, 96, 0.2)); border-bottom: 1px solid rgba(249, 115, 22, 0.3); font-size: 13px; color: #e0e0e0; line-height: 1.5;">
        🐾 检测到您正在使用 <b>OpenClaw</b>！我们已为您准备了 Gateway、Daemon 等专属配置术语解释，助您轻松上手。
      </div>
      <div class="agentdict-panel__stats" id="agentdict-panel-stats">
        <div>
          <span class="agentdict-panel__stat-value" id="panel-stat-today">0</span>
          今日新词
        </div>
        <div>
          <span class="agentdict-panel__stat-value" id="panel-stat-total">0</span>
          已掌握
        </div>
        <div>
          <span class="agentdict-panel__stat-value" id="panel-stat-days">0</span>
          学习天数
        </div>
      </div>
      <div class="agentdict-panel__tabs" style="display: flex; border-bottom: 1px solid #333; margin-bottom: 8px;">
        <button class="panel-tab-btn active" data-target="panel-tab-list" style="flex: 1; padding: 8px; background: transparent; color: #a8b2d1; border: none; cursor: pointer; border-bottom: 2px solid #e94560;">📋 本页术语</button>
        <button class="panel-tab-btn" data-target="panel-tab-settings" style="flex: 1; padding: 8px; background: transparent; color: #666; border: none; cursor: pointer; border-bottom: 2px solid transparent;">⚙️ 设置</button>
      </div>

      <div id="panel-tab-list" class="panel-tab-content" style="display: block;">
        <div class="agentdict-panel__list" id="agentdict-panel-list">
          <div style="padding: 24px; text-align: center; color: #555;">
            扫描中...
          </div>
        </div>
      </div>

      <div id="panel-tab-settings" class="panel-tab-content" style="display: none; padding: 16px;">
        <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #a8b2d1;">☁️ 云端词库同步</h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <input type="text" id="panel-sync-url" placeholder="自定义词库 URL" 
                 style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #1a1a2e; color: #e0e0e0; font-size: 12px; box-sizing: border-box;"
                 value="https://raw.githubusercontent.com/user/AgentDict/main/src/dictionary/terms.json" />
          <button id="panel-btn-sync" style="width: 100%; padding: 8px; background: #10b981; color: #fff; border: none; border-radius: 4px; font-weight: 500; cursor: pointer;">立刻同步 (Sync Now)</button>
          <div id="panel-sync-status" style="font-size: 11px; color: #888; text-align: center;">最近同步：未同步</div>
        </div>
      </div>
    `;
  },

  /**
   * 绑定事件
   */
  _bindEvents() {
    // FAB 点击
    this._fab.addEventListener('click', () => {
      this.toggle();
    });

    // 关闭按钮
    this._panel.querySelector('#agentdict-panel-close').addEventListener('click', () => {
      this.close();
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
      }
    });

    // Tab 切换
    const tabs = this._panel.querySelectorAll('.panel-tab-btn');
    const contents = this._panel.querySelectorAll('.panel-tab-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.style.color = '#666'; t.style.borderColor = 'transparent'; });
        contents.forEach(c => c.style.display = 'none');
        
        tab.style.color = '#a8b2d1';
        tab.style.borderColor = '#e94560';
        this._panel.querySelector('#' + tab.dataset.target).style.display = 'block';
      });
    });

    // Sync 按钮
    const syncBtn = this._panel.querySelector('#panel-btn-sync');
    const syncUrl = this._panel.querySelector('#panel-sync-url');
    const syncStatus = this._panel.querySelector('#panel-sync-status');
    
    syncBtn.addEventListener('click', async () => {
      syncBtn.disabled = true;
      syncBtn.textContent = '同步中...';
      try {
        const response = await new Promise(resolve => {
          chrome.runtime.sendMessage({ type: 'SYNC_DICTIONARY', url: syncUrl.value.trim() }, resolve);
        });
        if (response && response.success) {
          syncBtn.style.background = '#059669';
          syncBtn.textContent = `更新了 ${response.count} 词!`;
          syncStatus.textContent = `最近同步: ${new Date(response.timestamp).toLocaleTimeString()}`;
        } else {
          syncBtn.style.background = '#dc2626';
          syncBtn.textContent = '同步失败';
        }
      } catch (e) {
        syncBtn.style.background = '#dc2626';
        syncBtn.textContent = '扩展通信失败';
      } finally {
        setTimeout(() => {
          syncBtn.disabled = false;
          syncBtn.style.background = '#10b981';
          syncBtn.textContent = '立刻同步 (Sync Now)';
        }, 3000);
      }
    });

    // FAB 拖拽
    this._makeDraggable(this._fab);
  },

  /**
   * 切换面板
   */
  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  /**
   * 打开面板
   */
  open() {
    this._isOpen = true;
    this._panel.classList.add('agentdict-panel--open');
    this._fab.innerHTML = '✕';
    this._refreshPanel();
  },

  /**
   * 关闭面板
   */
  close() {
    this._isOpen = false;
    this._panel.classList.remove('agentdict-panel--open');
    this._fab.innerHTML = '📖';
  },

  /**
   * 注册当前页面发现的术语
   */
  addPageTerm(termId) {
    this._pageTerms.add(termId);
    if (this._isOpen) {
      this._refreshTermList();
    }
    // 更新 FAB badge
    this._updateFABBadge();
  },

  /**
   * 更新 FAB 上的计数标记
   */
  _updateFABBadge() {
    const count = this._pageTerms.size;
    if (count > 0 && !this._isOpen) {
      this._fab.setAttribute('data-count', count);
      this._fab.style.setProperty('--badge-display', 'block');
    }
  },

  /**
   * 刷新面板数据
   */
  async _refreshPanel() {
    // Check for OpenClaw domain context
    const hostname = window.location.hostname || '';
    const banner = document.getElementById('agentdict-panel-banner');
    if (banner) {
      if (hostname.includes('openclaw.ai') || hostname.includes('openclaw.com') || hostname === 'localhost' || window.location.protocol === 'file:') {
        banner.style.display = 'block';
      } else {
        banner.style.display = 'none';
      }
    }

    await this._refreshStats();
    this._refreshTermList();
  },

  /**
   * 刷新统计数据
   */
  async _refreshStats() {
    try {
      const data = await new Promise(resolve => {
        chrome.storage.local.get(['stats', 'learnedTerms'], resolve);
      });
      const stats = data.stats || {};
      const learnedTerms = data.learnedTerms || {};

      // 今日新词
      const today = new Date().toDateString();
      const todayNew = Object.values(learnedTerms).filter(t =>
        new Date(t.firstSeen).toDateString() === today
      ).length;

      document.getElementById('panel-stat-today').textContent = todayNew;
      document.getElementById('panel-stat-total').textContent = stats.totalLearned || 0;

      // 学习天数
      if (stats.startDate) {
        const days = Math.max(1, Math.ceil((Date.now() - stats.startDate) / (1000 * 60 * 60 * 24)));
        document.getElementById('panel-stat-days').textContent = days;
      }
    } catch (e) {
      // Fallback for non-extension env
    }
  },

  /**
   * 刷新术语列表
   */
  async _refreshTermList() {
    const list = document.getElementById('agentdict-panel-list');
    if (!list) return;

    if (this._pageTerms.size === 0) {
      list.innerHTML = '<div style="padding: 24px; text-align: center; color: #555;">当前页面未发现术语</div>';
      return;
    }

    let learnedTerms = {};
    try {
      const data = await new Promise(resolve => {
        chrome.storage.local.get(['learnedTerms'], resolve);
      });
      learnedTerms = data.learnedTerms || {};
    } catch (e) {}

    const items = [...this._pageTerms].map(termId => {
      const term = this._termsData[termId];
      if (!term) return '';

      const status = learnedTerms[termId]?.status || 'new';
      const statusEmoji = { new: '🟢', faded: '🔵', mastered: '✅' }[status] || '🟢';
      const statusText = { new: '新词', faded: '已淡化', mastered: '已掌握' }[status] || '新词';
      const statusClass = `agentdict-panel__item-status--${status}`;

      return `
        <div class="agentdict-panel__item" data-term-id="${termId}">
          <span class="agentdict-panel__item-name">${term.emoji || '📖'} ${term.term}</span>
          <span class="agentdict-panel__item-status ${statusClass}">${statusEmoji} ${statusText}</span>
        </div>
      `;
    }).join('');

    list.innerHTML = items;

    // 点击跳转到页面中的术语
    list.querySelectorAll('.agentdict-panel__item').forEach(item => {
      item.addEventListener('click', () => {
        const termId = item.dataset.termId;
        const el = document.querySelector(`agentdict-term[data-term-id="${termId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 闪烁提示
          el.style.transition = 'background 0.3s';
          el.style.background = 'rgba(233, 69, 96, 0.3)';
          setTimeout(() => { el.style.background = ''; }, 1000);
        }
      });
    });
  },

  /**
   * 让 FAB 可拖拽
   */
  _makeDraggable(el) {
    let isDragging = false;
    let startX, startY, origX, origY;

    el.addEventListener('mousedown', (e) => {
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      origX = el.offsetLeft;
      origY = el.offsetTop;

      const onMouseMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isDragging = true;
          el.style.left = `${origX + dx}px`;
          el.style.top = `${origY + dy}px`;
          el.style.right = 'auto';
          el.style.bottom = 'auto';
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        if (isDragging) {
          // 吸附到最近的边
          const rect = el.getBoundingClientRect();
          const midX = window.innerWidth / 2;
          if (rect.left + rect.width / 2 < midX) {
            el.style.left = '24px';
            el.style.right = 'auto';
          } else {
            el.style.left = 'auto';
            el.style.right = '24px';
          }
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }
};
