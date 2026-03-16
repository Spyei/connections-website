"use client";
import type React from "react";
import { createContext, useState, useEffect, type ReactNode } from "react";
import type { UserContextProps, UserStructure } from "../types";
import { api } from "../utils/api";

export const UserContext = createContext<UserContextProps>({
	user: null,
	setUser: () => null,
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserStructure | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await api.get("/auth/user");
				if (data) setUser(data);
			} catch {
				setUser(null);
			}
		};

		fetchUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};
