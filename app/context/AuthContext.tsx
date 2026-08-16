import * as React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import apiClient from "~/utils/apiClient";

export type UserRole = "admin" | "faculty" | null;

export interface UserAccount {
  _id: string;
  accountType: UserRole;
  email: string;
  username: string;
  status?: string;
}

interface AuthContextType {
  token: string | null;
  role: UserRole;
  user: UserAccount | null;

  // Important: tells the app whether authentication
  // is still being restored from localStorage.
  authLoading: boolean;

  setToken: (token: string | null) => void;
  setRole: (role: UserRole) => void;
  setUser: (user: UserAccount | null) => void;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [token, setToken] =
    useState<string | null>(null);

  const [role, setRole] =
    useState<UserRole>(null);

  const [user, setUser] =
    useState<UserAccount | null>(null);

  // -------------------------------------------------------
  // IMPORTANT:
  // Prevent protected pages from assuming the user
  // is logged out before localStorage has been restored.
  // -------------------------------------------------------

  const [authLoading, setAuthLoading] =
    useState(true);

  // -------------------------------------------------------
  // RESTORE AUTHENTICATION
  // -------------------------------------------------------

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem("token");

      const storedRole =
        localStorage.getItem("role");

      const storedUser =
        localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);
      }

      if (
        storedRole === "admin" ||
        storedRole === "faculty"
      ) {
        setRole(storedRole);
      }

      if (storedUser) {
        try {
          const parsedUser =
            JSON.parse(storedUser);

          if (parsedUser?._id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem("user");
          }
        } catch (error) {
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
    } finally {
      // Authentication restoration is complete.
      setAuthLoading(false);
    }
  }, []);

  // -------------------------------------------------------
  // SET TOKEN
  // -------------------------------------------------------

  const setTokenAndStore = (
    newToken: string | null
  ) => {
    setToken(newToken);

    if (newToken) {
      localStorage.setItem(
        "token",
        newToken
      );
    } else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  };

  // -------------------------------------------------------
  // SET ROLE
  // -------------------------------------------------------

  const setRoleAndStore = (
    newRole: UserRole
  ) => {
    setRole(newRole);

    if (newRole) {
      localStorage.setItem(
        "role",
        newRole
      );
    } else {
      localStorage.removeItem("role");
      sessionStorage.removeItem("role");
    }
  };

  // -------------------------------------------------------
  // SET USER
  // -------------------------------------------------------

  const setUserAndStore = (
    newUser: UserAccount | null
  ) => {
    setUser(newUser);

    if (newUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );
    } else {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    }
  };

  // -------------------------------------------------------
  // LOGOUT
  // -------------------------------------------------------

  const logout = async () => {
    try {
      if (token && user?.email) {
        await apiClient.post(
          "/account/logout",
          {
            email: user.email,
            token,
          }
        );
      }
    } catch (error) {
    } finally {
      setTokenAndStore(null);
      setRoleAndStore(null);
      setUserAndStore(null);
    }
  };

  // -------------------------------------------------------
  // PROVIDER
  // -------------------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        authLoading,

        setToken: setTokenAndStore,
        setRole: setRoleAndStore,
        setUser: setUserAndStore,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------
// USE AUTH
// ---------------------------------------------------------

export const useAuth = (): AuthContextType => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};