import { InvalidRequestError, TooManyRequestsError } from '$lib/server/errors';
import { building } from '$app/environment'
import { error as http_error } from '@sveltejs/kit';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { constants as C } from '$lib/server/utils';
import requestIp from 'request-ip';


const global_limiter = new RateLimiterMemory({
	points: 30,
	duration: 15,
	blockDuration: 60
});

const journals_limiter = new RateLimiterMemory({
	points: 5,
	duration: 20,
	blockDuration: 180
});

const github_limiter = new RateLimiterMemory({
	points: 5,
	duration: 60,
	blockDuration: 600
});


export async function handle({ event, resolve })
{
	try
	{
		if (C.DEV || building)
			return resolve(event);

		if (!event.route.id)
			throw new InvalidRequestError('No route');

		let limiter = global_limiter;

		if (event.route.id.trim().startsWith('/journals'))
			limiter = journals_limiter;

		if (event.route.id.trim().startsWith('/maps/[group]/[map]/edit') || event.route.id.trim().startsWith('/request'))
			limiter = github_limiter;

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
