import { InvalidRequestError, TooManyRequestsError } from '$lib/errors';
import { building } from '$app/environment'
import type { Handle } from '@sveltejs/kit';
import { error as http_error } from '@sveltejs/kit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { constants as C } from '$lib/server/utils';
import requestIp from 'request-ip';


const journals_limiter = new RateLimiterMemory({
	points: 5,
	duration: 20,
	blockDuration: 3 * 60,
});

const github_limiter = new RateLimiterMemory({
	points: 5,
	duration: 1 * 60,
	blockDuration: 10 * 60,
});

const github_long_limiter = new RateLimiterMemory({
	points: 30,
	duration: 10 * 60 * 60,
	blockDuration: 10 * 60 * 60,
});


export const handle: Handle = async ({ event, resolve }) =>
{
	try
	{
		if (C.DEV || building)
			return resolve(event);

		if (!event.route.id)
			throw new InvalidRequestError('No route');

		let limiters: RateLimiterMemory[] = [];

		if (event.route.id.trim().startsWith('/journals'))
			limiters.push(journals_limiter);
		else if (event.route.id.trim().startsWith('/maps/[group]/[map]/edit') || event.route.id.trim().startsWith('/request'))
			limiters.push(github_limiter, github_long_limiter);
		else
			return resolve(event);

		if (!event.request)
			throw new InvalidRequestError('No request');

		const ip = requestIp.getClientIp({
			headers: Object.fromEntries(event.request.headers.entries()),
			connection: {
				remoteAddress: event.getClientAddress(),
				socket: { remoteAddress: event.getClientAddress() },
			},
			info: { remoteAddress: event.getClientAddress() },
			socket: { remoteAddress: event.getClientAddress() },
		});

		if (!ip)
			throw new InvalidRequestError('No IP');

		try
		{
			for (const limiter of limiters)
				await limiter.consume(ip);
		}

		catch (error: any)
		{
			throw new TooManyRequestsError('Too many requests');
		}

		return resolve(event);
	}

	catch (error: any)
	{
		console.error(error);

		if (error instanceof InvalidRequestError)
			return http_error(400, error.message);

		if (error instanceof TooManyRequestsError)
			return http_error(429, error.message);

		return http_error(500, 'Internal server error');
	}
}
