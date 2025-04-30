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


export class InvalidDataError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'InvalidDataError';
		Object.setPrototypeOf(this, InvalidDataError.prototype);
	}
}


export class InvalidInternalDataError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'InvalidInternalDataError';
		Object.setPrototypeOf(this, InvalidInternalDataError.prototype);
	}
}


export class InvalidRequestError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'InvalidRequestError';
		Object.setPrototypeOf(this, InvalidRequestError.prototype);
	}
}


export class TooManyRequestsError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'TooManyRequestsError';
		Object.setPrototypeOf(this, TooManyRequestsError.prototype);
	}
}


export class OpenAlexAPIError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'OpenAlexAPIError';
		Object.setPrototypeOf(this, OpenAlexAPIError.prototype);
	}
}
