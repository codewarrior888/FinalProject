import React, { createContext, useState } from "react";
import { isExpired as isExpired_JWT } from "react-jwt";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ACC_URL } from "../../api.jsx";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("token");
    try {
      const parsed = JSON.parse(saved);
      setIsAuthenticated(!isExpired_JWT(parsed.access));
      return parsed;
    } catch (error) {
      return {};
    }
  });
  const [fail, setFail] = useState(null);
  const navigate = useNavigate();

  const signIn = async (authorizationData, cb) => {
    setFail(null);
    try {
      const response = await axios.post(`${ACC_URL}login/`, authorizationData);

      if (response.status === 200 && response.data.message === "Logged in successfully") {
        console.log("Аутентификация прошла успешно");
        localStorage.setItem("token", JSON.stringify(response.data));
        setToken(response.data);
        setIsAuthenticated(true);
        cb();
      } else {
        setFail("Неверный логин или пароль");
      }
    } catch (error) {
      console.error("Ошибка аутентификации:", error);
      setFail("Ошибка при попытке входа");
    }
  };

  const signOut = async (cb) => {
    if (isAuthenticated) {
      try {
        const saved = localStorage.getItem("token");
        const parsed = JSON.parse(saved);
        const response = await axios.post(
          `${ACC_URL}logout/`,
          { refresh: parsed.refresh },
          {
            headers: {
              Authorization: `Bearer ${parsed.access}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Выход прошел успешно");
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          cb();
        }
      } catch (error) {
        console.error("Ошибка выхода:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const isExpired = () => {
    const saved = localStorage.getItem("token");
    const parsed = JSON.parse(saved);
    return !parsed || isExpired_JWT(parsed.access);
  };

  const value = { token, signIn, signOut, isExpired, isAuthenticated, setIsAuthenticated, fail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
