import api from "./api";

interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    role: string;
    full_name: string;
    must_change_password: boolean;
  };
}

export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/token/", { email, password });
  const { access, refresh, user } = response.data;

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return null;

  try {
    const response = await api.post<{ access: string }>("/token/refresh/", { refresh });
    localStorage.setItem("accessToken", response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  const response = await api.get("/me/");
  return response.data;
};

export const changePassword = async (old_password: string, new_password: string) => {
  const response = await api.put("/change-password/", { old_password, new_password });
  return response.data;
};

export const createElder = async (data: { email: string; full_name: string; password: string }) => {
  const response = await api.post("/create-elder/", data);
  return response.data;
};
