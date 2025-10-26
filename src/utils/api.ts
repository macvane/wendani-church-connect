const API_BASE_URL = 'https://macvane.pythonanywhere.com';

// Token management
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('isAdminLoggedIn');
};

// API request helper with authentication
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAccessToken();
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const { access } = await refreshResponse.json();
        localStorage.setItem('access_token', access);
        headers['Authorization'] = `Bearer ${access}`;
        
        // Retry original request with new token
        return fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        clearTokens();
        window.location.href = '/admin/login';
      }
    }
  }

  return response;
};

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  logout: async () => {
    const response = await apiRequest('/api/logout/', { method: 'POST' });
    clearTokens();
    return response;
  },

  getProfile: async () => {
    return apiRequest('/api/me/');
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return apiRequest('/api/change-password/', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
  },
};

// Prayer APIs
export const prayerAPI = {
  create: async (data: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    prayer_type: string;
    prayer_request: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/form/prayers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  },

  list: async () => {
    return apiRequest('/form/prayers/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/prayers/${id}/`);
  },

  update: async (id: number, data: { status?: string }) => {
    return apiRequest(`/form/prayers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/form/prayers/${id}/`, { method: 'DELETE' });
  },
};

// Announcements APIs
export const announcementAPI = {
  list: async () => {
    return apiRequest('/form/announcements/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/announcements/${id}/`);
  },

  create: async (formData: FormData) => {
    return apiRequest('/form/announcements/', {
      method: 'POST',
      body: formData,
    });
  },

  update: async (id: number, formData: FormData) => {
    return apiRequest(`/form/announcements/${id}/`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/form/announcements/${id}/`, { method: 'DELETE' });
  },
};

// Events APIs
export const eventAPI = {
  list: async () => {
    return apiRequest('/form/events/list/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/events/${id}/`);
  },

  create: async (formData: FormData) => {
    return apiRequest('/form/events/', {
      method: 'POST',
      body: formData,
    });
  },

  update: async (id: number, formData: FormData) => {
    return apiRequest(`/form/events/${id}/`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/form/events/${id}/`, { method: 'DELETE' });
  },
};
