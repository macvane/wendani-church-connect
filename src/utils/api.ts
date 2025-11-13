const API_BASE_URL = 'https://churchmedia.kahawawendanisda.org';

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

  detail: async (slug: string) => {
    return apiRequest(`/form/events/detail/${slug}/`);
  },

  create: async (formData: FormData) => {
    return apiRequest('/form/events/', {
      method: 'POST',
      body: formData,
    });
  },

  update: async (slug: string, formData: FormData) => {
    return apiRequest(`/form/events/update/${slug}/`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (slug: string) => {
    return apiRequest(`/form/events/update/${slug}/`, { method: 'DELETE' });
  },
};

// Baptism (Dedications) APIs
export const baptismAPI = {
  create: async (data: {
    full_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    is_baptised: boolean;
    is_study: boolean;
    additional_information?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/form/baptism/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  },

  list: async () => {
    return apiRequest('/form/baptism/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/baptism/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return apiRequest(`/form/baptism/${id}/status_update/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/form/baptism/${id}/`, { method: 'DELETE' });
  },
};

// Child Dedication APIs
export const dedicationAPI = {
  create: async (data: {
    child_full_name: string;
    date_birth: string;
    gender: string;
    father_full_name: string;
    father_email?: string;
    father_phone_number: string;
    mother_full_name: string;
    mother_email?: string;
    mother_phone_number: string;
    additional_information?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/form/dedication/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  },

  list: async () => {
    return apiRequest('/form/dedication/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/dedication/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return apiRequest(`/form/dedication/${id}/status_update/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/form/dedication/${id}/`, { method: 'DELETE' });
  },
};

// Membership Transfer APIs
export const membershipAPI = {
  create: async (data: {
    full_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    physical_address: string;
    from_church_name: string;
    from_district_name: string;
    from_conference_name: string;
    from_address: string;
    to_church_name: string;
    to_district_name: string;
    to_conference_name: string;
    to_address: string;
    additional_notes?: string;
    board_minute_number: string;
    first_reading_date?: string;
    second_reading_date?: string;
    business_number?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/form/membership/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  },

  list: async () => {
    return apiRequest('/form/membership/list/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/membership/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return apiRequest(`/form/membership/${id}/status_update/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/form/membership/${id}/`, { method: 'DELETE' });
  },
};

// Benevolence APIs
export const benevolenceAPI = {
  create: async (data: {
    head_full_name: string;
    head_phone_number: string;
    email: string;
    membership_status: string;
    spouse_name?: string;
    church_name?: string;
    additional?: string;
    dependents: Array<{
      name: string;
      phone_number: string;
      relationship: string;
    }>;
  }) => {
    const response = await fetch(`${API_BASE_URL}/form/benevolence/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  },

  list: async () => {
    return apiRequest('/form/benevolence/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/benevolence/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return apiRequest(`/form/benevolence/${id}/status_update/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/form/benevolence/${id}/`, { method: 'DELETE' });
  },
};

// Contact Form APIs
export const contactAPI = {
  create: async (data: {
    full_name: string;
    email?: string;
    phone_number: string;
    subject: string;
    message: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/form/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  },

  list: async () => {
    return apiRequest('/form/contact/list/');
  },

  detail: async (id: number) => {
    return apiRequest(`/form/contact/${id}/`);
  },

  delete: async (id: number) => {
    return apiRequest(`/form/contact/${id}/`, { method: 'DELETE' });
  },
};

// M-Pesa Payment APIs
export const mpesaAPI = {
  initiatePayment: async (data: {
    name: string;
    phone_number: string;
    email?: string;
    purpose: string;
    other_purpose_details?: string;
    amount: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/mpesa/initiate-payment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response;
  },

  listTransactions: async () => {
    return apiRequest('/api/v1/mpesa/transactions/');
  },

  transactionDetail: async (id: number) => {
    return apiRequest(`/api/v1/mpesa/transactions/${id}/`);
  },
};
