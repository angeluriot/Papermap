export const ENV = {
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
	BASE_URL: import.meta.env.DEV ? 'http://localhost:5173' : (import.meta.env.VITE_DOMAIN as string ?? 'https://example.com'),
};
