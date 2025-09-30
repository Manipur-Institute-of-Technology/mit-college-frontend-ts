// src/context/AuthContext.tsx
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type UserRole = "admin" | "faculty" | null;

interface AuthContextType {
  token: string | null;
  role: UserRole;
  setToken: (token: string | null) => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedRole = sessionStorage.getItem("role") as UserRole;
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  // Ensure sessionStorage is updated when token/role changes
  const setTokenAndStore = (token: string | null) => {
    setToken(token);
    if (token) sessionStorage.setItem("token", token);
    else sessionStorage.removeItem("token");
  };

  const setRoleAndStore = (role: UserRole) => {
    setRole(role);
    if (role) sessionStorage.setItem("role", role);
    else sessionStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ token, role, setToken: setTokenAndStore, setRole: setRoleAndStore }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
