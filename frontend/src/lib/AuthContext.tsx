import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types/user";
import { getCurrentUser, login as apiLogin, logout as apiLogout } from "./api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ error: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Function to fetch current user data
  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();

      if (!response.error && "data" in response) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check for user on initial load
  useEffect(() => {
    refreshUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiLogin(email, password);

      if (!result.error) {
        await refreshUser();
        return { error: false };
      } else {
        // Use optional chaining to safely access message property
        const errorMessage =
          "message" in result ? result.message : "Login failed";
        setError(errorMessage);
        return { error: true, message: errorMessage };
      }
    } catch (err) {
      const message = "An error occurred during login";
      setError(message);
      return { error: true, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    apiLogout();
    setUser(null);
    window.location.href = "/";
    window.location.reload();
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
