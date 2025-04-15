import type { IService } from "./IService";
import MockService from "./MockService";
import ProdService from "./ProdService";

/**
 * Perform a Dependency injection of service based on the environmnet variable
 * @returns Service class
 */
const generateService = (): IService => {
	switch (import.meta.env.VITE_SERVICE) {
		case "mock":
			return new MockService();
		case "prod":
			return new ProdService();
		default:
			throw new Error(
				`vite env var: ${import.meta.env.VITE_ENV} not recognised`,
			);
	}
};

export default generateService;
