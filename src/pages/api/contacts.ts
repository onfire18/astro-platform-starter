import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

export const prerender = false;

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    source: string;
    status: 'new' | 'contacted' | 'converted' | 'lost';
    notes: string;
    createdAt: string;
}

const STORE = 'contacts';

export const GET: APIRoute = async () => {
    try {
        const store = getStore({ name: STORE, consistency: 'strong' });
        const { blobs } = await store.list();
        const contacts = (
            await Promise.all(blobs.map(({ key }) => store.get(key, { type: 'json' })))
        ).filter(Boolean) as Contact[];
        contacts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return new Response(JSON.stringify({ contacts }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch {
        return new Response(JSON.stringify({ contacts: [], unavailable: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const contact: Contact = {
            id: Date.now().toString(),
            name: data.name ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
            company: data.company ?? '',
            source: data.source ?? '',
            status: data.status ?? 'new',
            notes: data.notes ?? '',
            createdAt: new Date().toISOString(),
        };
        const store = getStore(STORE);
        await store.setJSON(contact.id, contact);
        return new Response(JSON.stringify({ contact }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const PUT: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const store = getStore(STORE);
        await store.setJSON(data.id, data);
        return new Response(JSON.stringify({ contact: data }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

export const DELETE: APIRoute = async ({ url }) => {
    try {
        const id = new URL(url).searchParams.get('id');
        if (!id) return new Response('Missing id', { status: 400 });
        const store = getStore(STORE);
        await store.delete(id);
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
