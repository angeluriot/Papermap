export class SemanticScholarAPIError extends Error
{
	constructor(message: string)
	{
		super(message);
		this.name = 'SemanticScholarAPIError';
		Object.setPrototypeOf(this, SemanticScholarAPIError.prototype);
	}
}
