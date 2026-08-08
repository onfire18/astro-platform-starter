import type { APIRoute } from 'astro';
import { purgeCache } from '@netlify/functions';
import { isSameOrigin, sanitizeTags } from '../../utils/security';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (!isSameOrigin(request)) {
        return new Response('Forbidden', { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return new Response('Bad Request: invalid JSON body', { status: 400 });
    }

    const tags = sanitizeTags(body.tags);
    if (!tags) {
        return new Response(
            'Bad Request: expected tags — a non-empty array of up to 50 strings',
            { status: 400 }
        );
    }

    try {
        await purgeCache({ tags });
        return new Response(JSON.stringify({ invalidated: tags }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('[api/revalidate POST] error purging cache:', tags, e);
        return new Response('Internal Server Error', { status: 500 });
    }
};
