export const ENV = {
	DEV: import.meta.env.DEV,
	BASE_URL: import.meta.env.DEV ? 'http://localhost:5173' : (import.meta.env.VITE_DOMAIN as string ?? 'https://example.com'),
	LOCKS_DIR: import.meta.env.DEV ? './tmp/locks' : '/papermap-tmp/locks',
	IMAGES_DIR: './tmp/images',
	GITHUB_APP_ID: import.meta.env.VITE_GITHUB_APP_ID ? parseInt(import.meta.env.VITE_GITHUB_APP_ID) as number : undefined,
	GITHUB_PRIVATE_KEY: import.meta.env.VITE_GITHUB_PRIVATE_KEY as string | undefined,
	GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined,
	GITHUB_CLIENT_SECRET: import.meta.env.VITE_GITHUB_CLIENT_SECRET as string | undefined,
	GITHUB_INSTALLATION_ID: import.meta.env.VITE_GITHUB_INSTALLATION_ID ? parseInt(import.meta.env.VITE_GITHUB_INSTALLATION_ID) as number : undefined,
	GITHUB_OWNER: import.meta.env.VITE_GITHUB_OWNER as string | undefined,
	GITHUB_REPO: import.meta.env.VITE_GITHUB_REPO as string | undefined,
	GITHUB_DEFAULT_BRANCH: import.meta.env.VITE_GITHUB_DEFAULT_BRANCH as string | undefined,
};


export function get_random_string()
{
	let result = '';

	for (let i = 0; i < 16; i++)
	{
		const base = Math.random() < 0.5 ? 65 : 97;
		result += String.fromCharCode(base + Math.floor(Math.random() * 26));
	}

	return result;
}
