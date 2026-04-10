import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authAPI, sessionAPI, tokenStorage } from '@/utils/api';

type UserRole = 'admin' | 'superadmin' | 'treasurer' | string;

interface AuthUser {
  id?: number;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  [key: string]: any;
}

interface LoginResult {
  success: boolean;
  otpRequired?: boolean;
  email?: string;
  role?: string;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBootstrapped: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyOtp: (email: string, otp: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!tokenStorage.getAccessToken()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const applyUserSession = useCallback((profile: AuthUser | null) => {
    setUser(profile);
    const resolvedRole = profile?.role || 'admin';
    setRole(resolvedRole);
    setIsAuthenticated(true);
    tokenStorage.setUserRole(resolvedRole);
    const fullName =
      profile?.full_name ||
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
      profile?.email ||
      'Admin User';
    tokenStorage.setUserName(fullName);
  }, []);

  const clearAuthState = useCallback(() => {
    tokenStorage.clearSession();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (!tokenStorage.getAccessToken()) {
      clearAuthState();
      return null;
    }
    try {
      const profile = await authAPI.getProfile();
      applyUserSession(profile);
      return profile;
    } catch {
      clearAuthState();
      return null;
    }
  }, [applyUserSession, clearAuthState]);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      try {
        if (!tokenStorage.getAccessToken()) {
          clearAuthState();
          return;
        }
        const session = await sessionAPI.bootstrapUserSession();
        applyUserSession(session.profile);
      } catch {
        clearAuthState();
      } finally {
        setIsLoading(false);
        setIsBootstrapped(true);
      }
    };
    bootstrap();
  }, [applyUserSession, clearAuthState]);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const result = await authAPI.login(email, password);

      // Backend returns tokens directly (no OTP flow)
      if (result?.access && result?.refresh) {
        tokenStorage.setTokens(result.access, result.refresh);
        setIsAuthenticated(true);
        const profile = await refreshCurrentUser();
        return { success: true, role: profile?.role || 'admin' };
      }

      // Backend returns OTP flow — matches {"message": "OTP sent...", "email": "..."}
      if (result?.message || result?.email) {
        return {
          success: true,
          otpRequired: true,
          email: result.email || email,
        };
      }

      return { success: false, error: 'Unexpected response from server' };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Login failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  }, [refreshCurrentUser]);

  const verifyOtp = useCallback(async (email: string, otp: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      // Backend expects { email, otp_code } not { email, otp }
      const result = await authAPI.verifyOtp({
        email,
        otp_code: otp,
      } as any);

      if (result?.access && result?.refresh) {
        tokenStorage.setTokens(result.access, result.refresh);
        setIsAuthenticated(true);
        const profile = await refreshCurrentUser();
        const resolvedRole = profile?.role || 'admin';
        return { success: true, role: resolvedRole };
      }

      return { success: false, error: 'Invalid OTP. Please try again.' };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'OTP verification failed.',
      };
    } finally {
      setIsLoading(false);
    }
  }, [refreshCurrentUser]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } finally {
      clearAuthState();
      setIsLoading(false);
    }
  }, [clearAuthState]);

  const value = useMemo(
    () => ({
      user,
      role,
      isAuthenticated,
      isLoading,
      isBootstrapped,
      login,
      verifyOtp,
      logout,
      refreshCurrentUser,
    }),
    [user, role, isAuthenticated, isLoading, isBootstrapped, login, verifyOtp, logout, refreshCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};