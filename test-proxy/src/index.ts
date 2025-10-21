/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const getDestinationUrl = (url: URL): URL => {
	const destinationUrl = new URL(url);

	const serviceUrlString = "http://localhost:2222";
	const serviceUrl = new URL(serviceUrlString);
	destinationUrl.protocol = serviceUrl.protocol;
	destinationUrl.hostname = serviceUrl.hostname;
	destinationUrl.port = serviceUrl.port;
	return destinationUrl;
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const requestUrl = new URL(request.url);
		const destinationUrl = getDestinationUrl(requestUrl);
		const isGetOrHead = request.method === 'GET' || request.method === 'HEAD';

		// Fixes TypeError: Request with GET/HEAD method cannot have body.
		const body = isGetOrHead ? null : request.body;
		const newRequest = new Request(destinationUrl, {
			method: request.method,
			headers: request.headers,
			body,
			redirect: 'manual',
		});
		let response = (await fetch(newRequest)) as unknown as Response;

		const newHeaders = new Headers(newRequest.headers);
		newHeaders.set('X-Robots-Tag', 'noindex, nofollow');
		newHeaders.append('Set-Cookie', 'session_id=abc123;');
		newHeaders.append('Set-Cookie', 'test1=abc123,test2=abc123,test3=abc123,');
		newHeaders.append('Set-Cookie', 'test_id=abc123;');

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	},
} satisfies ExportedHandler<Env>;
