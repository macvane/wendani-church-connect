const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://churchmedia.kahawawendanisda.org';

/* =========================================================
   TYPES
========================================================= */

type Primitive = string | number | boolean | null | undefined;

export interface ApiErrorPayload {
  detail?: string;
  message?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  status: number;
  payload: ApiErrorPayload | string | null;

  constructor(status: number, message: string, payload: ApiErrorPayload | string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id?: number;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  [key: string]: any;
}

export interface LoginResponse extends Partial<AuthTokens> {
  detail?: string;
  message?: string;
  otp_required?: boolean;
  otp_reference?: string;
  reference?: string;
  [key: string]: any;
}

export interface OtpVerifyPayload {
  email: string;
  otp_code: string;
}

export interface OtpVerifyResponse extends AuthTokens {
  user?: UserProfile;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
  [key: string]: any;
}

/* =========================================================
   TOKEN STORAGE
========================================================= */

const STORAGE_KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
  adminLoggedIn: 'isAdminLoggedIn',
  role: 'user_role',
  userName: 'user_name',
};

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(STORAGE_KEYS.access),
  getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.refresh),

  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(STORAGE_KEYS.access, access);
    localStorage.setItem(STORAGE_KEYS.refresh, refresh);
    localStorage.setItem(STORAGE_KEYS.adminLoggedIn, 'true');
  },

  clearTokens: () => {
    localStorage.removeItem(STORAGE_KEYS.access);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    localStorage.removeItem(STORAGE_KEYS.adminLoggedIn);
  },

  setUserRole: (role: string) => {
    localStorage.setItem(STORAGE_KEYS.role, role);
  },

  getUserRole: () => localStorage.getItem(STORAGE_KEYS.role),

  setUserName: (name: string) => {
    localStorage.setItem(STORAGE_KEYS.userName, name);
  },

  getUserName: () => localStorage.getItem(STORAGE_KEYS.userName),

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEYS.access);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    localStorage.removeItem(STORAGE_KEYS.adminLoggedIn);
    localStorage.removeItem(STORAGE_KEYS.role);
    localStorage.removeItem(STORAGE_KEYS.userName);
  },

  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.access),
};

/* =========================================================
   BACKWARD COMPAT HELPERS
========================================================= */

export const getAccessToken = () => tokenStorage.getAccessToken();
export const getRefreshToken = () => tokenStorage.getRefreshToken();
export const setTokens = (access: string, refresh: string) => tokenStorage.setTokens(access, refresh);
export const clearTokens = () => tokenStorage.clearTokens();

/* =========================================================
   HELPERS
========================================================= */

const isFormData = (value: unknown): value is FormData => value instanceof FormData;

const buildUrl = (endpoint: string, query?: Record<string, Primitive>) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let payload: ApiErrorPayload | string | null = null;

    try {
      payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      payload = null;
    }

    const message =
      typeof payload === 'string'
        ? payload
        : payload?.detail || payload?.message || `Request failed with status ${response.status}`;

    throw new ApiError(response.status, message, payload);
  }

  if (response.status === 204) {
    return null as T;
  }

  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as T;
};

/* =========================================================
   TOKEN REFRESH
========================================================= */

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = tokenStorage.getRefreshToken();
  if (!refresh) {
    tokenStorage.clearSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });

        if (!response.ok) {
          tokenStorage.clearSession();
          return null;
        }

        const data = await response.json();
        if (!data?.access) {
          tokenStorage.clearSession();
          return null;
        }

        localStorage.setItem(STORAGE_KEYS.access, data.access);
        return data.access as string;
      } catch {
        tokenStorage.clearSession();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

/* =========================================================
   CORE REQUESTS
========================================================= */

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  query?: Record<string, Primitive>;
  auth?: boolean;
  rawResponse?: boolean;
  retryOn401?: boolean;
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body,
    query,
    auth = true,
    rawResponse = false,
    retryOn401 = true,
    headers,
    ...rest
  } = options;

  const url = buildUrl(endpoint, query);

  const makeRequest = async (tokenOverride?: string | null) => {
    const mergedHeaders: HeadersInit = {
      ...headers,
    };

    if (!isFormData(body)) {
      mergedHeaders['Content-Type'] = 'application/json';
    }

    const token = tokenOverride ?? tokenStorage.getAccessToken();
    if (auth && token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      method,
      headers: mergedHeaders,
      body:
        body === undefined || body === null
          ? undefined
          : isFormData(body)
          ? body
          : JSON.stringify(body),
      ...rest,
    });
  };

  let response = await makeRequest();

  if (auth && response.status === 401 && retryOn401) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      throw new ApiError(401, 'Session expired. Please log in again.');
    }

    response = await makeRequest(newAccessToken);
  }

  if (rawResponse) {
    return response as T;
  }

  return parseResponse<T>(response);
};

