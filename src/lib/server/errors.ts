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


export class NotFoundError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'NotFoundError';
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}
