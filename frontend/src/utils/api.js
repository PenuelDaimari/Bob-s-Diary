const API = import.meta.env.VITE_API_BASE_URL;

let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export async function apiFetch(path, opts = {}, isRetry = false) {
  const isFormData = opts.body instanceof FormData;

  const headers = { 
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(opts.headers || {}) 
  };

  if (inMemoryAccessToken) {
    headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  const body = opts.body 
    ? (isFormData ? opts.body : JSON.stringify(opts.body)) 
    : undefined;

  let res = await fetch(API + path, {
    credentials: 'include',
    ...opts,
    headers,
    body,
  });

  if (res.status === 401 && !isRetry && path !== '/auth/login' && path !== '/auth/refresh-token') {
    try {
      const refreshRes = await fetch(`${API}/auth/refresh-token`, { 
        method: 'GET', 
        credentials: 'include' 
      });
      
      if (!refreshRes.ok) throw new Error('Session expired');

      const refreshData = await refreshRes.json();
      setAccessToken(refreshData.accessToken);

      return apiFetch(path, opts, true); 
    } catch (refreshError) {
      setAccessToken(null);
      throw new Error('Session expired. Please log in again.');
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
  
  return data;
}

export function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}