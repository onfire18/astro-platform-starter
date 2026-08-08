import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { sanitizeKey } from '../../utils/security';

export const prerender = false;

export const GET: APIRoute = async (context) => {
    const urlParams = new URL(context.url);
    const rawKey = urlParams.searchParams.get('key');
    if (!rawKey) {
        return new Response('Bad Request: key is required', { status: 400 });
    }

    const key = sanitizeKey(rawKey);
    if (!key) {
        return new Response('Bad Request: invalid key format', { status: 400 });
    }

    try {
        const blobStore = getStore('shapes');
        const blob = await blobStore.get(key, { type: 'json' });
        return new Response(JSON.stringify({ blob }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('[api/blob GET] error fetching key:', key, e);
        return new Response('Internal Server Error', { status: 500 });
    }
};
