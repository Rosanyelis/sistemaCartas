export function readXsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

export async function postJson<T>(
    url: string,
    body: unknown,
): Promise<{ ok: boolean; data: T; status: number }> {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': readXsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as T;

    return { ok: res.ok, data, status: res.status };
}
