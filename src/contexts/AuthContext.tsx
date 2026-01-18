import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { authService } from "@/api/service/index.service";

interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

export interface SignupData {
  nome: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasToken = () => !!localStorage.getItem("auth_token");

  // Busca usuário atual se tiver token
  const refreshUser = useCallback(async () => {
    if (!hasToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrent();
      setUser(userData);
    } catch {
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    const data = await authService.login(email, password);
    if (data?.token) {
      localStorage.setItem("auth_token", data.token);
      await refreshUser();
    }
  }, [refreshUser]);

  // Signup
  const signup = useCallback(async (data: SignupData) => {
    const response = await authService.signup(data);
    if (response?.token) {
      localStorage.setItem("auth_token", response.token);
      await refreshUser();
    }
  }, [refreshUser]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  }, []);

  // Carrega usuário na montagem
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
