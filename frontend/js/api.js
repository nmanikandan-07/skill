/* ============================================
   SkillSync – API Client
   ============================================ */

const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('skillsync_token');
  }

  setToken(token) {
    localStorage.setItem('skillsync_token', token);
  }

  removeToken() {
    localStorage.removeItem('skillsync_token');
    localStorage.removeItem('skillsync_user');
  }

  getUser() {
    const user = localStorage.getItem('skillsync_user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user) {
    localStorage.setItem('skillsync_user', JSON.stringify(user));
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: { ...headers, ...options.headers }
    };

    if (options.body && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
          if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
            window.location.href = '/pages/login.html';
          }
        }
        throw { status: response.status, message: data.message || 'Something went wrong', errors: data.errors };
      }

      return data;
    } catch (error) {
      if (error.status) throw error;
      throw { status: 0, message: 'Network error. Please check your connection.' };
    }
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); }
  delete(endpoint, body) { return this.request(endpoint, { method: 'DELETE', body }); }
  
  upload(endpoint, formData) {
    return this.request(endpoint, { method: 'PUT', body: formData });
  }
}

const api = new ApiClient();

// Toast notification system
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 4000) {
    this.init();
    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    const titles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        <div class="toast-title">${titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    this.container.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  warning(msg) { this.show(msg, 'warning'); },
  info(msg) { this.show(msg, 'info'); }
};

// Auth guard - redirect to login if not authenticated
function requireAuth() {
  if (!api.isAuthenticated()) {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
}

// Format date helpers
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateStr);
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Debounce utility
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