export const publicRequest = <T = any>(endpoint: string, options: ApiRequestOptions = {}) =>
  apiRequest<T>(endpoint, { ...options, auth: false });

export const privateRequest = <T = any>(endpoint: string, options: ApiRequestOptions = {}) =>
  apiRequest<T>(endpoint, { ...options, auth: true });

export const extractResults = <T,>(data: PaginatedResponse<T> | T[]): T[] => {
  if (Array.isArray(data)) return data;
  return data.results || [];
};

/* =========================================================
   AUTH API
========================================================= */

export const authAPI = {
  login: async (email: string, password: string) => {
    return publicRequest<LoginResponse>('/api/login/', {
      method: 'POST',
      body: { email, password },
    });
  },

  verifyOtp: async (payload: OtpVerifyPayload) => {
    const data = await publicRequest<OtpVerifyResponse>('/api/verify-otp/', {
      method: 'POST',
      body: payload,
    });

    if (data?.access && data?.refresh) {
      tokenStorage.setTokens(data.access, data.refresh);
    }

    return data;
  },

  directJwtLogin: async (email: string, password: string) => {
    const data = await publicRequest<AuthTokens>('/api/token/', {
      method: 'POST',
      body: { email, password },
    });

    tokenStorage.setTokens(data.access, data.refresh);
    return data;
  },

  logout: async () => {
    try {
      return await privateRequest('/api/logout/', {
        method: 'POST',
      });
    } finally {
      tokenStorage.clearSession();
    }
  },

  getProfile: async () => {
    return privateRequest<UserProfile>('/api/me/');
  },

  getUserRole: async () => {
    return privateRequest<{ role?: string; [key: string]: any }>('/api/user/role/');
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return privateRequest('/api/change-password/', {
      method: 'POST',
      body: {
        old_password: oldPassword,
        new_password: newPassword,
      },
    });
  },

  refreshToken: async () => {
    const access = await refreshAccessToken();
    if (!access) {
      throw new ApiError(401, 'Unable to refresh token');
    }
    return { access };
  },

  checkAuth: async () => {
    try {
      await privateRequest('/api/me/');
      return true;
    } catch {
      return false;
    }
  },
};

/* =========================================================
   SESSION API
========================================================= */

export const sessionAPI = {
  bootstrapUserSession: async () => {
    const profile = await authAPI.getProfile();
    const role = profile?.role || 'admin';
    const fullName =
      profile?.full_name ||
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
      profile?.email ||
      'Admin User';

    tokenStorage.setUserRole(role);
    tokenStorage.setUserName(fullName);

    return {
      profile,
      role,
      fullName,
    };
  },

  logoutAndRedirect: async (redirectTo = '/admin/login') => {
    window.location.href = redirectTo;
    try {
      await authAPI.logout();
    } finally {
      
    }
  },
};

/* =========================================================
   PRAYER API
========================================================= */

