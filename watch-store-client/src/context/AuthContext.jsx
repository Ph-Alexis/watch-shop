import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, meApi, registerApi } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await meApi();
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (formData) => {
    const res = await loginApi(formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);

    return res.data;
  };

  const register = async (formData) => {
    const res = await registerApi(formData);

    // ❌ KHÔNG ép token nếu backend không có
    // chỉ lưu user nếu backend trả về
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loading,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
