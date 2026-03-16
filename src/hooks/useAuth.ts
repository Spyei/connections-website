import { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useIsClient } from "../contexts/Client";

const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const isClient = useIsClient();

	useEffect(() => {
		if (!isClient) return;

		const fetchAuth = async () => {
			try {
				const { data } = await api.get("/auth/user");
				setIsAuthenticated(!!data);
			} catch {
				setIsAuthenticated(false);
			}
		};

		fetchAuth();
	}, [isClient]);

	return { isAuthenticated };
};

export default useAuth;