export const prayerAPI = {
  create: async (data: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    prayer_type: string;
    prayer_request: string;
    wants_visitation?: boolean;
    prayer_cell?: string;
    general_area?: string;
    visitation_method?: string;
  }) => {
    return publicRequest('/form/prayers/', {
      method: 'POST',
      body: data,
    });
  },

  list: async () => {
    return privateRequest('/form/prayers/');
  },

  detail: async (id: number) => {
    return privateRequest(`/form/prayers/${id}/`);
  },

  update: async (id: number, data: { status?: string }) => {
    return privateRequest(`/form/prayers/${id}/`, {
      method: 'PATCH',
      body: data,
    });
  },

  delete: async (id: number) => {
    return privateRequest(`/form/prayers/${id}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   ANNOUNCEMENTS API
========================================================= */

export const announcementAPI = {
  list: async () => {
    return privateRequest('/form/announcements/');
  },

  detail: async (id: number) => {
    return privateRequest(`/form/announcements/${id}/`);
  },

  create: async (formData: FormData) => {
    return privateRequest('/form/announcements/', {
      method: 'POST',
      body: formData,
    });
  },

  update: async (id: number, formData: FormData) => {
    return privateRequest(`/form/announcements/${id}/`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (id: number) => {
    return privateRequest(`/form/announcements/${id}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   EVENTS API
========================================================= */

export const eventAPI = {
  list: async () => {
    return privateRequest('/form/events/list/');
  },

  detail: async (slug: string) => {
    return privateRequest(`/form/events/detail/${slug}/`);
  },

  create: async (formData: FormData) => {
    return privateRequest('/form/events/', {
      method: 'POST',
      body: formData,
    });
  },

  update: async (slug: string, formData: FormData) => {
    return privateRequest(`/form/events/update/${slug}/`, {
      method: 'PUT',
      body: formData,
    });
  },

  delete: async (slug: string) => {
    return privateRequest(`/form/events/update/${slug}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   BAPTISM API
========================================================= */

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
    return publicRequest('/form/baptism/', {
      method: 'POST',
      body: data,
    });
  },

  list: async () => {
    return privateRequest('/form/baptism/');
  },

  detail: async (id: number) => {
    return privateRequest(`/form/baptism/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return privateRequest(`/form/baptism/${id}/status_update/`, {
      method: 'PATCH',
      body: { status },
    });
  },

  delete: async (id: number) => {
    return privateRequest(`/form/baptism/${id}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   DEDICATION API
========================================================= */

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
    return publicRequest('/form/dedication/', {
      method: 'POST',
      body: data,
    });
  },

  list: async () => {
    return privateRequest('/form/dedication/');
  },

  detail: async (id: number) => {
    return privateRequest(`/form/dedication/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return privateRequest(`/form/dedication/${id}/status_update/`, {
      method: 'PATCH',
      body: { status },
    });
  },

  delete: async (id: number) => {
    return privateRequest(`/form/dedication/${id}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   MEMBERSHIP API
========================================================= */

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
    return publicRequest('/form/membership/', {
      method: 'POST',
      body: data,
    });
  },

  list: async () => {
    return privateRequest('/form/membership/list/');
  },

  detail: async (id: number) => {
    return privateRequest(`/form/membership/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return privateRequest(`/form/membership/${id}/status_update/`, {
      method: 'PATCH',
      body: { status },
    });
  },

  delete: async (id: number) => {
    return privateRequest(`/form/membership/${id}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   BENEVOLENCE API
========================================================= */

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
    return publicRequest('/form/benevolence/submit/', {
      method: 'POST',
      body: data,
    });
  },

  list: async () => {
    return privateRequest('/form/benevolence/');
  },

  detail: async (id: number) => {
    return privateRequest(`/form/benevolence/${id}/`);
  },

  updateStatus: async (id: number, status: string) => {
    return privateRequest(`/form/benevolence/${id}/status_update/`, {
      method: 'PATCH',
      body: { status },
    });
  },

  delete: async (id: number) => {
    return privateRequest(`/form/benevolence/${id}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   CONTACT API
========================================================= */

export const contactAPI = {
  create: async (data: {
    full_name: string;
    email?: string;
    phone_number: string;
    subject: string;
    message: string;
  }) => {
    return publicRequest('/form/contact/', {
      method: 'POST',
      body: data,
    });
  },

  list: async () => {
    return privateRequest('/form/contact/list/');
  },

  detail: async (id: number) => {
    return privateRequest(`/form/contact/${id}/`);
  },

  delete: async (id: number) => {
    return privateRequest(`/form/contact/${id}/`, { method: 'DELETE' });
  },
};

/* =========================================================
   MPESA API
========================================================= */

export const mpesaAPI = {
  initiatePayment: async (data: {
    name: string;
    phone_number: string;
    email?: string;
    purposes: { purpose: string; amount: number; other_purpose_details?: string }[];
  }) => {
    return publicRequest('/api/v1/mpesa/initiate-payment/', {
      method: 'POST',
      body: data,
    });
  },

  listTransactions: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    purpose?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
  }) => {
    return privateRequest('/api/v1/mpesa/transactions/', {
      query: params,
    });
  },

  checkTransactionStatus: async (checkoutRequestId: string) => {
    return publicRequest('/api/v1/mpesa/status-check/', {
      query: { checkout_request_id: checkoutRequestId },
    });
  },

  transactionDetail: async (id: number) => {
    return privateRequest(`/api/v1/mpesa/transactions/${id}/`);
  },

  pollCoopStatus: async (messageReference: string) => {
    return publicRequest('/api/v1/mpesa/check-status/', {
      method: 'POST',
      body: { MessageReference: messageReference },
    });
  },
};


/* =========================================================
   USER MANAGEMENT API
========================================================= */

export interface SystemUser {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  must_change_password: boolean;
  is_email_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UpdateUserPayload {
  full_name?: string;
  phone_number?: string;
  role?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
}

export interface InviteUserPayload {
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
}

export const userManagementAPI = {
  // List all users — supports ?role=elder&is_active=true
  list: async (filters?: { role?: string; is_active?: boolean }) => {
    return privateRequest<SystemUser[]>('/api/users/', {
      query: {
        ...(filters?.role !== undefined && { role: filters.role }),
        ...(filters?.is_active !== undefined && { is_active: String(filters.is_active) }),
      },
    });
  },

  retrieve: async (pk: number) => {
    return privateRequest<SystemUser>(`/api/users/${pk}/`);
  },

  // Full update — all fields required
  update: async (pk: number, data: UpdateUserPayload) => {
    return privateRequest<{ message: string; user: SystemUser }>(`/api/users/${pk}/update/`, {
      method: 'PUT',
      body: data,
    });
  },

  // Partial update — e.g. just { is_active: false } to deactivate
  patch: async (pk: number, data: UpdateUserPayload) => {
    return privateRequest<{ message: string; user: SystemUser }>(`/api/users/${pk}/update/`, {
      method: 'PATCH',
      body: data,
    });
  },

  // Convenience wrappers for common actions
  deactivate: async (pk: number) => {
    return userManagementAPI.patch(pk, { is_active: false });
  },

  activate: async (pk: number) => {
    return userManagementAPI.patch(pk, { is_active: true });
  },

  changeRole: async (pk: number, role: string) => {
    return userManagementAPI.patch(pk, { role });
  },

  delete: async (pk: number) => {
    return privateRequest<{ message: string }>(`/api/users/${pk}/delete/`, {
      method: 'DELETE',
    });
  },

  invite: async (data: InviteUserPayload) => {
    return privateRequest<{ message: string; user: SystemUser }>('/api/invite/', {
      method: 'POST',
      body: data,
    });
  },

  resendInvitation: async (pk: number) => {
    return privateRequest<{ message: string }>(`/api/users/${pk}/resend-invitation/`, {
      method: 'POST',
    });
  },

  setPasswordFromInvite: async (uidb64: string, token: string, password: string, confirmPassword: string) => {
    return publicRequest<{ message: string }>(`/api/set-password/${uidb64}/${token}/`, {
      method: 'POST',
      body: { password, confirm_password: confirmPassword },
    });
  },
};

/* =========================================================
   PASSWORD RESET API
========================================================= */

export const passwordResetAPI = {
  forgotPassword: async (email: string) => {
    return publicRequest<{ message: string }>('/api/forgot-password/', {
      method: 'POST',
      body: { email },
    });
  },

  resetPassword: async (uidb64: string, token: string, password: string, confirmPassword: string) => {
    return publicRequest<{ message: string }>(`/api/reset-password/${uidb64}/${token}/`, {
      method: 'PUT',
      body: { password, confirm_password: confirmPassword },
    });
  },
};