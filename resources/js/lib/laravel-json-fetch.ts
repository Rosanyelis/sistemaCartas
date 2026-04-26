function readCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`));
    return match ? decodeURIComponent(match[2]) : null;
}

export type JsonFetchErrorBody = {
    message?: string;
    errors?: Record<string, string[]>;
};

export async function laravelJsonFetch<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
    const token = readCookie('XSRF-TOKEN');
    const headers = new Headers(init.headers);
    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }
    if (init.method && init.method.toUpperCase() !== 'GET' && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    if (token) {
        headers.set('X-XSRF-TOKEN', token);
    }
    headers.set('X-Requested-With', 'XMLHttpRequest');

    const res = await fetch(input, {
        credentials: 'same-origin',
        ...init,
        headers,
    });

    const text = await res.text();
    let body: unknown = null;
    if (text) {
        try {
            body = JSON.parse(text) as unknown;
        } catch {
            body = { message: text };
        }
    }

    if (res.status === 204) {
        return null as T;
    }

    if (!res.ok) {
        const err = body as JsonFetchErrorBody;
        const msg =
            err?.message ||
            (err?.errors && Object.values(err.errors).flat().join(' ')) ||
            `Error ${res.status}`;
        throw new Error(msg);
    }

    return body as T;
}
