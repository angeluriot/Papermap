import newrelic from 'newrelic';
import express from 'express';
import requestIp from 'request-ip';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { handler } from './build/handler.js';


class InvalidRequestError extends Error {}
class TooManyRequestsError extends Error {}

const default_limiter = new RateLimiterMemory({
	points: 3000,
	duration: 60,
	blockDuration: 60
});

const search_limiter = new RateLimiterMemory({
	points: 30,
	duration: 60,
	blockDuration: 3 * 60
});

const github_limiter = new RateLimiterMemory({
	points: 5,
	duration: 60,
	blockDuration: 10 * 60
});

const github_long_limiter = new RateLimiterMemory({
	points: 30,
	duration: 10 * 60 * 60,
	blockDuration: 10 * 60 * 60
});

const ROUTES = [
	{
		method: 'POST',
		endpoint: '/maps/{map}/edit',
		regex: /^\/maps\/([^/]+)\/edit$/,
		extract: (m) => ({ map: m[1] }),
	},
	{
		method: 'GET',
		endpoint: '/maps/{map}/{file}',
		regex: /^\/maps\/([^/]+)\/([^/]+)$/,
		extract: (m) => ({ map: m[1], file: m[2] }),
	},
	{
		method: 'GET',
		endpoint: '/maps/random',
		regex: /^\/maps\/random$/,
		extract: () => ({}),
	},
	{
		method: 'GET',
		endpoint: '/maps/{map}',
		regex: /^\/maps\/([^/]+)$/,
		extract: (m) => ({ map: m[1] }),
	},
	{
		method: 'GET',
		endpoint: '/maps',
		regex: /^\/maps$/,
		extract: () => ({}),
	},
	{
		method: 'GET',
		endpoint: '/journal/{id}',
		regex: /^\/journal\/([^/]+)$/,
		extract: () => ({}),
	},
	{
		method: 'POST',
		endpoint: '/request/new',
		regex: /^\/request\/new$/,
		extract: () => ({}),
	},
	{
		method: 'GET',
		endpoint: '/search',
		regex: /^\/search$/,
		extract: () => ({}),
	},
	{
		method: 'GET',
		endpoint: '/',
		regex: /^\/$/,
		extract: () => ({}),
	},
];


function normalize_path(input)
{
	let path = input.split('?')[0].split('#')[0];

	if (!path.startsWith('/'))
		path = '/' + path;

	path = path.replace(/\/{2,}/g, '/');

	if (path.length > 1 && path.endsWith('/'))
		path = path.slice(0, -1);

	if (path.endsWith('/__data.json'))
		path = path.slice(0, -12);

	return path;
}


function match_endpoint(method, path)
{
	for (const route of ROUTES)
	{
		if (route.method !== method)
			continue;

		const match = route.regex.exec(path);

		if (match)
		{
			const params = route.extract(match);

			return {
				route: route.endpoint,
				map: params.map ?? null,
				file: params.file ?? null,
			};
		}
	}

	return {
		route: null,
		map: null,
		file: null,
	};
}


function log_endpoint(method, path, endpoint)
{
	if (endpoint.route === null)
		return;

	const name = `${method} ${path}`;
	newrelic.setTransactionName(name);
	newrelic.addCustomAttribute('custom_name', name);
	newrelic.addCustomAttribute('custom_method', method);
	newrelic.addCustomAttribute('custom_path', path);
	newrelic.addCustomAttribute('custom_endpoint', `${method} ${endpoint.route}`);
	newrelic.addCustomAttribute('custom_map', endpoint.map);
	newrelic.addCustomAttribute('custom_file', endpoint.file);
	newrelic.addCustomAttribute('custom_error', null);
}


const app = express();
app.set('trust proxy', true);

app.use(async (req, res, next) =>
{
	try
	{
		const method = req.method;
		const path = normalize_path(req.path || '/');
		const endpoint = match_endpoint(method, path);

		if (endpoint.route !== null)
		{
			const name = `${method} ${path}`;
			newrelic.setTransactionName(name);
			newrelic.addCustomAttribute('custom_name', name);
			newrelic.addCustomAttribute('custom_method', method);
			newrelic.addCustomAttribute('custom_path', path);
			newrelic.addCustomAttribute('custom_ip', 'no_ip');
			newrelic.addCustomAttribute('custom_endpoint', `${method} ${endpoint.route}`);
			newrelic.addCustomAttribute('custom_map', endpoint.map);
			newrelic.addCustomAttribute('custom_file', endpoint.file);
			newrelic.addCustomAttribute('custom_error', null);
		}

		const limiters = [default_limiter];

		if (endpoint.route === '/search')
			limiters.push(search_limiter);

		else if (endpoint.route === '/request/new' || endpoint.route === '/maps/{map}/edit')
			limiters.push(github_limiter, github_long_limiter);

		const ip = requestIp.getClientIp(req) || req.ip;

		if (!ip)
			throw new InvalidRequestError('No IP');

		if (endpoint.route !== null)
			newrelic.addCustomAttribute('custom_ip', ip);

		try
		{
			for (const limiter of limiters)
				await limiter.consume(ip);
		}

		catch (error)
		{
			throw new TooManyRequestsError('Too many requests');
		}

		return next();
	}

	catch (error)
	{
		return next(error);
	}
});

app.use((err, req, res, next) =>
{
	console.error(err);

	if (endpoint.route !== null)
		newrelic.addCustomAttribute('custom_error', err.message);

	if (err instanceof InvalidRequestError)
		return res.status(400).send(err.message);

	if (err instanceof TooManyRequestsError)
		return res.status(429).send(err.message);

	return res.status(500).send('Internal server error');
});

app.use(handler);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
