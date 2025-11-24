import { useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) setUser(data.username);
    return data;
  };

const res = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
const data = await res.json();

if (data.success) {
  setUser({ username: data.username, role: data.role });
  setToken(data.token);
}


  const register = async (username, password) => {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    return await res.json();
  };

  const logout = () => setUser(null);

  return { user, login, register, logout };
}

