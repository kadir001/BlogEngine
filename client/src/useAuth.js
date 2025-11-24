// src/useAuth.js
import { useState, useEffect } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  // Load token on refresh
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (username, password) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.success) {
      const authData = { 
        username: data.username, 
        role: data.role, 
        token: data.token 
      };
      localStorage.setItem("auth", JSON.stringify(authData));
      setUser(authData);
    }

    return data;
  };

  const register = async (username, password) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return { user, login, register, logout };
}
