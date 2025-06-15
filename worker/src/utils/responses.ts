/**
 * @file Common responses
 */

import { CORS_HEADERS } from './cors';

function errorResponse(error: string, status: number): Response {
	return new Response(JSON.stringify({ error }), { status, headers: { 'content-type': 'application/json' } });
}

function jsonResponse(json: Record<string, unknown>): Response {
	return new Response(JSON.stringify(json), {
		headers: { ...CORS_HEADERS, ...{ 'Content-Type': 'application/json' } },
	});
}

export { errorResponse, jsonResponse };
