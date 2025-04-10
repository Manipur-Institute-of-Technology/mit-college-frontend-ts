import { type ReactNode, useState, useEffect } from "react";
import {
	type SessionType,
	type User,
	AuthContext,
	authStorageSessionKey,
	sessionTypeKey,
} from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [sessionType, setSessionType] = useState<SessionType | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	useEffect(() => {
		// Check localStorage for existing session
		const sessionType = localStorage.getItem(
			sessionTypeKey,
		) as SessionType | null;
		// Check session type is present
		if (
			!sessionType ||
			sessionType.length == 0 ||
			!(sessionType === "permanent" || sessionType === "temporary")
		)
			return;

		// Extract storedSUer from client storage
		let storedUser: string | null;
		if (sessionType === "permanent")
			storedUser = localStorage.getItem(authStorageSessionKey);
		else if (sessionType === "temporary")
			storedUser = sessionStorage.getItem(authStorageSessionKey);
		else storedUser = null;

		if (storedUser) {
			const parseUser = JSON.parse(storedUser) as User;
			if (
				parseUser.jwtToken &&
				parseUser.jwtToken.length > 0 &&
				parseUser.userName &&
				parseUser.userName.length > 0 &&
				parseUser.userType &&
				(parseUser.userType === "admin" ||
					parseUser.userType === "faculty")
			) {
				setUser(parseUser);
				setIsAuthenticated(true);
				// Default session type is permanent
				setSessionType((sessionType as SessionType) || "permanent");
			}
		}
	}, []);

	const login = (userData: User, sessionType: SessionType = "permanent") => {
		// Update auth context with new user session info
		setUser(userData);
		setIsAuthenticated(true);
		localStorage.setItem(sessionTypeKey, sessionType);
		if (sessionType === "temporary")
			sessionStorage.setItem(
				authStorageSessionKey,
				JSON.stringify(userData),
			);
		else if (sessionType === "permanent")
			localStorage.setItem(
				authStorageSessionKey,
				JSON.stringify(userData),
			);
		else {
			setSessionType("permanent");
			localStorage.setItem(sessionTypeKey, "permanent");
			throw new Error(
				`Auth Context error: session type  ${sessionType} is not recognised`,
			);
		}
	};

	const logout = () => {
		// Remove existing session info
		setIsAuthenticated(false);
		if (sessionType === "permanent")
			localStorage.removeItem(authStorageSessionKey);
		else sessionStorage.removeItem(authStorageSessionKey);
		localStorage.removeItem(sessionTypeKey);
		setUser(null);
		setSessionType(null);
	};

	const value = {
		user,
		sessionType,
		login,
		logout,
		isAuthenticated,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}
