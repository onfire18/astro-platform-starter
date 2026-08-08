// Alphanumeric plus hyphens, underscores, dots — no path traversal or injection chars
const KEY_PATTERN = /^[a-zA-Z0-9_\-.]{1,256}$/;

export function isSameOrigin(request: Request): boolean {
    const origin = request.headers.get('origin');
    // Same-origin browser requests often omit the Origin header
    if (!origin) return true;
    const host = request.headers.get('host');
    try {
        return new URL(origin).host === host;
    } catch {
        return false;
    }
}

export function sanitizeKey(key: string): string | null {
    if (!KEY_PATTERN.test(key)) return null;
    return key;
}

export function sanitizeTags(tags: unknown): string[] | null {
    if (!Array.isArray(tags) || tags.length === 0 || tags.length > 50) return null;
    const sanitized: string[] = [];
    for (const tag of tags) {
        if (typeof tag !== 'string') return null;
        // Strip anything outside alphanumeric, hyphens, underscores, slashes, dots
        const clean = tag.replace(/[^a-zA-Z0-9_\-./]/g, '');
        if (clean.length === 0 || clean.length > 256) return null;
        sanitized.push(clean);
    }
    return sanitized;
}
