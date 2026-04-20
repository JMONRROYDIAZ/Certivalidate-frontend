const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(message, statusCode, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

const getToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (token, refreshToken) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

const request = async (endpoint, options = {}) => {
  const { body, method = 'GET', auth = true, raw = false, headers: extraHeaders = {} } = options;

  const headers = { ...extraHeaders };
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  let res = await fetch(`${API_BASE}${endpoint}`, config);

  // Auto-refresh on 401
  if (res.status === 401 && auth && getRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: getRefreshToken() }),
        });
        const refreshData = await refreshRes.json();
        if (refreshRes.ok && refreshData.success) {
          setTokens(refreshData.data.token, refreshData.data.refreshToken);
          onRefreshed(refreshData.data.token);
          isRefreshing = false;
          // Retry original request
          headers['Authorization'] = `Bearer ${refreshData.data.token}`;
          res = await fetch(`${API_BASE}${endpoint}`, { ...config, headers });
        } else {
          clearTokens();
          window.location.href = '/login';
          throw new ApiError('Sesión expirada', 401);
        }
      } catch (err) {
        isRefreshing = false;
        clearTokens();
        window.location.href = '/login';
        throw err;
      }
    } else {
      // Wait for token refresh
      return new Promise((resolve) => {
        addRefreshSubscriber(async (newToken) => {
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryRes = await fetch(`${API_BASE}${endpoint}`, { ...config, headers });
          resolve(retryRes);
        });
      });
    }
  }

  if (raw) return res;

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new ApiError(data.message || 'Error desconocido', res.status, data);
  }

  return data;
};

export { request, getToken, getRefreshToken, setTokens, clearTokens, ApiError, API_BASE };
