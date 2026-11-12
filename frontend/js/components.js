/* ============================================
   SkillSync – Shared Components (JS)
   ============================================ */

function renderSidebar(activePage = '') {
  const user = api.getUser();
  const initials = user ? getInitials(user.fullName) : '?';
  const avatarHtml = user && user.profileImage
    ? `<img src="${user.profileImage}" alt="${user.fullName}">`
    : initials;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/pages/dashboard.html' },
    { id: 'explore', label: 'Explore Skills', icon: '🔍', href: '/pages/explore-skills.html' },
    { id: 'my-skills', label: 'My Skills', icon: '🎯', href: '/pages/my-skills.html' },
    { id: 'matches', label: 'Matches', icon: '🤝', href: '/pages/matches.html' },
    { id: 'requests', label: 'Requests', icon: '📨', href: '/pages/requests.html' },
    { id: 'sessions', label: 'Sessions', icon: '📅', href: '/pages/sessions.html' },
    { id: 'messages', label: 'Messages', icon: '💬', href: '/pages/messages.html' },
    { id: 'progress', label: 'Progress', icon: '📈', href: '/pages/progress.html' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼', href: '/pages/portfolio.html' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', href: '/pages/notifications.html' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/pages/settings.html' }
  ];

  const sidebarHtml = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">S</div>
        <div class="logo-text">Skill<span>Sync</span></div>
      </div>
      <nav class="sidebar-nav">
        <div class="sidebar-section">
          <div class="sidebar-section-title">Main Menu</div>
          ${navItems.slice(0, 3).map(item => `
            <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Exchange</div>
          ${navItems.slice(3, 7).map(item => `
            <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
              ${item.id === 'messages' ? '<span class="nav-badge" id="sidebarMsgBadge" style="display:none; margin-left:auto;"></span>' : ''}
            </a>
          `).join('')}
        </div>
        <div class="sidebar-section">
          <div class="sidebar-section-title">Personal</div>
          ${navItems.slice(7).map(item => `
            <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </div>
      </nav>
      <div class="sidebar-footer">
        <a href="/pages/profile.html" class="sidebar-user" title="View Profile">
          <div class="sidebar-user-avatar">${avatarHtml}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${user?.fullName || 'User'}</div>
            <div class="sidebar-user-role">${user?.department || 'Student'}${user?.year ? ' • ' + user.year : ''}</div>
          </div>
        </a>
        <div class="sidebar-logout">
          <button class="nav-item" onclick="openLogoutModal()">
            <span class="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  `;

  return sidebarHtml;
}

function renderTopNav(pageTitle = '') {
  const user = api.getUser();
  const initials = user ? getInitials(user.fullName) : '?';
  const avatarHtml = user && user.profileImage
    ? `<img src="${user.profileImage}" alt="${user.fullName}">`
    : initials;

  return `
    <header class="top-navbar" id="topNavbar">
      <button class="sidebar-toggle" id="sidebarToggle" onclick="toggleSidebar()">☰</button>
      <h2 class="navbar-title">${pageTitle}</h2>
      <div class="navbar-search">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search skills, people, sessions..." id="globalSearch">
      </div>
      <div class="navbar-actions">
        <a href="/pages/notifications.html" class="navbar-icon-btn" id="navNotifBtn">
          🔔
          <span class="badge-dot" id="notifDot" style="display:none;"></span>
        </a>
        <a href="/pages/messages.html" class="navbar-icon-btn" style="position:relative;">
          💬
          <span class="badge-dot" id="msgDot" style="display:none; position:absolute; top:4px; right:4px;"></span>
        </a>
        <div class="navbar-divider"></div>
        <a href="/pages/profile.html" class="navbar-user" title="View Profile">
          <div class="navbar-avatar">${avatarHtml}</div>
        </a>
      </div>
    </header>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>
  `;
}

function renderAuthenticatedLayout(pageTitle, activePage, contentHtml) {
  return `
    ${renderSidebar(activePage)}
    <div class="main-wrapper">
      ${renderTopNav(pageTitle)}
      <main class="main-content">
        ${contentHtml}
      </main>
    </div>
    
    <!-- Logout Confirmation Modal -->
    <div id="logoutModalOverlay" class="modal-overlay" onclick="closeLogoutModalOnBackdrop(event)">
      <div class="modal logout-modal">
        <div class="modal-header">
          <h3>Sign Out?</h3>
          <button class="modal-close" onclick="closeLogoutModal()">✕</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to log out of your SkillSync account?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeLogoutModal()">Cancel</button>
          <button class="btn btn-danger" onclick="confirmLogout()">Log Out</button>
        </div>
      </div>
    </div>
  `;
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

// LOGOUT CONFIRMATION MODAL FUNCTIONS
function openLogoutModal() {
  const modal = document.getElementById('logoutModalOverlay');
  if (modal) {
    modal.classList.add('active');
    window.addEventListener('keydown', handleLogoutEscape);
  }
}

function closeLogoutModal() {
  const modal = document.getElementById('logoutModalOverlay');
  if (modal) {
    modal.classList.remove('active');
    window.removeEventListener('keydown', handleLogoutEscape);
  }
}

function closeLogoutModalOnBackdrop(event) {
  if (event.target.id === 'logoutModalOverlay') {
    closeLogoutModal();
  }
}

function handleLogoutEscape(event) {
  if (event.key === 'Escape') {
    closeLogoutModal();
  }
}

async function confirmLogout() {
  closeLogoutModal();
  await handleLogout();
}

async function handleLogout() {
  try {
    await api.post('/auth/logout');
  } catch (e) {}
  api.removeToken();
  window.location.href = '/pages/login.html';
}

function renderEmptyState(icon, title, description, actionLabel, actionHref) {
  return `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${description}</p>
      ${actionLabel ? `<a href="${actionHref}" class="btn btn-primary">${actionLabel}</a>` : ''}
    </div>
  `;
}

function renderMatchRing(percentage) {
  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (percentage / 100) * circumference;
  return `
    <div class="match-ring">
      <svg viewBox="0 0 52 52">
        <circle class="ring-bg" cx="26" cy="26" r="22"/>
        <circle class="ring-value" cx="26" cy="26" r="22"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
      </svg>
      <div class="ring-text">${percentage}%</div>
    </div>
  `;
}

function renderStarRating(rating, interactive = false) {
  let html = '<div class="star-rating">';
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating) ? 'filled' : '';
    html += `<span class="star ${filled}" data-value="${i}" ${interactive ? 'onclick="setRating(this)"' : ''}>★</span>`;
  }
  html += '</div>';
  return html;
}

function renderAvatar(user, size = 'md') {
  if (!user) return `<div class="avatar avatar-${size}">?</div>`;
  const initials = getInitials(user.fullName);
  if (user.profileImage) {
    return `<div class="avatar avatar-${size}"><img src="${user.profileImage}" alt="${user.fullName}"></div>`;
  }
  return `<div class="avatar avatar-${size}">${initials}</div>`;
}

function renderSkeletonCards(count = 4) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text-sm"></div>
      </div>
    `;
  }
  return html;
}

// Check notification count
async function checkNotificationCount() {
  try {
    const data = await api.get('/notifications?limit=1');
    const dot = document.getElementById('notifDot');
    if (dot) {
      dot.style.display = data.unreadCount > 0 ? 'block' : 'none';
    }
  } catch (e) {}
}

// Check unread messages count
async function checkUnreadMessagesCount() {
  try {
    const data = await api.get('/messages/conversations');
    if (data.conversations) {
      const totalUnread = data.conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      const msgDot = document.getElementById('msgDot');
      const sidebarBadge = document.getElementById('sidebarMsgBadge');
      if (msgDot) {
        msgDot.style.display = totalUnread > 0 ? 'block' : 'none';
      }
      if (sidebarBadge) {
        if (totalUnread > 0) {
          sidebarBadge.textContent = totalUnread;
          sidebarBadge.style.display = 'inline-flex';
        } else {
          sidebarBadge.style.display = 'none';
        }
      }
    }
  } catch (e) {}
}

// Initialize authenticated page
function initAuthPage() {
  if (!requireAuth()) return false;
  checkNotificationCount();
  checkUnreadMessagesCount();
  return true;
}
