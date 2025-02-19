export class MissingEnvError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'MissingEnvError';
		Object.setPrototypeOf(this, MissingEnvError.prototype);
	}
}

export class GitHubAPIError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'GitHubAPIError';
		Object.setPrototypeOf(this, GitHubAPIError.prototype);
	}
}
