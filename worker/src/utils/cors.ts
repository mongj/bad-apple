/**
 * @file CORS headers helper.
 */
const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Max-Age': '86400',
};

function emptyCorsResponse(corsHeaders = CORS_HEADERS): Response {
	const headers = new Headers(corsHeaders);
	const status = 204;
	const statusText = 'No Content';
	return new Response('', { status, statusText, headers });
}

export { CORS_HEADERS, emptyCorsResponse };
