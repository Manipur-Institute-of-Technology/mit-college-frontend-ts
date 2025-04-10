import { createContext, useContext } from "react";

export interface User {
  userName: string;
  jwtToken: string;
  userType: "admin" | "faculty";
}
export type SessionType = "permanent" | "temporary";

export interface AuthContextType {
  user: User | null;
  sessionType: SessionType | null;
  login: (userData: User, sessionType?: SessionType) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const sessionTypeKey = "session-type";
export const authStorageSessionKey = "user-mit-session";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
