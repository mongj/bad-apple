import { CORS_HEADERS, emptyCorsResponse } from './utils/cors';
import { errorResponse } from './utils/responses';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return emptyCorsResponse();
		}
		const frameNumber = request.url.split('/').pop();
		if (!frameNumber) {
			return errorResponse('No frame number provided', 400);
		}
		const value = await env.BAD_APPLE_DATA.get(frameNumber);
		return new Response(value, {
			headers: {
				...CORS_HEADERS,
			},
		});
	},
} satisfies ExportedHandler<Env>;
