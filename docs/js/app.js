// ===== App Controller =====

let currentUser = null; // null=guest, 'contractor', 'staff'
let currentScreen = 'home';
const screenHistory = [];

// ===== Navigation =====
function navigateTo(screenId, opts = {}) {
  if (!opts.replace) {
    screenHistory.push(currentScreen);
  }
  currentScreen = screenId;
  renderScreen(screenId, opts);
}

function goBack() {
  if (screenHistory.length > 0) {
    const prev = screenHistory.pop();
    currentScreen = prev;
    renderScreen(prev, { back: true });
  }
}

function renderScreen(screenId, opts = {}) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById('screen-' + screenId);
  if (target) {
    target.classList.add('active');
  }
  // Update header
  updateHeader(screenId);
  // Update tab bar
  updateTabBar(screenId);
  // Scroll to top
  if (!opts.back) window.scrollTo(0, 0);
  // Screen-specific init
  if (typeof window['init_' + screenId.replace(/-/g, '_')] === 'function') {
    window['init_' + screenId.replace(/-/g, '_')](opts);
  }
}

function updateHeader(screenId) {
  const header = document.getElementById('app-header');
  const titles = {
    'home': 'エアコン部品サポート',
    'notifications': 'お知らせ',
    'settings': '設定',
    'login': 'ログイン',
    'register': '新規登録',
    'trial-list': 'リモコン試運転',
    'trial-detail': '試運転詳細',
    'error-maker': 'エラーコード検索',
    'error-list': 'エラーコード一覧',
    'error-detail': 'エラーコード詳細',
    'blueprint': '図面検索',
    'order-new': '新規部品発注',
    'order-confirm': '送信完了',
    'order-history': '発注履歴',
    'order-detail': '発注詳細',
    'video-list': '技術動画',
    'video-detail': '動画再生',
    'video-paywall': 'プレミアムプラン',
    'plan': 'プラン管理',
    'device-error': '同時利用制限',
    'staff-dashboard': 'ダッシュボード',
    'staff-orders': '発注依頼管理',
    'staff-order-detail': '依頼詳細',
    'staff-content': 'コンテンツ管理',
  };
  const title = titles[screenId] || '';
  const isHome = (screenId === 'home' || screenId === 'staff-dashboard');
  const showBack = !isHome;

  header.innerHTML = `
    ${showBack ? '<button class="back-btn" onclick="goBack()">←</button>' : ''}
    <span class="header-title">${title}</span>
    <div class="header-actions">
      <button class="header-icon" onclick="navigateTo('notifications')">
        🔔<span class="badge-dot"></span>
      </button>
    </div>
  `;
}

function updateTabBar(screenId) {
  const tabBar = document.getElementById('tab-bar');
  if (currentUser === 'staff') {
    tabBar.innerHTML = `
      <button class="tab-item ${screenId==='staff-dashboard'?'active':''}" onclick="navigateTo('staff-dashboard')">
        <span class="tab-icon">📊</span><span class="tab-label">ダッシュボード</span>
      </button>
      <button class="tab-item ${screenId.startsWith('staff-order')?'active':''}" onclick="navigateTo('staff-orders')">
        <span class="tab-icon">📋</span><span class="tab-label">依頼管理</span>
      </button>
      <button class="tab-item ${screenId==='staff-content'?'active':''}" onclick="navigateTo('staff-content')">
        <span class="tab-icon">📁</span><span class="tab-label">コンテンツ</span>
      </button>
      <button class="tab-item ${screenId==='settings'?'active':''}" onclick="navigateTo('settings')">
        <span class="tab-icon">⚙️</span><span class="tab-label">設定</span>
      </button>
    `;
  } else {
    tabBar.innerHTML = `
      <button class="tab-item ${screenId==='home'?'active':''}" onclick="navigateTo('home')">
        <span class="tab-icon">🏠</span><span class="tab-label">ホーム</span>
      </button>
      <button class="tab-item ${screenId.startsWith('order')?'active':''}" onclick="requireLogin(()=>navigateTo('order-history'))">
        <span class="tab-icon">📦</span><span class="tab-label">発注</span>
      </button>
      <button class="tab-item ${screenId.startsWith('video')?'active':''}" onclick="requireLogin(()=>navigateTo('video-list'))">
        <span class="tab-icon">🎬</span><span class="tab-label">動画</span>
      </button>
      <button class="tab-item ${screenId==='settings'?'active':''}" onclick="navigateTo('settings')">
        <span class="tab-icon">⚙️</span><span class="tab-label">設定</span>
      </button>
    `;
  }
  tabBar.style.display = 'flex';
}

// ===== Auth =====
function requireLogin(callback) {
  if (currentUser) {
    callback();
  } else {
    navigateTo('login');
  }
}

function doLogin(role) {
  currentUser = role;
  showToast('ログインしました', 'success');
  if (role === 'staff') {
    navigateTo('staff-dashboard', { replace: true });
  } else {
    navigateTo('home', { replace: true });
  }
}

function doLogout() {
  currentUser = null;
  screenHistory.length = 0;
  showToast('ログアウトしました');
  navigateTo('home', { replace: true });
}

// ===== Toast =====
function showToast(msg, type = '') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type ? 'toast-' + type : ''}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== Modal =====
function showModal(title, text, actions) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('.modal-title').textContent = title;
  overlay.querySelector('.modal-text').textContent = text;
  const actionsEl = overlay.querySelector('.modal-actions');
  actionsEl.innerHTML = '';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = `btn ${a.class || 'btn-secondary'}`;
    btn.textContent = a.label;
    btn.onclick = () => { closeModal(); if (a.action) a.action(); };
    actionsEl.appendChild(btn);
  });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ===== Screen Initializers =====

// -- Home --
function init_home() {
  const el = document.getElementById('screen-home');
  el.innerHTML = `
    <div class="tile-grid">
      <div class="tile" onclick="requireLogin(()=>navigateTo('order-new'))">
        <span class="tile-icon">📦</span>
        <span class="tile-label">部品発注</span>
        <span class="tile-desc">エアコン部品の注文</span>
      </div>
      <div class="tile" onclick="navigateTo('trial-list')">
        <span class="tile-icon">🔧</span>
        <span class="tile-label">リモコン試運転</span>
        <span class="tile-desc">ログイン不要</span>
      </div>
      <div class="tile" onclick="navigateTo('error-maker')">
        <span class="tile-icon">⚠️</span>
        <span class="tile-label">エラーコード</span>
        <span class="tile-desc">ログイン不要</span>
      </div>
      <div class="tile" onclick="navigateTo('blueprint')">
        <span class="tile-icon">📐</span>
        <span class="tile-label">図面検索</span>
        <span class="tile-desc">ログイン不要</span>
      </div>
      <div class="tile" onclick="requireLogin(()=>navigateTo('video-list'))">
        <span class="tile-icon">🎬</span>
        <span class="tile-label">技術動画</span>
        <span class="tile-desc">サブスク対応</span>
      </div>
      <div class="tile" onclick="requireLogin(()=>navigateTo('order-history'))">
        <span class="tile-icon">📋</span>
        <span class="tile-label">発注履歴</span>
        <span class="tile-desc">要ログイン</span>
      </div>
    </div>
    ${!currentUser ? `
    <div class="page-section text-center">
      <p class="text-muted mb-8" style="font-size:13px">部品発注・動画視聴にはログインが必要です</p>
      <button class="btn btn-primary btn-block" onclick="navigateTo('login')">ログイン / 新規登録</button>
    </div>` : `
    <div class="page-section">
      <div class="section-title">最近の発注</div>
      ${ORDERS.slice(0,3).map(o => orderListItem(o)).join('')}
      <button class="btn btn-outline btn-block mt-8" onclick="navigateTo('order-history')">すべての発注を見る</button>
    </div>`}
  `;
}

