/**
 * AgentDict — 浮窗解释卡片
 * 
 * 🎨 UX Agent + 🏗️ FE-Arch Agent 联合实现
 * 
 * 使用 Shadow DOM 渲染浮窗，避免与目标网页样式冲突。
 * 沉浸式翻译风格：暗色卡片、渐进展示、hover 触发。
 */

const AgentDictTooltip = {
  _shadowHost: null,
  _shadowRoot: null,
  _tooltip: null,
  _hideTimer: null,
  _showTimer: null,
  _currentTermId: null,
  _termsData: null,

  /**
   * 初始化浮窗系统
   */
  init(termsData) {
    this._termsData = termsData;
    this._createShadowHost();
    this._bindEvents();
  },

  /**
   * 创建 Shadow DOM 宿主
   */
  _createShadowHost() {
    this._shadowHost = document.createElement('agentdict-tooltip-host');
    this._shadowHost.style.cssText = 'position:fixed;top:0;left:0;z-index:2147483647;pointer-events:none;';
    document.body.appendChild(this._shadowHost);

    this._shadowRoot = this._shadowHost.attachShadow({ mode: 'closed' });

    // 注入样式
    const style = document.createElement('style');
    style.textContent = this._getTooltipCSS();
    this._shadowRoot.appendChild(style);

    // 创建浮窗容器
    this._tooltip = document.createElement('div');
    this._tooltip.className = 'agentdict-card';
    this._tooltip.style.display = 'none';
    this._shadowRoot.appendChild(this._tooltip);
  },

  /**
   * 绑定事件
   */
  _bindEvents() {
    // 事件委托：监听术语元素的 hover
    document.addEventListener('mouseover', (e) => {
      const termEl = e.target.closest?.('agentdict-term');
      if (!termEl) return;
      
      clearTimeout(this._hideTimer);
      this._showTimer = setTimeout(() => {
        this._show(termEl);
      }, 300); // 300ms 延迟，避免快速划过
    });

    document.addEventListener('mouseout', (e) => {
      const termEl = e.target.closest?.('agentdict-term');
      if (!termEl) return;
      
      clearTimeout(this._showTimer);
      this._hideTimer = setTimeout(() => {
        this._hide();
      }, 200);
    });

    // 浮窗内鼠标事件
    this._tooltip.addEventListener('mouseenter', () => {
      clearTimeout(this._hideTimer);
    });

    this._tooltip.addEventListener('mouseleave', () => {
      this._hideTimer = setTimeout(() => {
        this._hide();
      }, 150);
    });

    // 让浮窗可交互
    this._tooltip.style.pointerEvents = 'auto';
  },

  /**
   * 显示浮窗
   */
  _show(termEl) {
    const termId = termEl.dataset.termId;
    const termData = this._termsData[termId];
    if (!termData) return;

    this._currentTermId = termId;
    this._tooltip.innerHTML = this._renderCard(termId, termData);
    this._tooltip.style.display = 'block';

    // 定位
    const rect = termEl.getBoundingClientRect();
    const cardWidth = 340;
    const cardHeight = this._tooltip.offsetHeight;
    
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    let top = rect.bottom + 8;

    // 边界检测
    if (left < 10) left = 10;
    if (left + cardWidth > window.innerWidth - 10) {
      left = window.innerWidth - cardWidth - 10;
    }
    if (top + cardHeight > window.innerHeight - 10) {
      top = rect.top - cardHeight - 8;
    }

    this._tooltip.style.left = `${left}px`;
    this._tooltip.style.top = `${top}px`;

    // 绑定卡片内按钮事件
    this._bindCardActions(termId);

    // 埋点：tooltip 显示
    if (typeof AgentDictStorage !== 'undefined') {
      AgentDictStorage.trackEvent('tooltip_open', { termId });
    }

    // 记录术语已查看，并将最新状态同步回元素（驱动 CSS 视觉效果）
    if (typeof AgentDictStorage !== 'undefined') {
      AgentDictStorage.markTermViewed(termId).then(entry => {
        if (entry) {
          document.querySelectorAll(`agentdict-term[data-term-id="${termId}"]`).forEach(el => {
            el.dataset.status = entry.status;
          });
        }
      });
    }
  },

  /**
   * 隐藏浮窗
   */
  _hide() {
    this._tooltip.style.display = 'none';
    this._currentTermId = null;
  },

  /**
   * 渲染卡片内容
   */
  _renderCard(termId, termData) {
    const emoji = termData.emoji || '📖';
    const category = termData.category || '';
    const levels = termData.levels || {};
    const related = termData.relatedTerms || [];

    return `
      <div class="card-header">
        <span class="card-emoji">${emoji}</span>
        <span class="card-term">${termData.term}</span>
        <span class="card-category">${category}</span>
      </div>
      <div class="card-divider"></div>
      <div class="card-body">
        <div class="card-level card-level--beginner" data-level="beginner">
          ${levels.beginner || '暂无解释'}
        </div>
        <div class="card-level card-level--intermediate" data-level="intermediate" style="display:none;">
          ${levels.intermediate || ''}
        </div>
        <div class="card-level card-level--advanced" data-level="advanced" style="display:none;">
          ${levels.advanced || ''}
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn card-btn--level" data-action="intermediate" title="进阶">📗 进阶</button>
        <button class="card-btn card-btn--level" data-action="advanced" title="深入">📕 深入</button>
        <button class="card-btn card-btn--mastered" data-action="mastered" title="我知道了">我知道了 ✓</button>
        <button class="card-btn card-btn--bookmark" data-action="bookmark" title="收藏">⭐ 收藏</button>
      </div>
      ${related.length > 0 ? `
        <div class="card-related">
          相关: ${related.map(t => `<span class="related-tag">${t}</span>`).join(' · ')}
        </div>
      ` : ''}
    `;
  },

  /**
   * 绑定卡片内按钮
   */
  _bindCardActions(termId) {
    // 分级切换按钮
    this._tooltip.querySelectorAll('.card-btn--level').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const level = e.target.dataset.action;
        this._tooltip.querySelectorAll('.card-level').forEach(el => {
          el.style.display = el.dataset.level === 'beginner' || el.dataset.level === level ? 'block' : 'none';
        });
      });
    });

    // "我知道了 ✓" 按钮
    const masteredBtn = this._tooltip.querySelector('.card-btn--mastered');
    if (masteredBtn) {
      masteredBtn.addEventListener('click', () => {
        // 持久化
        if (typeof AgentDictStorage !== 'undefined') {
          AgentDictStorage.markTermMastered(termId);
        }

        // 立刻更新页面上所有该术语元素的状态 → mastered（虚线消失）
        document.querySelectorAll(`agentdict-term[data-term-id="${termId}"]`).forEach(el => {
          el.dataset.status = 'mastered';
        });

        // 更新按钮状态
        masteredBtn.textContent = '已掌握 ✓';
        masteredBtn.disabled = true;

        // 短暂延迟后关闭浮窗，让用户看到反馈
        setTimeout(() => this._hide(), 600);
      });
    }
  },

  /**
   * 浮窗 CSS (注入 Shadow DOM)
   */
  _getTooltipCSS() {
    return `
      .agentdict-card {
        position: fixed;
        width: 340px;
        background: #1a1a2e;
        border: 1px solid #16213e;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(83,52,131,0.2);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        font-size: 14px;
        color: #e0e0e0;
        padding: 16px;
        z-index: 2147483647;
        animation: agentdict-fadeIn 0.15s ease-out;
        pointer-events: auto;
        line-height: 1.6;
      }

      @keyframes agentdict-fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .card-emoji {
        font-size: 20px;
      }

      .card-term {
        font-size: 16px;
        font-weight: 700;
        color: #fff;
        flex: 1;
      }

      .card-category {
        font-size: 11px;
        color: #888;
        background: #0f3460;
        padding: 2px 8px;
        border-radius: 10px;
      }

      .card-divider {
        height: 1px;
        background: linear-gradient(90deg, #0f3460, #533483, #0f3460);
        margin: 8px 0 12px;
      }

      .card-body {
        margin-bottom: 12px;
      }

      .card-level {
        color: #ccc;
        font-size: 13.5px;
        line-height: 1.7;
      }

      .card-level--beginner {
        color: #e0e0e0;
      }

      .card-level--intermediate {
        color: #aab;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed #333;
      }

      .card-level--advanced {
        color: #99a;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed #333;
        font-size: 13px;
      }

      .card-actions {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }

      .card-btn {
        background: #16213e;
        border: 1px solid #1a3a5c;
        color: #aab;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s ease;
        font-family: inherit;
      }

      .card-btn:hover {
        background: #1a3a5c;
        color: #fff;
        border-color: #533483;
      }

      .card-btn:disabled {
        opacity: 0.5;
        cursor: default;
      }

      .card-related {
        font-size: 12px;
        color: #667;
        padding-top: 8px;
        border-top: 1px solid #222;
      }

      .related-tag {
        color: #7a8baa;
        cursor: pointer;
      }

      .related-tag:hover {
        color: #e94560;
      }
    `;
  }
};
