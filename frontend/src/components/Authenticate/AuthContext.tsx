import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useJwt } from "react-jwt";
import axios from "axios";
import { API_URL } from "../API/axiosInstance";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  company_name: string | null;
  display_name: string;
}

interface DecodedToken {
  user_id: number;
  username: string;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("accessToken")
  );
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const token = localStorage.getItem("accessToken");

  const { decodedToken, isExpired } = useJwt<DecodedToken>(token || "");

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password,
      });
      const { access, user } = response.data;

      if (access) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("userInfo", JSON.stringify(user));
        setIsAuthenticated(true);
        setUserInfo(user);
        console.log("Авторизация прошла успешно");
      } else {
        throw new Error("Токен не получен");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsAuthenticated(false);
        throw new Error("Неправильное имя пользователя или пароль");
      } else {
        setIsAuthenticated(false);
        throw error;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setIsAuthenticated(false);
    console.log("Вы вышли из системы");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
