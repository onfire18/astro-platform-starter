import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { uploadDisabled } from '../../utils';
import { isSameOrigin, sanitizeKey } from '../../utils/security';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (!isSameOrigin(request)) {
        return new Response('Forbidden', { status: 403 });
    }

    if (uploadDisabled) {
        return new Response('Forbidden: uploads are disabled', { status: 403 });
    }

    let parameters: Record<string, unknown>;
    try {
        parameters = await request.json();
    } catch {
        return new Response('Bad Request: invalid JSON body', { status: 400 });
    }

    const rawName = parameters.name;
    if (typeof rawName !== 'string' || !rawName) {
        return new Response('Bad Request: name is required', { status: 400 });
    }

    const key = sanitizeKey(rawName);
    if (!key) {
        return new Response('Bad Request: invalid name format', { status: 400 });
    }

    try {
        const blobStore = getStore('shapes');
        await blobStore.setJSON(key, { ...parameters, name: key });
        return new Response(JSON.stringify({ message: `Stored shape "${key}"` }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('[api/blobs POST] error storing blob:', key, e);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const GET: APIRoute = async () => {
    try {
        const blobStore = getStore({ name: 'shapes', consistency: 'strong' });
        const data = await blobStore.list();
        const keys = data.blobs.map(({ key }) => key);
        return new Response(JSON.stringify({ keys }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('[api/blobs GET] error listing blobs:', e);
        return new Response(JSON.stringify({ keys: [], error: 'Failed listing blobs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