// -- Notifications --
function init_notifications() {
  const notifs = currentUser === 'staff' ? STAFF_NOTIFICATIONS : NOTIFICATIONS;
  const el = document.getElementById('screen-notifications');
  el.innerHTML = `
    <div class="card">
      ${notifs.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="${n.link ? `navigateTo('${n.link}'${n.orderId ? `,{orderId:'${n.orderId}'}` : ''})` : ''}">
          <span class="notif-dot ${n.unread ? '' : 'read'}"></span>
          <div class="notif-body">
            <div class="notif-title">${n.title}</div>
            <div class="notif-desc">${n.desc}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// -- Settings --
function init_settings() {
  const el = document.getElementById('screen-settings');
  el.innerHTML = `
    <div class="card" style="margin:16px">
      ${currentUser ? `
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:20px">👤</div>
            <div>
              <div style="font-weight:600">${USERS[currentUser].name}</div>
              <div style="font-size:13px;color:var(--gray-500)">${USERS[currentUser].email}</div>
              <div style="font-size:12px;color:var(--gray-500)">${USERS[currentUser].role === 'staff' ? '仲介スタッフ' : '空調業者'} / ${USERS[currentUser].accountType === 'corporate' ? '法人' : '個人'}</div>
            </div>
          </div>
        </div>
      ` : ''}
      <div class="list-item" onclick="${currentUser ? "navigateTo('plan')" : "navigateTo('login')"}">
        <span class="list-icon" style="background:var(--primary-light)">💳</span>
        <div class="list-body"><div class="list-title">${currentUser ? 'プラン管理' : 'ログイン / 新規登録'}</div></div>
        <span class="list-chevron">›</span>
      </div>
      ${currentUser ? `
      <div class="list-item" onclick="navigateTo('device-error')">
        <span class="list-icon" style="background:#fff3e0">📱</span>
        <div class="list-body"><div class="list-title">端末・セッション管理</div></div>
        <span class="list-chevron">›</span>
      </div>
      ` : ''}
      <div class="list-item">
        <span class="list-icon" style="background:var(--gray-100)">❓</span>
        <div class="list-body"><div class="list-title">ヘルプ</div></div>
        <span class="list-chevron">›</span>
      </div>
      <div class="list-item">
        <span class="list-icon" style="background:var(--gray-100)">📄</span>
        <div class="list-body"><div class="list-title">利用規約 / プライバシーポリシー</div></div>
        <span class="list-chevron">›</span>
      </div>
      ${currentUser ? `
      <div class="list-item" onclick="doLogout()" style="color:var(--danger)">
        <span class="list-icon" style="background:#fce4ec">🚪</span>
        <div class="list-body"><div class="list-title" style="color:var(--danger)">ログアウト</div></div>
      </div>` : ''}
    </div>
    <div class="page-section text-center">
      <p class="text-muted" style="font-size:11px">バージョン 1.0.0（モック）</p>
    </div>
    <!-- Debug: switch role -->
    <div class="page-section" style="border-top:2px dashed var(--gray-300);margin-top:16px;padding-top:16px">
      <p style="font-size:12px;color:var(--gray-400);margin-bottom:8px">🛠 デバッグ: ロール切り替え</p>
      <div class="flex gap-8">
        <button class="btn btn-sm ${!currentUser?'btn-primary':'btn-secondary'}" onclick="doLogout()">ゲスト</button>
        <button class="btn btn-sm ${currentUser==='contractor'?'btn-primary':'btn-secondary'}" onclick="doLogin('contractor')">業者</button>
        <button class="btn btn-sm ${currentUser==='staff'?'btn-primary':'btn-secondary'}" onclick="doLogin('staff')">スタッフ</button>
      </div>
    </div>
  `;
}

// -- Login --
function init_login() {
  const el = document.getElementById('screen-login');
  el.innerHTML = `
    <div class="page-section">
      <div style="text-align:center;margin:24px 0">
        <div style="font-size:48px;margin-bottom:8px">🔧</div>
        <h2 style="font-size:20px;margin-bottom:4px">エアコン部品サポート</h2>
        <p class="text-muted" style="font-size:13px">業者様向けアプリ</p>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">メールアドレス</label>
            <input class="form-input" type="email" placeholder="example@company.co.jp" value="tanaka@aircon-pro.co.jp">
          </div>
          <div class="form-group">
            <label class="form-label">パスワード</label>
            <input class="form-input" type="password" placeholder="パスワード" value="password123">
          </div>
          <button class="btn btn-primary btn-block btn-lg" onclick="doLogin('contractor')">ログイン</button>
          <div class="text-center mt-16">
            <a href="#" style="color:var(--primary);font-size:13px" onclick="navigateTo('register');return false">新規登録はこちら</a>
          </div>
          <div class="text-center mt-8">
            <a href="#" style="color:var(--gray-500);font-size:12px">パスワードをお忘れですか？</a>
          </div>
        </div>
      </div>
      <div class="text-center mt-16" style="border-top:1px solid var(--gray-200);padding-top:16px">
        <p class="text-muted" style="font-size:12px;margin-bottom:8px">仲介スタッフの方はこちら</p>
        <button class="btn btn-secondary btn-sm" onclick="doLogin('staff')">スタッフとしてログイン</button>
      </div>
    </div>
  `;
}

// -- Register --
function init_register() {
  const el = document.getElementById('screen-register');
  el.innerHTML = `
    <div class="page-section">
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">アカウント種別</label>
            <div class="flex gap-8">
              <button class="btn btn-primary flex-1" id="reg-individual" onclick="toggleRegType('individual')">個人</button>
              <button class="btn btn-secondary flex-1" id="reg-corporate" onclick="toggleRegType('corporate')">法人</button>
            </div>
          </div>
          <div id="reg-company-field" class="form-group hidden">
            <label class="form-label">会社名</label>
            <input class="form-input" placeholder="株式会社〇〇">
          </div>
          <div class="form-group">
            <label class="form-label">お名前<span class="required">*</span></label>
            <input class="form-input" placeholder="田中 太郎">
          </div>
          <div class="form-group">
            <label class="form-label">メールアドレス<span class="required">*</span></label>
            <input class="form-input" type="email" placeholder="example@company.co.jp">
          </div>
          <div class="form-group">
            <label class="form-label">電話番号</label>
            <input class="form-input" type="tel" placeholder="090-1234-5678">
          </div>
          <div class="form-group">
            <label class="form-label">パスワード<span class="required">*</span></label>
            <input class="form-input" type="password" placeholder="8文字以上">
          </div>
          <div class="form-group">
            <label class="form-label">パスワード（確認）<span class="required">*</span></label>
            <input class="form-input" type="password" placeholder="もう一度入力">
          </div>
          <button class="btn btn-primary btn-block btn-lg" onclick="doLogin('contractor')">登録する</button>
        </div>
      </div>
    </div>
  `;
}
function toggleRegType(type) {
  document.getElementById('reg-individual').className = `btn ${type==='individual'?'btn-primary':'btn-secondary'} flex-1`;
  document.getElementById('reg-corporate').className = `btn ${type==='corporate'?'btn-primary':'btn-secondary'} flex-1`;
  document.getElementById('reg-company-field').classList.toggle('hidden', type !== 'corporate');
}

// -- Trial List --
function init_trial_list() {
  const el = document.getElementById('screen-trial-list');
  const cats = [...new Set(OFFLINE_ARTICLES.map(a => a.category))];
  el.innerHTML = `
    <div class="search-bar">
      <input class="search-input" placeholder="キーワードで検索..." oninput="filterTrialList(this.value)">
    </div>
    <div class="chip-row">
      <button class="chip active" onclick="filterTrialCat(this,'all')">すべて</button>
      ${cats.map(c => `<button class="chip" onclick="filterTrialCat(this,'${c}')">${c}</button>`).join('')}
      <button class="chip" onclick="filterTrialCat(this,'downloaded')">📥 保存済み</button>
    </div>
    <div id="trial-list-items" class="card" style="margin:8px 16px">
      ${OFFLINE_ARTICLES.map(a => trialListItem(a)).join('')}
    </div>
  `;
}
function trialListItem(a) {
  return `
    <div class="list-item" onclick="navigateTo('trial-detail',{articleId:${a.id}})">
      <span class="list-icon" style="background:${a.isDownloaded ? '#e8f5e9' : 'var(--gray-100)'}">📄</span>
      <div class="list-body">
        <div class="list-title">${a.title}</div>
        <div class="list-subtitle">更新: ${a.updatedAt} ${a.isDownloaded ? '<span class="offline-badge">✓ 保存済</span>' : ''}</div>
      </div>
      <span class="list-chevron">›</span>
    </div>`;
}
function filterTrialList(q) {
  const container = document.getElementById('trial-list-items');
  const filtered = OFFLINE_ARTICLES.filter(a => a.title.includes(q) || a.category.includes(q));
  container.innerHTML = filtered.map(a => trialListItem(a)).join('') || '<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">該当する記事がありません</div></div>';
}
function filterTrialCat(btn, cat) {
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const container = document.getElementById('trial-list-items');
  let filtered = OFFLINE_ARTICLES;
  if (cat === 'downloaded') filtered = OFFLINE_ARTICLES.filter(a => a.isDownloaded);
  else if (cat !== 'all') filtered = OFFLINE_ARTICLES.filter(a => a.category === cat);
  container.innerHTML = filtered.map(a => trialListItem(a)).join('') || '<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">該当する記事がありません</div></div>';
}

// -- Trial Detail --
function init_trial_detail(opts) {
  const article = OFFLINE_ARTICLES.find(a => a.id === opts.articleId) || OFFLINE_ARTICLES[0];
  const el = document.getElementById('screen-trial-detail');
  el.innerHTML = `
    <div class="page-section">
      <div class="flex justify-between items-center mb-16">
        <div>
          <h2 style="font-size:18px;font-weight:700">${article.title}</h2>
          <p class="text-muted" style="font-size:12px;margin-top:4px">最終更新: ${article.updatedAt}</p>
        </div>
        ${article.isDownloaded ?
          '<span class="offline-badge">✓ この端末に保存済</span>' :
          '<button class="download-btn" onclick="this.outerHTML=\'<span class=offline-badge>✓ 保存完了</span>\';showToast(\'保存しました\',\'success\')">📥 ダウンロード</button>'}
      </div>
      <div class="card">
        <div class="card-body" style="line-height:1.8;white-space:pre-wrap">${article.body}</div>
      </div>
      <div style="background:var(--gray-100);border-radius:var(--radius);padding:40px;text-align:center;color:var(--gray-400);margin-top:12px">
        📷 画像プレースホルダー<br><span style="font-size:12px">（実際は手順画像が入ります）</span>
      </div>
    </div>
  `;
}

// -- Error Maker Select --
function init_error_maker() {
  const el = document.getElementById('screen-error-maker');
  el.innerHTML = `
    <div class="search-bar">
      <input class="search-input" placeholder="エラーコードで検索（例: A3）" oninput="searchErrorDirect(this.value)">
    </div>
    <div class="page-section">
      <div class="section-title">メーカーを選択</div>
      <div class="card">
        ${MAKERS.map(m => `
          <div class="list-item" onclick="navigateTo('error-list',{maker:'${m}'})">
            <span class="list-icon" style="background:var(--primary-light)">🏭</span>
            <div class="list-body"><div class="list-title">${m}</div></div>
            <span class="list-chevron">›</span>
          </div>`).join('')}
      </div>
    </div>
    <div id="error-search-results" class="page-section hidden"></div>
  `;
}
function searchErrorDirect(q) {
  const results = document.getElementById('error-search-results');
  if (!q) { results.classList.add('hidden'); return; }
  const filtered = ERROR_CODES.filter(e => e.code.toLowerCase().includes(q.toLowerCase()) || e.description.includes(q));
  if (filtered.length === 0) { results.classList.add('hidden'); return; }
  results.classList.remove('hidden');
  results.innerHTML = `
    <div class="section-title">検索結果</div>
    <div class="card">
      ${filtered.map(e => `
        <div class="list-item" onclick="navigateTo('error-detail',{errorId:${e.id}})">
          <span class="list-icon" style="background:#fff3e0;font-size:14px;font-weight:700">${e.code}</span>
          <div class="list-body">
            <div class="list-title">${e.description}</div>
            <div class="list-subtitle">${e.maker}</div>
          </div>
          <span class="list-chevron">›</span>
        </div>`).join('')}
    </div>`;
}

// -- Error List --
function init_error_list(opts) {
  const maker = opts.maker || 'ダイキン';
  const codes = ERROR_CODES.filter(e => e.maker === maker);
  const el = document.getElementById('screen-error-list');
  el.innerHTML = `
    <div class="search-bar">
      <input class="search-input" placeholder="コードで検索..." oninput="filterErrorList(this.value,'${maker}')">
    </div>
    <div class="page-section">
      <div class="section-title">${maker} のエラーコード</div>
      <div class="card" id="error-list-items">
        ${codes.map(e => errorListItem(e)).join('')}
        ${codes.length === 0 ? '<div class="empty-state"><div class="empty-text">登録されているエラーコードはありません</div></div>' : ''}
      </div>
    </div>
  `;
}
function errorListItem(e) {
  return `
    <div class="list-item" onclick="navigateTo('error-detail',{errorId:${e.id}})">
      <span class="list-icon" style="background:#fff3e0;font-weight:700;font-size:14px">${e.code}</span>
      <div class="list-body">
        <div class="list-title">${e.description}</div>
        <div class="list-subtitle">${e.maker}</div>
      </div>
      <span class="list-chevron">›</span>
    </div>`;
}
function filterErrorList(q, maker) {
  const codes = ERROR_CODES.filter(e => e.maker === maker && (e.code.toLowerCase().includes(q.toLowerCase()) || e.description.includes(q)));
  document.getElementById('error-list-items').innerHTML = codes.map(e => errorListItem(e)).join('') || '<div class="empty-state"><div class="empty-text">該当なし</div></div>';
}

// -- Error Detail --
function init_error_detail(opts) {
  const err = ERROR_CODES.find(e => e.id === opts.errorId) || ERROR_CODES[0];
  const el = document.getElementById('screen-error-detail');
  el.innerHTML = `
    <div class="page-section">
      <div class="card">
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
            <div style="width:56px;height:56px;border-radius:var(--radius-sm);background:#fff3e0;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700">${err.code}</div>
            <div>
              <div style="font-weight:700;font-size:16px">${err.description}</div>
              <div class="text-muted" style="font-size:13px">${err.maker}</div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">考えられる原因</label>
            <p style="font-size:14px;line-height:1.6">${err.cause}</p>
          </div>
          <div class="form-group">
            <label class="form-label">対処方法</label>
            <p style="font-size:14px;line-height:1.6">${err.solution}</p>
          </div>
        </div>
      </div>
      <button class="download-btn" onclick="showToast('保存しました','success')">📥 オフライン用に保存</button>
    </div>
  `;
}

// -- Blueprint --
function init_blueprint() {
  const el = document.getElementById('screen-blueprint');
  el.innerHTML = `
    <div class="page-section">
      <p class="text-muted mb-16" style="font-size:13px">各メーカーの図面検索サイトへ移動します</p>
      <div class="card">
        ${MANUFACTURER_LINKS.map(m => `
          <div class="list-item" onclick="showToast('${m.maker}のサイトへ移動します（モック）')">
            <span class="list-icon" style="background:var(--primary-light)">🏭</span>
            <div class="list-body">
              <div class="list-title">${m.maker}</div>
              <div class="list-subtitle">${m.notes}</div>
            </div>
            <span style="color:var(--primary);font-size:14px">↗</span>
          </div>`).join('')}
      </div>
    </div>
  `;
}

// -- Order New --
function init_order_new() {
  const el = document.getElementById('screen-order-new');
  el.innerHTML = `
    <div class="page-section">
      <div class="card">
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">エアコン型番<span class="required">*</span></label>
            <input class="form-input" id="order-model" placeholder="例: RAS-X40N2">
          </div>
          <div class="form-group">
            <label class="form-label">部品名<span class="required">*</span></label>
            <input class="form-input" id="order-part" placeholder="例: コンプレッサー">
          </div>
          <div class="form-group">
            <label class="form-label">メーカー名</label>
            <select class="form-select" id="order-maker">
              <option value="">選択してください</option>
              ${MAKERS.map(m => `<option>${m}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">台数</label>
            <input class="form-input" type="number" id="order-qty" value="1" min="1">
          </div>
          <div class="form-group">
            <label class="form-label">写真添付</label>
            <div class="flex gap-8">
              <div class="photo-upload" onclick="showToast('カメラ/ギャラリーを開きます（モック）')">＋</div>
            </div>
            <div class="form-hint">部品の写真やラベルの写真があると特定が早くなります</div>
          </div>
          <div class="form-group">
            <label class="form-label">希望納期</label>
            <input class="form-input" type="date" id="order-date">
          </div>
          <div class="form-group">
            <label class="form-label">連絡先電話番号</label>
            <input class="form-input" type="tel" placeholder="090-1234-5678">
          </div>
          <div class="form-group">
            <label class="form-label">備考</label>
            <textarea class="form-textarea" id="order-notes" placeholder="その他ご要望があれば"></textarea>
          </div>
          <button class="btn btn-primary btn-block btn-lg" onclick="submitOrder()">発注依頼を送信</button>
        </div>
      </div>
    </div>
  `;
}
function submitOrder() {
  const model = document.getElementById('order-model').value;
  const part = document.getElementById('order-part').value;
  if (!model || !part) {
    showToast('型番と部品名は必須です', 'error');
    return;
  }
  showModal('送信確認', `型番: ${model}\n部品: ${part}\n\nこの内容で発注依頼を送信しますか？`, [
    { label: 'キャンセル' },
    { label: '送信する', class: 'btn-primary', action: () => {
      navigateTo('order-confirm', { model, part });
    }}
  ]);
}

// -- Order Confirm --
function init_order_confirm(opts) {
  const el = document.getElementById('screen-order-confirm');
  el.innerHTML = `
    <div class="page-section text-center" style="padding-top:40px">
      <div style="font-size:64px;margin-bottom:16px">✅</div>
      <h2 style="font-size:20px;margin-bottom:8px">発注依頼を送信しました</h2>
      <p class="text-muted" style="font-size:14px;margin-bottom:24px">受付番号: ORD-2024-007</p>
      <div class="card" style="text-align:left;margin:0 0 16px">
        <div class="card-body">
          <p style="font-size:13px;line-height:1.8">
            <strong>型番:</strong> ${opts.model || 'RAS-X40N2'}<br>
            <strong>部品:</strong> ${opts.part || 'コンプレッサー'}<br>
            <strong>ステータス:</strong> <span class="status-badge status-new">新規</span>
          </p>
          <p class="text-muted" style="font-size:12px;margin-top:12px">仲介スタッフが確認後、見積をお送りします。通知でお知らせしますのでしばらくお待ちください。</p>
        </div>
      </div>
      <button class="btn btn-primary btn-block" onclick="navigateTo('order-history')">発注履歴を見る</button>
      <button class="btn btn-secondary btn-block mt-8" onclick="navigateTo('home')">ホームに戻る</button>
    </div>
  `;
}

// -- Order History --
function init_order_history() {
  const el = document.getElementById('screen-order-history');
  el.innerHTML = `
    <div class="search-bar">
      <input class="search-input" placeholder="型番・部品名で検索...">
    </div>
    <div class="chip-row">
      <button class="chip active" onclick="filterOrders(this,'all')">すべて</button>
      <button class="chip" onclick="filterOrders(this,'active')">対応中</button>
      <button class="chip" onclick="filterOrders(this,'completed')">完了</button>
      <button class="chip" onclick="filterOrders(this,'cancelled')">キャンセル</button>
    </div>
    <div class="page-section" id="order-list-container">
      ${ORDERS.map(o => orderListItem(o)).join('')}
    </div>
    <div style="position:fixed;bottom:calc(var(--tab-height) + 16px);right:16px;left:50%;transform:translateX(-50%);max-width:430px;display:flex;justify-content:flex-end;pointer-events:none;z-index:50">
      <button class="btn btn-primary" style="border-radius:50%;width:56px;height:56px;font-size:24px;box-shadow:var(--shadow-lg);pointer-events:auto" onclick="navigateTo('order-new')">＋</button>
    </div>
  `;
}

function orderListItem(o) {
  const st = ORDER_STATUSES.find(s => s.key === o.status);
  return `
    <div class="card" onclick="navigateTo('order-detail',{orderId:'${o.id}'})" style="cursor:pointer">
      <div class="card-body">
        <div class="flex justify-between items-center mb-8">
          <span style="font-size:12px;color:var(--gray-500)">${o.id}</span>
          <span class="status-badge ${st.css}">${st.label}</span>
        </div>
        <div style="font-weight:600;font-size:15px">${o.partName}</div>
        <div style="font-size:13px;color:var(--gray-600);margin-top:2px">${o.makerName || ''} ${o.airconModel}</div>
        <div class="flex justify-between items-center mt-8">
          <span style="font-size:12px;color:var(--gray-500)">${o.createdAt}</span>
          ${o.quotePrice ? `<span style="font-size:15px;font-weight:700;color:var(--primary)">¥${o.quotePrice.toLocaleString()}</span>` : ''}
        </div>
      </div>
    </div>`;
}
function filterOrders(btn, filter) {
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  let filtered = ORDERS;
  if (filter === 'active') filtered = ORDERS.filter(o => !['completed','cancelled','no_stock'].includes(o.status));
  else if (filter === 'completed') filtered = ORDERS.filter(o => o.status === 'completed' || o.status === 'shipped');
  else if (filter === 'cancelled') filtered = ORDERS.filter(o => o.status === 'cancelled' || o.status === 'no_stock');
  document.getElementById('order-list-container').innerHTML = filtered.map(o => orderListItem(o)).join('') || '<div class="empty-state"><div class="empty-icon">📦</div><div class="empty-text">該当する発注はありません</div></div>';
}

// -- Order Detail (Contractor) --
function init_order_detail(opts) {
  const order = ORDERS.find(o => o.id === opts.orderId) || ORDERS[0];
  const el = document.getElementById('screen-order-detail');
  const st = ORDER_STATUSES.find(s => s.key === order.status);
  const statusIndex = ORDER_STATUSES.findIndex(s => s.key === order.status);
  const mainSteps = ORDER_STATUSES.filter(s => !['no_stock','cancelled'].includes(s.key));

  el.innerHTML = `
    <div class="progress-steps">
      ${mainSteps.map((s, i) => {
        const done = i < statusIndex;
        const active = s.key === order.status;
        return `
          ${i > 0 ? `<div class="progress-line ${done ? 'done' : ''}"></div>` : ''}
          <div class="progress-step ${done ? 'done' : ''} ${active ? 'active' : ''}">
            <div class="step-dot">${done ? '✓' : i + 1}</div>
            <span>${s.label}</span>
          </div>`;
      }).join('')}
    </div>
    <div class="page-section">
      <!-- Order info -->
      <div class="card">
        <div class="card-body">
          <div class="flex justify-between items-center mb-8">
            <span style="font-size:13px;color:var(--gray-500)">${order.id}</span>
            <span class="status-badge ${st.css}">${st.label}</span>
          </div>
          <div style="font-size:16px;font-weight:700;margin-bottom:4px">${order.partName}</div>
          <div style="font-size:14px;color:var(--gray-600)">${order.makerName || ''} ${order.airconModel}</div>
          ${order.quantity ? `<div style="font-size:13px;color:var(--gray-500);margin-top:4px">数量: ${order.quantity}</div>` : ''}
          ${order.notes ? `<div style="font-size:13px;color:var(--gray-600);margin-top:8px;padding:8px;background:var(--gray-50);border-radius:var(--radius-sm)">💬 ${order.notes}</div>` : ''}
        </div>
      </div>

      <!-- Reply from staff -->
      ${order.replyComment ? `
      <div class="section-title mt-16">仲介からの返信</div>
      <div class="card" style="border-left:4px solid var(--primary)">
        <div class="card-body">
          <p style="font-size:14px;line-height:1.6;margin-bottom:12px">${order.replyComment}</p>
          ${order.quotePrice ? `
          <div style="font-size:13px;margin-bottom:8px">
            <strong>見積金額:</strong> <span style="font-size:18px;font-weight:700;color:var(--primary)">¥${order.quotePrice.toLocaleString()}</span>
          </div>` : ''}
          ${order.stockStatus === 'available' ? '<div style="font-size:13px"><strong>在庫:</strong> <span style="color:var(--success)">あり</span></div>' : ''}
          ${order.stockStatus === 'unavailable' ? '<div style="font-size:13px"><strong>在庫:</strong> <span style="color:var(--danger)">なし</span></div>' : ''}
          ${order.bankInfo ? `
          <div class="bank-info mt-8">
            <strong>振込先:</strong><br>
            ${order.bankInfo.bank} ${order.bankInfo.branch}<br>
            ${order.bankInfo.type} ${order.bankInfo.number}<br>
            名義: ${order.bankInfo.holder}
          </div>` : ''}
        </div>
      </div>` : ''}

      <!-- Transfer button -->
      ${(order.status === 'quoted' || order.status === 'wait_transfer') && !order.transferReportedAt ? `
      <button class="btn btn-success btn-block btn-lg mt-16" onclick="reportTransfer('${order.id}')">💴 振込完了を報告する</button>
      <p class="text-muted text-center mt-8" style="font-size:11px">振込完了後にこのボタンを押してください。仲介スタッフに通知されます。</p>
      ` : ''}
      ${order.transferReportedAt ? `
      <div class="card mt-16" style="background:#e8f5e9;border:1px solid #c8e6c9">
        <div class="card-body text-center">
          <div style="font-size:24px;margin-bottom:4px">✅</div>
          <div style="font-weight:600;color:#2e7d32">振込完了報告済み</div>
          <div style="font-size:12px;color:#558b2f;margin-top:4px">${order.transferReportedAt}</div>
        </div>
      </div>` : ''}

      <!-- Timeline -->
      <div class="section-title mt-16">履歴</div>
      <div class="timeline">
        ${order.timeline.map(t => `
          <div class="timeline-item">
            <div class="timeline-dot active">${t.icon}</div>
            <div class="timeline-content">
              <div class="timeline-label">${t.action}</div>
              <div class="timeline-time">${t.time} - ${t.actor}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
}
function reportTransfer(orderId) {
  showModal('振込完了報告', '振込が完了したことを仲介スタッフに報告します。よろしいですか？', [
    { label: 'キャンセル' },
    { label: '報告する', class: 'btn-success', action: () => {
      showToast('振込完了を報告しました', 'success');
      const order = ORDERS.find(o => o.id === orderId);
      if (order) {
        order.transferReportedAt = '2024-12-16 12:00';
        order.status = 'transferred';
        order.timeline.push({ time: '2024-12-16 12:00', actor: '田中 太郎', action: '振込完了を報告', icon: '✅' });
      }
      navigateTo('order-detail', { orderId, replace: true });
    }}
  ]);
}

// -- Video List --
function init_video_list() {
  const el = document.getElementById('screen-video-list');
  const isPremium = USERS.contractor.plan === 'premium';
  el.innerHTML = `
    <div class="search-bar">
      <input class="search-input" placeholder="動画を検索...">
    </div>
    <div class="chip-row">
      ${VIDEO_CATEGORIES.map((c,i) => `<button class="chip ${i===0?'active':''}" onclick="filterVideos(this,'${c}')">${c}</button>`).join('')}
    </div>
    <div class="page-section" id="video-list-container">
      ${VIDEOS.map(v => videoCard(v, isPremium)).join('')}
    </div>
    ${!isPremium ? `
    <div style="position:fixed;bottom:calc(var(--tab-height) + 16px);left:50%;transform:translateX(-50%);max-width:398px;width:calc(100% - 32px);z-index:50">
      <div style="background:linear-gradient(135deg,var(--primary),#6c63ff);color:#fff;padding:14px 20px;border-radius:var(--radius);box-shadow:var(--shadow-lg);display:flex;align-items:center;gap:12px;cursor:pointer" onclick="navigateTo('video-paywall')">
        <span style="font-size:24px">🔓</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">プレミアム会員になる</div>
          <div style="font-size:12px;opacity:.8">すべての動画が見放題</div>
        </div>
        <span>→</span>
      </div>
    </div>` : ''}
  `;
}
function videoCard(v, isPremium) {
  return `
    <div class="video-card" onclick="${isPremium ? `navigateTo('video-detail',{videoId:${v.id}})` : `navigateTo('video-paywall')`}">
      <div class="video-thumb" style="background:linear-gradient(135deg,var(--gray-300),var(--gray-200))">
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--gray-500);font-size:36px">🎬</div>
        <span class="video-duration">${v.duration}</span>
        ${!isPremium ? '<div class="video-lock">🔒</div>' : ''}
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">${v.category} • ${v.duration}</div>
      </div>
    </div>`;
}
function filterVideos(btn, cat) {
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const isPremium = currentUser && USERS[currentUser]?.plan === 'premium';
  const filtered = cat === 'すべて' ? VIDEOS : VIDEOS.filter(v => v.category === cat);
  document.getElementById('video-list-container').innerHTML = filtered.map(v => videoCard(v, isPremium)).join('');
}

// -- Video Detail --
function init_video_detail(opts) {
  const video = VIDEOS.find(v => v.id === opts.videoId) || VIDEOS[0];
  const el = document.getElementById('screen-video-detail');
  el.innerHTML = `
    <div class="player-container">
      <button class="play-btn" onclick="showToast('動画を再生します（モック）')">▶</button>
    </div>
    <div class="page-section">
      <h2 style="font-size:17px;font-weight:700;margin-bottom:4px">${video.title}</h2>
      <p class="text-muted" style="font-size:13px">${video.category} • ${video.duration}</p>
      <div style="margin-top:16px;padding:12px;background:#fff3e0;border-radius:var(--radius-sm);font-size:12px;color:#e65100">
        ⚠️ <strong>画面録画について:</strong> 本アプリのコンテンツは著作権で保護されています。画面録画は技術的に完全には防止できませんが、不正な録画・配布は利用規約違反となり、アカウント停止の対象となります。
      </div>
    </div>
  `;
}

// -- Video Paywall --
function init_video_paywall() {
  const el = document.getElementById('screen-video-paywall');
  el.innerHTML = `
    <div class="page-section text-center" style="padding-top:24px">
      <div style="font-size:64px;margin-bottom:8px">🎬</div>
      <h2 style="font-size:22px;font-weight:700;margin-bottom:4px">プレミアムプラン</h2>
      <p class="text-muted" style="font-size:14px;margin-bottom:24px">技術動画が見放題</p>

      <div class="plan-card selected">
        <div class="plan-name">個人プラン</div>
        <div class="plan-price">¥980<span style="font-size:14px;font-weight:400">/月</span></div>
        <div class="plan-desc">1アカウント・同時1端末</div>
        <div class="plan-features">
          ✓ 技術動画 全${VIDEOS.length}本以上が見放題<br>
          ✓ 新着動画の通知<br>
          ✓ オフライン再生（一部対応）
        </div>
      </div>

      <div class="plan-card" onclick="this.classList.add('selected');this.previousElementSibling.classList.remove('selected')">
        <div class="plan-name">法人プラン</div>
        <div class="plan-price">¥4,980<span style="font-size:14px;font-weight:400">/月</span></div>
        <div class="plan-desc">5アカウントまで・同時3端末</div>
        <div class="plan-features">
          ✓ 個人プランの全機能<br>
          ✓ 複数アカウント管理<br>
          ✓ 請求書払い対応
        </div>
      </div>

      <button class="btn btn-primary btn-block btn-lg mt-16" onclick="showToast('App Store / Google Play の課金画面へ遷移します（モック）')">
        月額プランに登録する
      </button>
      <p class="text-muted mt-8" style="font-size:11px">
        Apple ID / Google アカウントでのお支払い<br>
        いつでもキャンセル可能
      </p>
    </div>
  `;
}

// -- Plan --
function init_plan() {
  const el = document.getElementById('screen-plan');
  const user = currentUser ? USERS[currentUser] : null;
  el.innerHTML = `
    <div class="page-section">
      <div class="card">
        <div class="card-body">
          <div class="section-title" style="margin-bottom:4px">現在のプラン</div>
          <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">
            ${user?.plan === 'premium' ? 'プレミアム（個人）' : '無料プラン'}
          </div>
          <div class="text-muted" style="font-size:13px">
            ${user?.plan === 'premium' ? '次回更新日: 2025年1月15日 • iOS サブスクリプション' : '動画視聴にはプレミアムプランが必要です'}
          </div>
        </div>
      </div>

      <div class="section-title mt-16">プランを変更</div>
      <div class="plan-card ${user?.plan !== 'premium' ? 'selected' : ''}">
        <div class="plan-name">無料</div>
        <div class="plan-price">¥0</div>
        <div class="plan-desc">部品発注のみ</div>
      </div>
      <div class="plan-card ${user?.plan === 'premium' ? 'selected' : ''}">
        <div class="plan-name">個人プレミアム</div>
        <div class="plan-price">¥980<span style="font-size:14px;font-weight:400">/月</span></div>
        <div class="plan-desc">動画見放題 • 1端末</div>
      </div>
      <div class="plan-card">
        <div class="plan-name">法人プレミアム</div>
        <div class="plan-price">¥4,980<span style="font-size:14px;font-weight:400">/月</span></div>
        <div class="plan-desc">動画見放題 • 5アカウント • 3端末</div>
      </div>

      <button class="btn btn-outline btn-block mt-16" onclick="showToast('App Store / Google Play の管理画面へ遷移します（モック）')">
        サブスクリプションを管理
      </button>
      <p class="text-muted text-center mt-8" style="font-size:11px">
        課金の管理はApp Store / Google Playの設定から行えます
      </p>
    </div>
  `;
}

// -- Device Error --
function init_device_error() {
  const el = document.getElementById('screen-device-error');
  el.innerHTML = `
    <div class="page-section text-center" style="padding-top:40px">
      <div style="font-size:64px;margin-bottom:16px">📱</div>
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;color:var(--danger)">別端末で使用中です</h2>
      <p class="text-muted" style="font-size:14px;margin-bottom:24px;line-height:1.6">
        このアカウントは現在、別の端末でログイン中です。<br>
        同時に利用できる端末は1台までです。
      </p>
      <div class="card" style="text-align:left">
        <div class="card-body">
          <div style="font-size:13px;color:var(--gray-500);margin-bottom:8px">現在ログイン中の端末</div>
          <div class="flex items-center gap-12">
            <span style="font-size:24px">📱</span>
            <div>
              <div style="font-weight:600">iPhone 15 Pro</div>
              <div style="font-size:12px;color:var(--gray-500)">最終利用: 2024/12/16 10:30</div>
            </div>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-block btn-lg mt-16" onclick="showDeviceSwitchConfirm()">
        この端末に切り替える
      </button>
      <button class="btn btn-secondary btn-block mt-8" onclick="goBack()">
        戻る
      </button>
    </div>
  `;
}
function showDeviceSwitchConfirm() {
  showModal(
    '端末を切り替えますか？',
    '現在ログイン中の端末（iPhone 15 Pro）は自動的にログアウトされます。',
    [
      { label: 'キャンセル' },
      { label: '切り替える', class: 'btn-primary', action: () => {
        showToast('端末を切り替えました', 'success');
        navigateTo('home');
      }}
    ]
  );
}

// ===== STAFF SCREENS =====

// -- Staff Dashboard --
function init_staff_dashboard() {
  const newOrders = ORDERS.filter(o => o.status === 'new').length;
  const checking = ORDERS.filter(o => o.status === 'checking').length;
  const waitTransfer = ORDERS.filter(o => ['wait_transfer','quoted'].includes(o.status)).length;
  const transferred = ORDERS.filter(o => o.status === 'transferred').length;

  const el = document.getElementById('screen-staff-dashboard');
  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card" onclick="navigateTo('staff-orders',{filter:'new'})" style="cursor:pointer">
        <div class="stat-number" style="color:var(--danger)">${newOrders}</div>
        <div class="stat-label">新規依頼</div>
      </div>
      <div class="stat-card" onclick="navigateTo('staff-orders',{filter:'checking'})" style="cursor:pointer">
        <div class="stat-number" style="color:var(--warning)">${checking}</div>
        <div class="stat-label">確認中</div>
      </div>
      <div class="stat-card" onclick="navigateTo('staff-orders',{filter:'wait_transfer'})" style="cursor:pointer">
        <div class="stat-number" style="color:var(--info)">${waitTransfer}</div>
        <div class="stat-label">振込待ち</div>
      </div>
      <div class="stat-card" onclick="navigateTo('staff-orders',{filter:'transferred'})" style="cursor:pointer">
        <div class="stat-number" style="color:var(--success)">${transferred}</div>
        <div class="stat-label">振込完了</div>
      </div>
    </div>

    <div class="page-section">
      <div class="section-title">新着通知</div>
      <div class="card">
        ${STAFF_NOTIFICATIONS.slice(0,3).map(n => `
          <div class="notif-item ${n.unread ? 'unread' : ''}">
            <span class="notif-dot ${n.unread ? '' : 'read'}"></span>
            <div class="notif-body">
              <div class="notif-title">${n.title}</div>
              <div class="notif-desc">${n.desc}</div>
              <div class="notif-time">${n.time}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div class="page-section">
      <div class="section-title">最近の依頼</div>
      ${ORDERS.slice(0,3).map(o => staffOrderListItem(o)).join('')}
      <button class="btn btn-outline btn-block mt-8" onclick="navigateTo('staff-orders')">すべての依頼を見る</button>
    </div>
  `;
}

// -- Staff Orders --
function init_staff_orders(opts) {
  const el = document.getElementById('screen-staff-orders');
  const filter = opts?.filter || 'all';
  el.innerHTML = `
    <div class="search-bar">
      <input class="search-input" placeholder="ID・型番・部品名で検索...">
    </div>
    <div class="chip-row" id="staff-order-chips">
      <button class="chip ${filter==='all'?'active':''}" onclick="filterStaffOrders(this,'all')">すべて</button>
      <button class="chip ${filter==='new'?'active':''}" onclick="filterStaffOrders(this,'new')">新規</button>
      <button class="chip ${filter==='checking'?'active':''}" onclick="filterStaffOrders(this,'checking')">確認中</button>
      <button class="chip ${filter==='quoted'?'active':''}" onclick="filterStaffOrders(this,'quoted')">見積提示</button>
      <button class="chip ${filter==='wait_transfer'?'active':''}" onclick="filterStaffOrders(this,'wait_transfer')">振込待ち</button>
      <button class="chip ${filter==='transferred'?'active':''}" onclick="filterStaffOrders(this,'transferred')">振込完了</button>
      <button class="chip ${filter==='ordered'?'active':''}" onclick="filterStaffOrders(this,'ordered')">発注済</button>
      <button class="chip ${filter==='shipped'?'active':''}" onclick="filterStaffOrders(this,'shipped')">発送済</button>
    </div>
    <div class="page-section" id="staff-order-list">
      ${renderStaffOrderList(filter)}
    </div>
  `;
}
function staffOrderListItem(o) {
  const st = ORDER_STATUSES.find(s => s.key === o.status);
  return `
    <div class="card" onclick="navigateTo('staff-order-detail',{orderId:'${o.id}'})" style="cursor:pointer">
      <div class="card-body">
        <div class="flex justify-between items-center mb-8">
          <span style="font-size:12px;color:var(--gray-500)">${o.id}</span>
          <span class="status-badge ${st.css}">${st.label}</span>
        </div>
        <div style="font-weight:600">${o.partName} - ${o.airconModel}</div>
        <div style="font-size:13px;color:var(--gray-500);margin-top:2px">${o.requester.name}（${o.requester.company}）• ${o.createdAt}</div>
      </div>
    </div>`;
}
function renderStaffOrderList(filter) {
  let filtered = ORDERS;
  if (filter !== 'all') filtered = ORDERS.filter(o => o.status === filter);
  return filtered.map(o => staffOrderListItem(o)).join('') || '<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">該当する依頼はありません</div></div>';
}
function filterStaffOrders(btn, filter) {
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('staff-order-list').innerHTML = renderStaffOrderList(filter);
}

// -- Staff Order Detail --
function init_staff_order_detail(opts) {
  const order = ORDERS.find(o => o.id === opts.orderId) || ORDERS[0];
  const el = document.getElementById('screen-staff-order-detail');
  const st = ORDER_STATUSES.find(s => s.key === order.status);

  el.innerHTML = `
    <div class="page-section">
      <div class="split-layout">
        <!-- Left: Order Info -->
        <div>
          <div class="card">
            <div class="card-header flex justify-between items-center">
              <span>${order.id}</span>
              <span class="status-badge ${st.css}">${st.label}</span>
            </div>
            <div class="card-body">
              <table style="font-size:14px;width:100%;line-height:2">
                <tr><td style="color:var(--gray-500);width:100px">依頼者</td><td><strong>${order.requester.name}</strong>（${order.requester.company}）</td></tr>
                <tr><td style="color:var(--gray-500)">型番</td><td>${order.airconModel}</td></tr>
                <tr><td style="color:var(--gray-500)">部品名</td><td>${order.partName}</td></tr>
                <tr><td style="color:var(--gray-500)">メーカー</td><td>${order.makerName || '未指定'}</td></tr>
                <tr><td style="color:var(--gray-500)">数量</td><td>${order.quantity || '未指定'}</td></tr>
                <tr><td style="color:var(--gray-500)">依頼日</td><td>${order.createdAt}</td></tr>
              </table>
              ${order.notes ? `<div style="margin-top:12px;padding:10px;background:var(--gray-50);border-radius:var(--radius-sm);font-size:13px">💬 ${order.notes}</div>` : ''}
            </div>
          </div>

          <!-- Timeline -->
          <div class="section-title mt-16">更新履歴</div>
          <div class="timeline">
            ${order.timeline.map(t => `
              <div class="timeline-item">
                <div class="timeline-dot active">${t.icon}</div>
                <div class="timeline-content">
                  <div class="timeline-label">${t.action}</div>
                  <div class="timeline-time">${t.time} - ${t.actor}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Right: Reply Form -->
        <div>
          <div class="card">
            <div class="card-header">返信・ステータス更新</div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label">ステータス変更</label>
                <select class="form-select" id="staff-status-select">
                  ${ORDER_STATUSES.map(s => `<option value="${s.key}" ${s.key === order.status ? 'selected' : ''}>${s.label}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">在庫状況</label>
                <select class="form-select">
                  <option value="">選択してください</option>
                  <option ${order.stockStatus==='available'?'selected':''}>あり</option>
                  <option ${order.stockStatus==='unavailable'?'selected':''}>なし</option>
                  <option>確認中</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">見積金額（税込）</label>
                <input class="form-input" type="number" placeholder="例: 45000" value="${order.quotePrice || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">振込先情報</label>
                <textarea class="form-textarea" placeholder="銀行名 / 支店 / 種別 / 口座番号 / 名義">${order.bankInfo ? `${order.bankInfo.bank} ${order.bankInfo.branch}\n${order.bankInfo.type} ${order.bankInfo.number}\n名義: ${order.bankInfo.holder}` : ''}</textarea>
              </div>
              <div class="form-group">
                <label class="form-label">コメント</label>
                <textarea class="form-textarea" placeholder="業者への返信コメント">${order.replyComment || ''}</textarea>
              </div>
              <button class="btn btn-primary btn-block" onclick="showToast('更新しました','success')">更新して通知を送信</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -- Staff Content --
function init_staff_content() {
  const el = document.getElementById('screen-staff-content');
  el.innerHTML = `
    <div class="page-section">
      <div class="section-title">コンテンツ管理</div>
      <div class="card">
        <div class="list-item" onclick="showToast('試運転記事の管理画面（モック）')">
          <span class="list-icon" style="background:var(--primary-light)">📄</span>
          <div class="list-body">
            <div class="list-title">リモコン試運転 記事管理</div>
            <div class="list-subtitle">${OFFLINE_ARTICLES.length}件の記事</div>
          </div>
          <span class="list-chevron">›</span>
        </div>
        <div class="list-item" onclick="showToast('エラーコードの管理画面（モック）')">
          <span class="list-icon" style="background:#fff3e0">⚠️</span>
          <div class="list-body">
            <div class="list-title">エラーコード管理</div>
            <div class="list-subtitle">${ERROR_CODES.length}件のエラーコード</div>
          </div>
          <span class="list-chevron">›</span>
        </div>
        <div class="list-item" onclick="showToast('動画の管理画面（モック）')">
          <span class="list-icon" style="background:#e8f5e9">🎬</span>
          <div class="list-body">
            <div class="list-title">動画管理</div>
            <div class="list-subtitle">${VIDEOS.length}件の動画</div>
          </div>
          <span class="list-chevron">›</span>
        </div>
        <div class="list-item" onclick="showToast('図面リンクの管理画面（モック）')">
          <span class="list-icon" style="background:#f3e5f5">📐</span>
          <div class="list-body">
            <div class="list-title">図面リンク管理</div>
            <div class="list-subtitle">${MANUFACTURER_LINKS.length}件のリンク</div>
          </div>
          <span class="list-chevron">›</span>
        </div>
      </div>

      <div class="section-title mt-16">コンテンツ管理の例（試運転記事）</div>
      <div class="card">
        <div class="card-body">
          <div class="flex justify-between items-center mb-16">
            <span style="font-weight:600">記事一覧</span>
            <button class="btn btn-primary btn-sm" onclick="showToast('新規作成画面（モック）')">＋ 新規作成</button>
          </div>
          ${OFFLINE_ARTICLES.slice(0,3).map(a => `
            <div class="list-item" style="border:1px solid var(--gray-200);border-radius:var(--radius-sm);margin-bottom:8px">
              <div class="list-body">
                <div class="list-title">${a.title}</div>
                <div class="list-subtitle">${a.category} • 更新: ${a.updatedAt}</div>
              </div>
              <div class="flex gap-8">
                <button class="btn btn-sm btn-secondary" onclick="showToast('編集画面（モック）')">編集</button>
                <button class="btn btn-sm btn-danger" onclick="showToast('削除確認（モック）')">削除</button>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('home');
});
